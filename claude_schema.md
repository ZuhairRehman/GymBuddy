-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types for various status fields
CREATE TYPE user_role AS ENUM ('owner', 'trainer', 'member');
CREATE TYPE membership_status AS ENUM ('active', 'inactive', 'expired');
CREATE TYPE trainer_status AS ENUM ('pending', 'active', 'inactive');

-- Profiles table (extends the auth.users table that Supabase manages)
CREATE TABLE profiles (
id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
full_name TEXT ,
mobile_number TEXT NOT NULL,
avatar_url TEXT,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
role user_role NOT NULL
);

-- Member profiles table
CREATE TABLE member_profiles (
id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
age INTEGER,
height NUMERIC(5,2),
weight NUMERIC(5,2),
fitness_goals TEXT[],
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trainer profiles table
CREATE TABLE trainer_profiles (
id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
years_experience INTEGER NOT NULL DEFAULT 0,
certifications TEXT[],
specializations TEXT[] NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gyms table
CREATE TABLE gyms (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
name TEXT NOT NULL,
description TEXT,
business_email TEXT NOT NULL,
business_phone_number TEXT NOT NULL,
address_line1 TEXT NOT NULL,
address_line2 TEXT,
city TEXT NOT NULL,
state TEXT NOT NULL,
pin_code TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gym facilities table
CREATE TABLE gym_facilities (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
facility_name TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gym trainers relationship table
CREATE TABLE gym_trainers (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
trainer_id UUID NOT NULL REFERENCES trainer_profiles(id) ON DELETE CASCADE,
status trainer_status NOT NULL DEFAULT 'pending',
joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
UNIQUE(gym_id, trainer_id)
);

-- Gym members relationship table
CREATE TABLE gym_members (
id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
member_id UUID NOT NULL REFERENCES member_profiles(id) ON DELETE CASCADE,
status membership_status NOT NULL DEFAULT 'active',
membership_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
membership_end TIMESTAMP WITH TIME ZONE,
created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
UNIQUE(gym_id, member_id)
);

-- Create indexes for performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_gym_trainers_gym_id ON gym_trainers(gym_id);
CREATE INDEX idx_gym_trainers_trainer_id ON gym_trainers(trainer_id);
CREATE INDEX idx_gym_members_gym_id ON gym_members(gym_id);
CREATE INDEX idx_gym_members_member_id ON gym_members(member_id);
CREATE INDEX idx_gyms_owner_id ON gyms(owner_id);
CREATE INDEX idx_gyms_name ON gyms(name); -- Index for gym name search

-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = NOW();
RETURN NEW;
END;

$$
LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_member_profiles_updated_at
BEFORE UPDATE ON member_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_trainer_profiles_updated_at
BEFORE UPDATE ON trainer_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gyms_updated_at
BEFORE UPDATE ON gyms
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gym_facilities_updated_at
BEFORE UPDATE ON gym_facilities
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gym_members_updated_at
BEFORE UPDATE ON gym_members
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.gyms
ADD COLUMN join_code TEXT UNIQUE;


### ***RLS *** POLICIES *** ###

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_members ENABLE ROW LEVEL SECURITY;

-- Profiles table policies
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- Member profiles policies
-- Members can view their own profile
CREATE POLICY "Members can view own profile"
ON member_profiles FOR SELECT
USING (auth.uid() = id);

-- Members can update their own profile
CREATE POLICY "Members can update own profile"
ON member_profiles FOR UPDATE
USING (auth.uid() = id);

-- Trainers can view member profiles of their gym
CREATE POLICY "Trainers can view member profiles of their gym"
ON member_profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'trainer'
    AND EXISTS (
      SELECT 1 FROM gym_trainers
      WHERE gym_trainers.trainer_id = auth.uid()
      AND gym_trainers.status = 'active'
      AND EXISTS (
        SELECT 1 FROM gym_members
        WHERE gym_members.gym_id = gym_trainers.gym_id
        AND gym_members.member_id = member_profiles.id
      )
    )
  )
);

-- Gym owners can view all member profiles in their gyms
CREATE POLICY "Gym owners can view all member profiles in their gyms"
ON member_profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'owner'
    AND EXISTS (
      SELECT 1 FROM gyms
      WHERE gyms.owner_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM gym_members
        WHERE gym_members.gym_id = gyms.id
        AND gym_members.member_id = member_profiles.id
      )
    )
  )
);

