-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Create ENUM types for various status fields
CREATE TYPE user_role AS ENUM ('owner', 'trainer', 'member');
CREATE TYPE membership_status AS ENUM ('active', 'inactive', 'expired');
CREATE TYPE trainer_status AS ENUM ('pending', 'active', 'inactive');
-- Profiles table (extends the auth.users table that Supabase manages)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
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
  height NUMERIC(5, 2),
  weight NUMERIC(5, 2),
  fitness_goals TEXT [],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- Trainer profiles table
CREATE TABLE trainer_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  years_experience INTEGER NOT NULL DEFAULT 0,
  certifications TEXT [],
  specializations TEXT [] NOT NULL,
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
CREATE INDEX idx_gyms_name ON gyms(name);
-- Index for gym name search
-- Create or replace function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_profiles_updated_at BEFORE
UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_member_profiles_updated_at BEFORE
UPDATE ON member_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trainer_profiles_updated_at BEFORE
UPDATE ON trainer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gyms_updated_at BEFORE
UPDATE ON gyms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gym_facilities_updated_at BEFORE
UPDATE ON gym_facilities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_gym_members_updated_at BEFORE
UPDATE ON gym_members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
ALTER TABLE public.gyms
ADD COLUMN join_code TEXT UNIQUE;

CREATE TABLE membership_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  duration_months INTEGER NOT NULL,
  base_price NUMERIC(10, 2) NOT NULL,
  joining_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
  max_members INTEGER,
  student_discount NUMERIC(5, 2) DEFAULT 0,
  corporate_discount NUMERIC(5, 2) DEFAULT 0,
  additional_notes TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE membership_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keeping the same structure but with Indian peak hours in mind
CREATE TABLE gym_capacity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  total_member_capacity INTEGER NOT NULL,
  simultaneous_users INTEGER NOT NULL,
  batch_duration_minutes INTEGER NOT NULL DEFAULT 60,
  gap_between_batches_minutes INTEGER NOT NULL DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gym_id)
);

CREATE TABLE peak_hours_capacity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  gym_id UUID NOT NULL REFERENCES gyms(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  expected_traffic INTEGER NOT NULL,
  max_allowed INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create triggers to automatically update the updated_at column
CREATE TRIGGER update_membership_plans_updated_at BEFORE
UPDATE ON membership_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gym_capacity_updated_at BEFORE
UPDATE ON gym_capacity FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_peak_hours_capacity_updated_at BEFORE
UPDATE ON peak_hours_capacity FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_membership_plans_gym_id ON membership_plans(gym_id);
CREATE INDEX idx_membership_plans_duration ON membership_plans(duration_months);
CREATE INDEX idx_gym_capacity_gym_id ON gym_capacity(gym_id);
CREATE INDEX idx_peak_hours_gym_id ON peak_hours_capacity(gym_id);


-- Membership Types RLS (read-only for all authenticated users)
CREATE POLICY "All authenticated users can view membership types" ON membership_types
FOR SELECT USING (auth.role() = 'authenticated');

-- Revised Membership Plans RLS
CREATE POLICY "Gym owners can manage their membership plans" ON membership_plans 
FOR ALL USING (is_gym_owner(gym_id));

CREATE POLICY "Trainers can view membership plans of their gym" ON membership_plans 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM gym_trainers 
    WHERE gym_id = membership_plans.gym_id 
    AND trainer_id = auth.uid()
  )
);

CREATE POLICY "Members can view membership plans of their gym" ON membership_plans 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM gym_members 
    WHERE gym_id = membership_plans.gym_id 
    AND member_id = auth.uid()
  )
);

