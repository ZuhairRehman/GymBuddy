-- First create helper functions to prevent recursion
CREATE OR REPLACE FUNCTION is_gym_owner(_gym_id UUID) RETURNS BOOLEAN AS $$ BEGIN RETURN EXISTS (
    SELECT 1
    FROM gyms
    WHERE id = _gym_id
      AND owner_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;
CREATE OR REPLACE FUNCTION get_user_role() RETURNS user_role AS $$
DECLARE _role user_role;
BEGIN
SELECT role INTO _role
FROM profiles
WHERE id = auth.uid();
RETURN _role;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gyms ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE gym_members ENABLE ROW LEVEL SECURITY;
-- Profiles table policies
CREATE POLICY "Users can view own profile" ON profiles FOR
SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR
UPDATE USING (auth.uid() = id);
-- Member profiles policies
CREATE POLICY "Members can view own profile" ON member_profiles FOR
SELECT USING (auth.uid() = id);
CREATE POLICY "Members can update own profile" ON member_profiles FOR
UPDATE USING (auth.uid() = id);
CREATE POLICY "Trainers can view member profiles of their gym" ON member_profiles FOR
SELECT USING (
    get_user_role() = 'trainer'
    AND EXISTS (
      SELECT 1
      FROM gym_trainers gt
        JOIN gym_members gm ON gt.gym_id = gm.gym_id
      WHERE gt.trainer_id = auth.uid()
        AND gt.status = 'active'
        AND gm.member_id = member_profiles.id
    )
  );
CREATE POLICY "Gym owners can view all member profiles in their gyms" ON member_profiles FOR
SELECT USING (
    get_user_role() = 'owner'
    AND EXISTS (
      SELECT 1
      FROM gyms g
        JOIN gym_members gm ON g.id = gm.gym_id
      WHERE g.owner_id = auth.uid()
        AND gm.member_id = member_profiles.id
    )
  );
-- Trainer profiles policies
CREATE POLICY "Trainers can view own profile" ON trainer_profiles FOR
SELECT USING (auth.uid() = id);
CREATE POLICY "Trainers can update own profile" ON trainer_profiles FOR
UPDATE USING (auth.uid() = id);
CREATE POLICY "Gym owners can view trainer profiles in their gyms" ON trainer_profiles FOR
SELECT USING (
    get_user_role() = 'owner'
    AND EXISTS (
      SELECT 1
      FROM gyms g
        JOIN gym_trainers gt ON g.id = gt.gym_id
      WHERE g.owner_id = auth.uid()
        AND gt.trainer_id = trainer_profiles.id
    )
  );
CREATE POLICY "Members can view trainer profiles in their gyms" ON trainer_profiles FOR
SELECT USING (
    get_user_role() = 'member'
    AND EXISTS (
      SELECT 1
      FROM gym_members gm
        JOIN gym_trainers gt ON gm.gym_id = gt.gym_id
      WHERE gm.member_id = auth.uid()
        AND gt.trainer_id = trainer_profiles.id
    )
  );
-- Gyms table policies
CREATE POLICY "Gym owners can view their own gyms" ON gyms FOR
SELECT USING (owner_id = auth.uid());
CREATE POLICY "Gym owners can update their own gyms" ON gyms FOR
UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Gym owners can delete their own gyms" ON gyms FOR DELETE USING (owner_id = auth.uid());
CREATE POLICY "Gym owners can insert gyms" ON gyms FOR
INSERT WITH CHECK (get_user_role() = 'owner');
CREATE POLICY "Trainers can view gyms they work at" ON gyms FOR
SELECT USING (
    EXISTS (
      SELECT 1
      FROM gym_trainers
      WHERE gym_id = gyms.id
        AND trainer_id = auth.uid()
    )
  );
CREATE POLICY "Members can view gyms they belong to" ON gyms FOR
SELECT USING (
    EXISTS (
      SELECT 1
      FROM gym_members
      WHERE gym_id = gyms.id
        AND member_id = auth.uid()
    )
  );
-- Gym facilities policies
CREATE POLICY "Gym owners can view facilities of their gyms" ON gym_facilities FOR
SELECT USING (is_gym_owner(gym_id));
CREATE POLICY "Gym owners can insert facilities for their gyms" ON gym_facilities FOR
INSERT WITH CHECK (is_gym_owner(gym_id));
CREATE POLICY "Gym owners can update facilities of their gyms" ON gym_facilities FOR
UPDATE USING (is_gym_owner(gym_id));
CREATE POLICY "Gym owners can delete facilities of their gyms" ON gym_facilities FOR DELETE USING (is_gym_owner(gym_id));
CREATE POLICY "Trainers can view facilities of their gyms" ON gym_facilities FOR
SELECT USING (
    EXISTS (
      SELECT 1
      FROM gym_trainers
      WHERE gym_id = gym_facilities.gym_id
        AND trainer_id = auth.uid()
    )
  );
CREATE POLICY "Members can view facilities of their gyms" ON gym_facilities FOR
SELECT USING (
    EXISTS (
      SELECT 1
      FROM gym_members
      WHERE gym_id = gym_facilities.gym_id
        AND member_id = auth.uid()
    )
  );
-- Gym trainers relationship policies
CREATE POLICY "Gym owners can view trainer relationships" ON gym_trainers FOR
SELECT USING (is_gym_owner(gym_id));
CREATE POLICY "Gym owners can insert trainer relationships" ON gym_trainers FOR
INSERT WITH CHECK (is_gym_owner(gym_id));
CREATE POLICY "Gym owners can update trainer relationships" ON gym_trainers FOR
UPDATE USING (is_gym_owner(gym_id));
CREATE POLICY "Gym owners can delete trainer relationships" ON gym_trainers FOR DELETE USING (is_gym_owner(gym_id));
CREATE POLICY "Trainers can view their own gym relationships" ON gym_trainers FOR
SELECT USING (trainer_id = auth.uid());
-- Gym members relationship policies
CREATE POLICY "Gym owners can manage member relationships" ON gym_members FOR ALL USING (is_gym_owner(gym_id));
CREATE POLICY "Trainers can view member relationships in their gyms" ON gym_members FOR
SELECT USING (
    EXISTS (
      SELECT 1
      FROM gym_trainers
      WHERE gym_id = gym_members.gym_id
        AND trainer_id = auth.uid()
        AND status = 'active'
    )
  );
CREATE POLICY "Members can view their own gym relationships" ON gym_members FOR
SELECT USING (member_id = auth.uid());
-- Special join policies
CREATE POLICY "Allow authenticated members to join gyms" ON public.gym_members FOR
INSERT WITH CHECK (
    member_id = auth.uid()
    AND get_user_role() = 'member'
  );
CREATE POLICY "Allow authenticated trainers to request to join gyms" ON public.gym_trainers FOR
INSERT WITH CHECK (
    trainer_id = auth.uid()
    AND get_user_role() = 'trainer'
  );