-- Trainer profiles policies
-- Trainers can view and update their own profile
CREATE POLICY "Trainers can view own profile"
ON trainer_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Trainers can update own profile"
ON trainer_profiles FOR UPDATE
USING (auth.uid() = id);

-- Gym owners can view trainer profiles in their gyms
CREATE POLICY "Gym owners can view trainer profiles in their gyms"
ON trainer_profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'owner'
    AND EXISTS (
      SELECT 1 FROM gyms
      WHERE gyms.owner_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM gym_trainers
        WHERE gym_trainers.gym_id = gyms.id
        AND gym_trainers.trainer_id = trainer_profiles.id
      )
    )
  )
);

-- Members can view trainer profiles in their gyms
CREATE POLICY "Members can view trainer profiles in their gyms"
ON trainer_profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'member'
    AND EXISTS (
      SELECT 1 FROM gym_members
      WHERE gym_members.member_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM gym_trainers
        WHERE gym_trainers.gym_id = gym_members.gym_id
        AND gym_trainers.trainer_id = trainer_profiles.id
      )
    )
  )
);

-- Gyms table policies
-- Gym owners can view, update, and delete their own gyms
CREATE POLICY "Gym owners can view their own gyms"
ON gyms FOR SELECT
USING (owner_id = auth.uid());

CREATE POLICY "Gym owners can update their own gyms"
ON gyms FOR UPDATE
USING (owner_id = auth.uid());

CREATE POLICY "Gym owners can delete their own gyms"
ON gyms FOR DELETE
USING (owner_id = auth.uid());

-- Gym owners can insert gyms
CREATE POLICY "Gym owners can insert gyms"
ON gyms FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'owner'
  )
);

-- Trainers and members can view gyms they belong to
CREATE POLICY "Trainers can view gyms they work at"
ON gyms FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM gym_trainers
    WHERE gym_trainers.gym_id = gyms.id
    AND gym_trainers.trainer_id = auth.uid()
  )
);

CREATE POLICY "Members can view gyms they belong to"
ON gyms FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM gym_members
    WHERE gym_members.gym_id = gyms.id
    AND gym_members.member_id = auth.uid()
  )
);

-- Gym facilities policies
-- Owners can manage facilities of their gyms
CREATE POLICY "Gym owners can view facilities of their gyms"
ON gym_facilities FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM gyms
    WHERE gyms.id = gym_facilities.gym_id
    AND gyms.owner_id = auth.uid()
  )
);

CREATE POLICY "Gym owners can insert facilities for their gyms"
ON gym_facilities FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM gyms
    WHERE gyms.id = gym_facilities.gym_id
    AND gyms.owner_id = auth.uid()
  )
);

CREATE POLICY "Gym owners can update facilities of their gyms"
ON gym_facilities FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM gyms
    WHERE gyms.id = gym_facilities.gym_id
    AND gyms.owner_id = auth.uid()
  )
);

CREATE POLICY "Gym owners can delete facilities of their gyms"
ON gym_facilities FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM gyms
    WHERE gyms.id = gym_facilities.gym_id
    AND gyms.owner_id = auth.uid()
  )
);

-- Trainers and members can view facilities of their gyms
CREATE POLICY "Trainers can view facilities of their gyms"
ON gym_facilities FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM gym_trainers
    WHERE gym_trainers.gym_id = gym_facilities.gym_id
    AND gym_trainers.trainer_id = auth.uid()
  )
);

CREATE POLICY "Members can view facilities of their gyms"
ON gym_facilities FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM gym_members
    WHERE gym_members.gym_id = gym_facilities.gym_id
    AND gym_members.member_id = auth.uid()
  )
);

