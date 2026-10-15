-- ============================================================
-- UT REKA (Universitas Terbuka Karier) - Development / Demo Seed Data
-- Run this in your Supabase SQL Editor if you want to populate demo records.
-- ============================================================

-- Note: In production Supabase, users are tied to auth.users.
-- For local development / SQL runner without auth.users, create dummy auth.users if needed
-- or insert into profiles directly if constraints permit.

-- Demo seed for testing categories, initial setup reference
COMMENT ON TABLE public.profiles IS 'UT REKA User Profiles (Students, Alumni, Admin)';
COMMENT ON TABLE public.opportunities IS 'Career opportunities, projects, internships and mentoring offered by Alumni';
COMMENT ON TABLE public.connection_requests IS 'Peer connection requests between students and alumni';
COMMENT ON TABLE public.conversations IS 'Direct messaging threads';
