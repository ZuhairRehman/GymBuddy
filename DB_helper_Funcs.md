-- Function to register a new user with a specific role
CREATE OR REPLACE FUNCTION register_user(
    _email TEXT,
    _password TEXT,
    _full_name TEXT,
    _mobile_number TEXT,
    _role user_role,
    _membership_number TEXT DEFAULT NULL -- Added optional membership_number parameter
  ) RETURNS UUID AS $$
DECLARE _user_id UUID;
BEGIN -- Create user in auth.users (this would typically be handled by Supabase Auth)
-- NOTE: In a real implementation, you'd use Supabase's signup API rather than this approach
-- This is just for demonstration purposes
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES (_email, crypt(_password, gen_salt('bf')), NOW())
RETURNING id INTO _user_id;
-- Create profile
INSERT INTO profiles (id, full_name, mobile_number, role)
VALUES (_user_id, _full_name, _mobile_number, _role);
-- Create role-specific profile
CASE
  WHEN _role = 'member' THEN
  INSERT INTO member_profiles (id)
  VALUES (_user_id);
WHEN _role = 'trainer' THEN
INSERT INTO trainer_profiles (id, years_experience, specializations)
VALUES (_user_id, 0, ARRAY []::TEXT []);
ELSE -- For gym owners, no additional profile needed
NULL;
END CASE
;
RETURN _user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION register_gym(
    _owner_id UUID,
    _name TEXT,
    _description TEXT,
    _email TEXT,
    _mobile_number TEXT,
    _address_line1 TEXT,
    _address_line2 TEXT,
    _city TEXT,
    _state TEXT,
    _pin_code TEXT
  ) RETURNS UUID AS $$
DECLARE _gym_id UUID;
_owner_role user_role;
_join_code TEXT;
_code_exists BOOLEAN := TRUE;
BEGIN -- Check if user is a gym owner
SELECT role INTO _owner_role
FROM profiles
WHERE id = _owner_id;
IF _owner_role != 'owner' THEN RAISE EXCEPTION 'Only gym owners can register gyms';
END IF;
-- Create gym
INSERT INTO gyms (
    owner_id,
    name,
    description,
    business_email,
    business_phone_number,
    address_line1,
    address_line2,
    city,
    state,
    pin_code
  )
VALUES (
    _owner_id,
    _name,
    _description,
    _email,
    _mobile_number,
    _address_line1,
    _address_line2,
    _city,
    _state,
    _pin_code
  )
RETURNING id INTO _gym_id;
-- Generate unique join code
WHILE _code_exists LOOP _join_code := substr(uuid_generate_v4()::TEXT, 1, 8);
-- Take first 8 characters of UUID
SELECT EXISTS (
    SELECT 1
    FROM gyms
    WHERE join_code = _join_code
  ) INTO _code_exists;
IF NOT _code_exists THEN
UPDATE gyms
SET join_code = _join_code
WHERE id = _gym_id;
END IF;
END LOOP;
RETURN _gym_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add a trainer to a gym
CREATE OR REPLACE FUNCTION add_trainer_to_gym(
    _gym_id UUID,
    _trainer_id UUID,
    _status trainer_status DEFAULT 'pending'
  ) RETURNS UUID AS $$
DECLARE _relationship_id UUID;
_trainer_role user_role;
BEGIN -- Check if user is a trainer
SELECT role INTO _trainer_role
FROM profiles
WHERE id = _trainer_id;
IF _trainer_role != 'trainer' THEN RAISE EXCEPTION 'Only trainers can be added to gyms as trainers';
END IF;

-- Create relationship
INSERT INTO gym_trainers (gym_id, trainer_id, status)
VALUES (_gym_id, _trainer_id, _status)
RETURNING id INTO _relationship_id;
RETURN _relationship_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION join_gym_with_code(
    _join_code TEXT,
    _user_id UUID,
    _role user_role
  ) RETURNS BOOLEAN AS $$
DECLARE _gym_id UUID;
_user_role_check user_role;
_already_member BOOLEAN := FALSE;
_already_trainer BOOLEAN := FALSE;
_gym_exists BOOLEAN;
BEGIN -- First verify gym exists (bypass RLS with security definer)
SELECT EXISTS (
    SELECT 1
    FROM gyms
    WHERE join_code = _join_code
  ) INTO _gym_exists;
IF NOT _gym_exists THEN RAISE NOTICE 'Invalid join code: %',
_join_code;
RETURN FALSE;
END IF;
-- Get gym ID (bypass RLS)
SELECT id INTO _gym_id
FROM gyms
WHERE join_code = _join_code
LIMIT 1;
-- Verify user role
SELECT role INTO _user_role_check
FROM profiles
WHERE id = _user_id;
IF _user_role_check IS NULL
OR _user_role_check != _role THEN RAISE NOTICE 'User % has role % but tried joining as %',
_user_id,
_user_role_check,
_role;
RETURN FALSE;
END IF;
-- Handle member join
IF _role = 'member' THEN -- Check existing membership (bypass RLS)
SELECT EXISTS (
    SELECT 1
    FROM gym_members
    WHERE gym_id = _gym_id
      AND member_id = _user_id
  ) INTO _already_member;