-- Gym trainers relationship policies
-- Gym owners can manage trainer relationships
CREATE POLICY "Gym owners can view trainer relationships"
ON gym_trainers FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM gyms
    WHERE gyms.id = gym_trainers.gym_id
    AND gyms.owner_id = auth.uid()
  )
);

CREATE POLICY "Gym owners can insert trainer relationships"
ON gym_trainers FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM gyms
    WHERE gyms.id = gym_trainers.gym_id
    AND gyms.owner_id = auth.uid()
  )
);

CREATE POLICY "Gym owners can update trainer relationships"
ON gym_trainers FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM gyms
    WHERE gyms.id = gym_trainers.gym_id
    AND gyms.owner_id = auth.uid()
  )
);

CREATE POLICY "Gym owners can delete trainer relationships"
ON gym_trainers FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM gyms
    WHERE gyms.id = gym_trainers.gym_id
    AND gyms.owner_id = auth.uid()
  )
);

-- Trainers can view their own gym relationships
CREATE POLICY "Trainers can view their own gym relationships"
ON gym_trainers FOR SELECT
USING (trainer_id = auth.uid());

-- Gym members relationship policies
-- Similar policies for gym_members table
CREATE POLICY "Gym owners can manage member relationships"
ON gym_members FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM gyms
    WHERE gyms.id = gym_members.gym_id
    AND gyms.owner_id = auth.uid()
  )
);

CREATE POLICY "Trainers can view member relationships in their gyms"
ON gym_members FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM gym_trainers
    WHERE gym_trainers.gym_id = gym_members.gym_id
    AND gym_trainers.trainer_id = auth.uid()
    AND gym_trainers.status = 'active'
  )
);

CREATE POLICY "Members can view their own gym relationships"
ON gym_members FOR SELECT
USING (member_id = auth.uid());
$$

-- Policy to allow authenticated members to insert themselves into a gym
CREATE POLICY "Allow authenticated members to join gyms"
ON public.gym_members
FOR INSERT
WITH CHECK (
  member_id = auth.uid() AND
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'member'
);

-- Policy to allow authenticated trainers to request to join gyms
CREATE POLICY "Allow authenticated trainers to request to join gyms"
ON public.gym_trainers
FOR INSERT
WITH CHECK (
  trainer_id = auth.uid() AND
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'trainer'
);

## ***Helper Functions* ##
-- Function to register a new user with a specific role
CREATE OR REPLACE FUNCTION register_user(
  _email TEXT,
  _password TEXT,
  _full_name TEXT,
  _mobile_number TEXT,
  _role user_role,
  _membership_number TEXT DEFAULT NULL -- Added optional membership_number parameter
)
RETURNS UUID AS $$
DECLARE
  _user_id UUID;
BEGIN
  -- Create user in auth.users (this would typically be handled by Supabase Auth)
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
      INSERT INTO member_profiles (id, membership_number) VALUES (_user_id, _membership_number); -- Insert membership_number here
    WHEN _role = 'trainer' THEN
      INSERT INTO trainer_profiles (id, years_experience, specializations)
      VALUES (_user_id, 0, ARRAY[]::TEXT[]);
    ELSE
      -- For gym owners, no additional profile needed
      NULL;
  END CASE;
 
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
)
RETURNS UUID AS $$
DECLARE
    _gym_id UUID;
    _owner_role user_role;
    _join_code TEXT;
    _code_exists BOOLEAN := TRUE;
