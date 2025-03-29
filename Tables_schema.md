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