IF _already_member THEN RAISE NOTICE 'User % is already a member of gym %',
_user_id,
_gym_id;
RETURN FALSE;
END IF;
-- Add member with RLS enforced
INSERT INTO gym_members (gym_id, member_id, status)
VALUES (_gym_id, _user_id, 'active');
RAISE NOTICE 'Member % successfully joined gym %',
_user_id,
_gym_id;
RETURN TRUE;
-- Handle trainer join
ELSIF _role = 'trainer' THEN -- Check existing trainer relationship (bypass RLS)
SELECT EXISTS (
    SELECT 1
    FROM gym_trainers
    WHERE gym_id = _gym_id
      AND trainer_id = _user_id
  ) INTO _already_trainer;
IF _already_trainer THEN RAISE NOTICE 'User % is already a trainer at gym %',
_user_id,
_gym_id;
RETURN FALSE;
END IF;
-- Add trainer with RLS enforced (status pending by default)
INSERT INTO gym_trainers (gym_id, trainer_id, status)
VALUES (_gym_id, _user_id, 'pending');
RAISE NOTICE 'Trainer % requested to join gym % (pending approval)',
_user_id,
_gym_id;
RETURN TRUE;
ELSE RAISE NOTICE 'Invalid role: %',
_role;
RETURN FALSE;
END IF;
EXCEPTION
WHEN others THEN RAISE NOTICE 'Error joining gym: %',
SQLERRM;
RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- Function to create a new membership plan
CREATE OR REPLACE FUNCTION create_membership_plan(
    _gym_id UUID,
    _membership_type_id UUID,
    _name TEXT,
    _duration_months INTEGER,
    _base_price NUMERIC(10, 2),
    _joining_fee NUMERIC(10, 2),
    _max_members INTEGER,
  ) RETURNS UUID AS $$
DECLARE _plan_id UUID;
BEGIN -- Verify gym ownership
IF NOT is_gym_owner(_gym_id) THEN RAISE EXCEPTION 'Only gym owners can create membership plans';
END IF;
-- Verify membership type exists
IF NOT EXISTS (
  SELECT 1
  FROM membership_types
  WHERE id = _membership_type_id
) THEN RAISE EXCEPTION 'Invalid membership type';
END IF;
INSERT INTO membership_plans (
    gym_id,
    membership_type_id,
    name,
    duration_months,
    base_price,
    joining_fee,
    max_members,
  )
VALUES (
    _gym_id,
    _membership_type_id,
    _name,
    _duration_months,
    _base_price,
    _joining_fee,
    _max_members,
  )
RETURNING id INTO _plan_id;
RETURN _plan_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE membership_types
ADD COLUMN base_facilities TEXT [];
ALTER TABLE membership_plans
ADD COLUMN time_restrictions JSONB;

-- Function to get available membership types for a gym
CREATE OR REPLACE FUNCTION get_gym_membership_types(_gym_id UUID) RETURNS TABLE (
    id UUID,
    name TEXT,
    description TEXT,
    plans JSONB
  ) AS $$ BEGIN RETURN QUERY
SELECT mt.id,
  mt.name,
  mt.description,
  COALESCE(
    (
      SELECT jsonb_agg(
          jsonb_build_object(
            'plan_id',
            mp.id,
            'plan_name',
            mp.name,
            'duration_months',
            mp.duration_months,
            'base_price',
            mp.base_price,
            'joining_fee',
            mp.joining_fee
          )
        )
      FROM membership_plans mp
      WHERE mp.membership_type_id = mt.id
        AND mp.gym_id = _gym_id
        AND mp.is_active = TRUE
    ),
    '[]'::jsonb
  ) AS plans
FROM membership_types mt;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

ALTER TABLE discounts
ADD CONSTRAINT valid_percentage CHECK (percentage > 0 AND percentage <= 100);

-- Function to insert a new membership plan
CREATE OR REPLACE FUNCTION insert_membership_plan(
  _gym_id UUID,
  _name TEXT,
  _duration_months INTEGER,
  _base_price NUMERIC(10,2),
  _joining_fee NUMERIC(10,2)
) RETURNS UUID AS $$
DECLARE
  _plan_id UUID;
BEGIN
  -- Verify gym ownership
  IF NOT is_gym_owner(_gym_id) THEN
    RAISE EXCEPTION 'Only gym owners can create membership plans';
  END IF;

  -- Insert the plan
  INSERT INTO membership_plans (
    gym_id,
    name,
    duration_months,
    base_price,
    joining_fee,
    is_active
  ) VALUES (
    _gym_id,
    _name,
    _duration_months,
    _base_price,
    _joining_fee,
    true
  ) RETURNING id INTO _plan_id;

  RETURN _plan_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to insert a new discount
CREATE OR REPLACE FUNCTION insert_discount(
  _gym_id UUID,
  _name TEXT,
  _percentage NUMERIC(5,2)
) RETURNS UUID AS $$
DECLARE
  _discount_id UUID;
BEGIN
  -- Verify gym ownership
  IF NOT is_gym_owner(_gym_id) THEN
    RAISE EXCEPTION 'Only gym owners can create discounts';
  END IF;

  -- Validate percentage
  IF _percentage <= 0 OR _percentage > 100 THEN
    RAISE EXCEPTION 'Discount percentage must be between 0 and 100';
  END IF;

  -- Insert the discount
  INSERT INTO discounts (
    gym_id,
    name,
    percentage,
    is_active
  ) VALUES (
    _gym_id,
    _name,
    _percentage,
    true
  ) RETURNING id INTO _discount_id;

  RETURN _discount_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;