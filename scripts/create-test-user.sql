-- SQL to create a test provider user in Supabase
-- Run this in your Supabase SQL editor

-- This creates a test user with the following credentials:
-- Username: testprovider
-- Password: TestPassword123!
-- Email: testprovider@urbance.local

-- Note: In production, users would be created through the signup flow
-- This is for development/testing purposes only

-- Create the auth user (use the Supabase auth API in your app)
-- Then create the profile:

INSERT INTO profiles (
  id,
  username,
  email,
  first_name,
  last_name,
  display_name,
  phone,
  city,
  province,
  country,
  profile_complete,
  application_status,
  created_at
) VALUES (
  'test-user-001',
  'testprovider',
  'testprovider@urbance.local',
  'Test',
  'Provider',
  'Test Pro',
  '(555) 123-4567',
  'Vancouver',
  'British Columbia',
  'Canada',
  true,
  'approved',
  now()
);

-- Create a complete provider application
INSERT INTO provider_applications (
  id,
  user_id,
  application_data,
  status,
  submitted_at,
  reviewed_at,
  created_at
) VALUES (
  'app-001',
  'test-user-001',
  jsonb_build_object(
    'username', 'testprovider',
    'password', 'TestPassword123!',
    'first_name', 'Test',
    'last_name', 'Provider',
    'display_name', 'Test Pro',
    'email', 'testprovider@urbance.local',
    'phone', '(555) 123-4567',
    'city', 'Vancouver',
    'province', 'British Columbia',
    'country', 'Canada',
    'services', ARRAY['Cleaning', 'Handyman'],
    'experience_years', 5,
    'availability_days', ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    'work_status', 'citizen',
    'provider_type', 'individual',
    'has_insurance', true,
    'background_check_consent', true,
    'terms_accepted', true,
    'privacy_accepted', true
  ),
  'approved',
  now() - INTERVAL '30 days',
  now() - INTERVAL '20 days',
  now() - INTERVAL '30 days'
);