BEGIN
    -- Check if user is a gym owner
    SELECT role INTO _owner_role FROM profiles WHERE id = _owner_id;

    IF _owner_role != 'owner' THEN
        RAISE EXCEPTION 'Only gym owners can register gyms';
    END IF;

    -- Create gym
    INSERT INTO gyms (
        owner_id, name, description, email, mobile_number,
        address_line1, address_line2, city, state, pin_code
    )
    VALUES (
        _owner_id, _name, _description, _email, _mobile_number,
        _address_line1, _address_line2, _city, _state, _pin_code
    )
    RETURNING id INTO _gym_id;

    -- Generate unique join code
    WHILE _code_exists LOOP
        _join_code := substr(uuid_generate_v4()::TEXT, 1, 8); -- Take first 8 characters of UUID
        SELECT EXISTS (SELECT 1 FROM gyms WHERE join_code = _join_code) INTO _code_exists;
        IF NOT _code_exists THEN
            UPDATE gyms SET join_code = _join_code WHERE id = _gym_id;
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
)
RETURNS UUID AS $$
DECLARE
  _relationship_id UUID;
  _trainer_role user_role;
BEGIN
  -- Check if user is a trainer
  SELECT role INTO _trainer_role FROM profiles WHERE id = _trainer_id;
  
  IF _trainer_role != 'trainer' THEN
    RAISE EXCEPTION 'Only trainers can be added to gyms as trainers';
  END IF;
  
  -- Create relationship
  INSERT INTO gym_trainers (gym_id, trainer_id, status)
  VALUES (_gym_id, _trainer_id, _status)
  RETURNING id INTO _relationship_id;
  
  RETURN _relationship_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add a member to a gym
CREATE OR REPLACE FUNCTION add_member_to_gym(
  _gym_id UUID,
  _member_id UUID,
  _membership_end TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  _relationship_id UUID;
  _member_role user_role;
BEGIN
  -- Check if user is a member
  SELECT role INTO _member_role FROM profiles WHERE id = _member_id;
  
  IF _member_role != 'member' THEN
    RAISE EXCEPTION 'Only members can be added to gyms as members';
  END IF;
  
  -- Create relationship
  INSERT INTO gym_members (gym_id, member_id, membership_start, membership_end)
  VALUES (_gym_id, _member_id, NOW(), _membership_end)
  RETURNING id INTO _relationship_id;
  
  RETURN _relationship_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION join_gym_with_code(
    _join_code TEXT,
    _user_id UUID,
    _role user_role
)
RETURNS BOOLEAN AS $$
DECLARE
    _gym_id UUID;
    _user_role_check user_role;
    _already_member BOOLEAN := FALSE;
    _already_trainer BOOLEAN := FALSE;
BEGIN
    -- Find the gym with the given join code
    SELECT id INTO _gym_id FROM gyms WHERE join_code = _join_code;
    IF _gym_id IS NULL THEN
        RAISE NOTICE 'Invalid join code: %', _join_code;
        RETURN FALSE;
    END IF;

    -- Check if the user exists and has the specified role
    SELECT role INTO _user_role_check FROM profiles WHERE id = _user_id;
    IF _user_role_check IS NULL OR _user_role_check != _role THEN
        RAISE NOTICE 'Invalid user or role for ID: %, Role: %', _user_id, _role;
        RETURN FALSE;
    END IF;

    -- Check if the user is already associated with the gym
    IF _role = 'member' THEN
        SELECT EXISTS (SELECT 1 FROM gym_members WHERE gym_id = _gym_id AND member_id = _user_id) INTO _already_member;
        IF _already_member THEN
            RAISE NOTICE 'User % is already a member of gym %', _user_id, _gym_id;
            RETURN FALSE;
        END IF;
        -- Add the member to the gym
        PERFORM add_member_to_gym(_gym_id, _user_id);
    ELSIF _role = 'trainer' THEN
        SELECT EXISTS (SELECT 1 FROM gym_trainers WHERE gym_id = _gym_id AND trainer_id = _user_id) INTO _already_trainer;
        IF _already_trainer THEN
            RAISE NOTICE 'User % is already a trainer at gym %', _user_id, _gym_id;
            RETURN FALSE;
        END IF;
        -- Add the trainer to the gym (default status 'pending')
        PERFORM add_trainer_to_gym(_gym_id, _user_id, 'pending');
    ELSE
        RAISE NOTICE 'Invalid role provided: %', _role;
        RETURN FALSE;
    END IF;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;