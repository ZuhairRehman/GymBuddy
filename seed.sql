-- 1. FIRST: Create users in Supabase Auth (e.g., via Dashboard or API)
-- 2. THEN: Get their actual UUIDs from the auth.users table.
-- 3. FINALLY: Use those UUIDs in this script.

-- Replace these placeholders with ACTUAL UUIDs from your auth.users table
DO $$
DECLARE
    test_owner_auth_uuid UUID := '43ffd65f-7f65-484e-85f7-f95f8b90cfcb'; -- REQUIRED
    test_member_auth_uuid UUID := '8dde0f77-e2e7-4164-8600-f4e9899c51b6'; -- REQUIRED
    test_gym_uuid UUID := uuid_generate_v4(); -- Or provide a specific one if needed
    test_plan_uuid UUID := uuid_generate_v4(); -- Or provide a specific one

    -- Declare UUIDs for additional Indian dummy members - REPLACE THESE WITH ACTUAL AUTH UUIDs
    dummy_member_1_uuid UUID := '47685781-7eae-4ea0-b907-2ced1a7de536'; -- REQUIRED
    dummy_member_2_uuid UUID := '95a455e9-2a5e-4d10-abb2-fb5c88ac70ce'; -- REQUIRED
    dummy_member_3_uuid UUID := 'dfce4d4b-868b-4855-837a-0e7b619ee74d'; -- REQUIRED
    dummy_member_4_uuid UUID := '4cb83bf0-2312-4257-a28b-a22734237b43'; -- REQUIRED
    dummy_member_5_uuid UUID := '52f6186b-07b5-45ef-80a5-217fe74126f0'; -- REQUIRED
BEGIN
    -- Insert Profile for Owner (using the auth.uid)
    INSERT INTO public.profiles (id, full_name, mobile_number, role)
    VALUES (test_owner_auth_uuid, 'Test Owner Seed', '9876543210', 'owner')
    ON CONFLICT (id) DO NOTHING; -- In case profile already exists

    -- Insert Profile for Member (using the auth.uid)
    INSERT INTO public.profiles (id, full_name, mobile_number, role)
    VALUES (test_member_auth_uuid, 'Test Member Seed', '1234567890', 'member')
    ON CONFLICT (id) DO NOTHING;

    -- Insert Member Profile details
    INSERT INTO public.member_profiles (id, age, fitness_goals)
    VALUES (test_member_auth_uuid, 30, ARRAY['Cardio', 'Flexibility'])
    ON CONFLICT (id) DO UPDATE SET age = EXCLUDED.age, fitness_goals = EXCLUDED.fitness_goals; -- Example update

    -- Insert Gym (owned by test_owner_auth_uuid, specifying gym's UUID)
    INSERT INTO public.gyms (id, owner_id, name, business_email, business_phone_number, address_line1, city, state, pin_code, join_code)
    VALUES (
        test_gym_uuid,
        test_owner_auth_uuid, -- Use the owner's auth UUID
        'Seed Test Gym',
        'seedgym@example.com',
        '5553334444',
        '456 Seed Drive',
        'Seed City',
        'Seed State',
        '220022',
        'SEEDCODE'
    )
    ON CONFLICT (id) DO NOTHING;

    -- Insert Membership Plan (specifying its UUID)
    INSERT INTO public.membership_plans (id, gym_id, name, duration_months, base_price, joining_fee, is_active)
    VALUES (
        test_plan_uuid,
        test_gym_uuid,
        'Seed Annual Plan',
        12,
        10000.00,
        500.00,
        true
    )
    ON CONFLICT (id) DO NOTHING;

    -- Insert Gym Member relationship (using member's auth UUID and gym's UUID)
    INSERT INTO public.gym_members (gym_id, member_id, status, membership_start, membership_end)
    VALUES (test_gym_uuid, test_member_auth_uuid, 'active', NOW(), NOW() + INTERVAL '1 year')
    ON CONFLICT (gym_id, member_id) DO NOTHING;

    -- Add more inserts as needed...

    -- Insert profiles for dummy Indian members (USING THE ACTUAL AUTH UUIDs)
    INSERT INTO public.profiles (id, full_name, mobile_number, role)
    VALUES
        (dummy_member_1_uuid, 'Rahul Sharma', '9876543211', 'member'),
        (dummy_member_2_uuid, 'Priya Patel', '9123456780', 'member'),
        (dummy_member_3_uuid, 'Amit Singh', '9988776651', 'member'),
        (dummy_member_4_uuid, 'Sneha Gupta', '9765432100', 'member'),
        (dummy_member_5_uuid, 'Vikram Kumar', '9654321091', 'member')
    ON CONFLICT (id) DO NOTHING;

    -- Insert member_profiles for dummy Indian members (USING THE ACTUAL AUTH UUIDs)
    INSERT INTO public.member_profiles (id, age, fitness_goals)
    VALUES
        (dummy_member_1_uuid, 28, ARRAY['Weight Loss', 'Strength']),
        (dummy_member_2_uuid, 25, ARRAY['Cardio', 'Toning']),
        (dummy_member_3_uuid, 32, ARRAY['Muscle Gain']),
        (dummy_member_4_uuid, 22, ARRAY['Flexibility', 'Yoga']),
        (dummy_member_5_uuid, 35, ARRAY['General Fitness'])
    ON CONFLICT (id) DO UPDATE SET age = EXCLUDED.age, fitness_goals = EXCLUDED.fitness_goals;

    -- Insert gym_members relationships for dummy Indian members (USING THE ACTUAL AUTH UUIDs)
    INSERT INTO public.gym_members (gym_id, member_id, status, membership_start, membership_end)
    VALUES
        (test_gym_uuid, dummy_member_1_uuid, 'active', NOW(), NOW() + INTERVAL '6 months'),
        (test_gym_uuid, dummy_member_2_uuid, 'active', NOW(), NOW() + INTERVAL '1 year'),
        (test_gym_uuid, dummy_member_3_uuid, 'inactive', NOW() - INTERVAL '2 months', NOW() - INTERVAL '1 month'), -- Example inactive
        (test_gym_uuid, dummy_member_4_uuid, 'active', NOW(), NOW() + INTERVAL '3 months'),
        (test_gym_uuid, dummy_member_5_uuid, 'active', NOW(), NOW() + INTERVAL '1 year')
    ON CONFLICT (gym_id, member_id) DO NOTHING;

END $$;