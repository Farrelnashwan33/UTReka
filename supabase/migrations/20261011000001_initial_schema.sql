-- ============================================================
-- UT REKA (Universitas Terbuka Karier) - Production Database Schema
-- Target: Supabase PostgreSQL (ukhijyupfrpfztugtjuu)
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. ENUMS & DOMAINS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student', 'alumni', 'admin');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE connection_request_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE opportunity_type AS ENUM ('project', 'internship', 'job', 'mentoring');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE opportunity_status AS ENUM ('draft', 'published', 'closed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE application_status AS ENUM ('submitted', 'reviewed', 'accepted', 'rejected');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE report_status AS ENUM ('pending', 'investigating', 'resolved', 'dismissed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ============================================================
-- 2. TABLES
-- ============================================================

-- Table: profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  nim TEXT,
  study_program TEXT NOT NULL DEFAULT 'Sistem Informasi',
  entry_year INTEGER,
  graduation_year INTEGER,
  avatar_url TEXT,
  bio TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  interests TEXT[] NOT NULL DEFAULT '{}',
  portfolio_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  website_url TEXT,
  company TEXT,
  job_title TEXT,
  industry TEXT,
  is_mentor BOOLEAN NOT NULL DEFAULT FALSE,
  mentor_topics TEXT[] NOT NULL DEFAULT '{}',
  verification_status verification_status NOT NULL DEFAULT 'unverified',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: connection_requests
CREATE TABLE IF NOT EXISTS public.connection_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status connection_request_status NOT NULL DEFAULT 'pending',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_sender_not_receiver CHECK (sender_id <> receiver_id)
);

-- Unique index to prevent duplicate pending requests
CREATE UNIQUE INDEX IF NOT EXISTS uq_pending_connection_request 
ON public.connection_requests (sender_id, receiver_id) 
WHERE status = 'pending';

-- Table: connections
CREATE TABLE IF NOT EXISTS public.connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_ordered_pair CHECK (user1_id < user2_id),
  CONSTRAINT uq_connection_pair UNIQUE (user1_id, user2_id)
);

-- Table: conversations
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: conversation_members
CREATE TABLE IF NOT EXISTS public.conversation_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_conversation_member UNIQUE (conversation_id, user_id)
);

-- Table: messages
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: notifications
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  link TEXT,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: opportunities
CREATE TABLE IF NOT EXISTS public.opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type opportunity_type NOT NULL DEFAULT 'project',
  company_or_org TEXT,
  location TEXT NOT NULL DEFAULT 'Remote',
  requirements TEXT[] NOT NULL DEFAULT '{}',
  deadline DATE,
  status opportunity_status NOT NULL DEFAULT 'published',
  is_approved BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: opportunity_applications
CREATE TABLE IF NOT EXISTS public.opportunity_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id UUID NOT NULL REFERENCES public.opportunities(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  pitch TEXT NOT NULL,
  portfolio_link TEXT,
  status application_status NOT NULL DEFAULT 'submitted',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_opportunity_applicant UNIQUE (opportunity_id, applicant_id)
);

-- Table: reports
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reported_opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE SET NULL,
  reason TEXT NOT NULL,
  details TEXT NOT NULL,
  status report_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Table: verification_requests
CREATE TABLE IF NOT EXISTS public.verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  nim_or_alumni_id TEXT NOT NULL,
  document_url TEXT,
  notes TEXT,
  status verification_status NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  admin_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ
);

-- Table: audit_logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 3. INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_study_program ON public.profiles(study_program);
CREATE INDEX IF NOT EXISTS idx_profiles_skills ON public.profiles USING GIN (skills);
CREATE INDEX IF NOT EXISTS idx_profiles_is_mentor ON public.profiles(is_mentor) WHERE is_mentor = TRUE;
CREATE INDEX IF NOT EXISTS idx_connection_req_receiver ON public.connection_requests(receiver_id, status);
CREATE INDEX IF NOT EXISTS idx_connection_req_sender ON public.connection_requests(sender_id, status);
CREATE INDEX IF NOT EXISTS idx_connections_user1 ON public.connections(user1_id);
CREATE INDEX IF NOT EXISTS idx_connections_user2 ON public.connections(user2_id);
CREATE INDEX IF NOT EXISTS idx_conv_members_user ON public.conversation_members(user_id);
CREATE INDEX IF NOT EXISTS idx_conv_members_conv ON public.conversation_members(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_conv_created ON public.messages(conversation_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_opportunities_status_deadline ON public.opportunities(status, deadline);
CREATE INDEX IF NOT EXISTS idx_opportunities_author ON public.opportunities(author_id);
CREATE INDEX IF NOT EXISTS idx_applications_opp ON public.opportunity_applications(opportunity_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON public.opportunity_applications(applicant_id);

-- ============================================================
-- 4. DATABASE FUNCTIONS & TRIGGERS
-- ============================================================

-- Function: update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_connection_requests_updated_at ON public.connection_requests;
CREATE TRIGGER trg_connection_requests_updated_at
  BEFORE UPDATE ON public.connection_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_conversations_updated_at ON public.conversations;
CREATE TRIGGER trg_conversations_updated_at
  BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_opportunities_updated_at ON public.opportunities;
CREATE TRIGGER trg_opportunities_updated_at
  BEFORE UPDATE ON public.opportunities
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Trigger to safely create profile when new auth.users record is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_role user_role := 'student';
  v_meta_role text;
  v_study_program text;
  v_entry_year int;
  v_grad_year int;
BEGIN
  -- Read role from metadata safely (never allow client signup to pass 'admin')
  v_meta_role := LOWER(COALESCE(NEW.raw_user_meta_data->>'role', 'student'));
  IF v_meta_role = 'alumni' THEN
    v_role := 'alumni'::user_role;
  ELSE
    v_role := 'student'::user_role;
  END IF;

  v_study_program := COALESCE(NEW.raw_user_meta_data->>'study_program', 'Sistem Informasi');
  
  BEGIN
    v_entry_year := (NEW.raw_user_meta_data->>'entry_year')::int;
  EXCEPTION WHEN OTHERS THEN
    v_entry_year := NULL;
  END;

  BEGIN
    v_grad_year := (NEW.raw_user_meta_data->>'graduation_year')::int;
  EXCEPTION WHEN OTHERS THEN
    v_grad_year := NULL;
  END;

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    nim,
    study_program,
    entry_year,
    graduation_year,
    avatar_url,
    bio,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(COALESCE(NEW.email, 'User'), '@', 1)),
    v_role,
    NEW.raw_user_meta_data->>'nim',
    v_study_program,
    v_entry_year,
    v_grad_year,
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'bio',
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = CASE WHEN profiles.full_name = '' THEN EXCLUDED.full_name ELSE profiles.full_name END,
    updated_at = NOW();

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never abort auth.users transaction due to profile hook failure
  RAISE WARNING 'handle_new_user error for user %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger to prevent privilege escalation: users cannot change their own role to admin
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS TRIGGER AS $$
DECLARE
  v_caller_role user_role;
BEGIN
  -- If role is changing, check whether current session is admin
  IF NEW.role <> OLD.role OR NEW.verification_status <> OLD.verification_status THEN
    SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();
    IF v_caller_role IS DISTINCT FROM 'admin'::user_role THEN
      -- Revert unauthorized changes
      NEW.role := OLD.role;
      NEW.verification_status := OLD.verification_status;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON public.profiles;
CREATE TRIGGER trg_prevent_role_escalation
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- Function to check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ============================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversation_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunity_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- --- PROFILES POLICIES ---
-- Any authenticated user can read active profiles (needed for networking and search)
DROP POLICY IF EXISTS "Profiles are readable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are readable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (is_active = TRUE OR id = auth.uid() OR public.is_admin());

-- Users can update only their own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Admin can manage all profiles
DROP POLICY IF EXISTS "Admin can manage all profiles" ON public.profiles;
CREATE POLICY "Admin can manage all profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin());

-- --- CONNECTION REQUESTS POLICIES ---
DROP POLICY IF EXISTS "Users can read connection requests involving them" ON public.connection_requests;
CREATE POLICY "Users can read connection requests involving them"
  ON public.connection_requests FOR SELECT
  TO authenticated
  USING (sender_id = auth.uid() OR receiver_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can send connection requests" ON public.connection_requests;
CREATE POLICY "Users can send connection requests"
  ON public.connection_requests FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = auth.uid() AND sender_id <> receiver_id);

DROP POLICY IF EXISTS "Parties can update their connection requests" ON public.connection_requests;
CREATE POLICY "Parties can update their connection requests"
  ON public.connection_requests FOR UPDATE
  TO authenticated
  USING (receiver_id = auth.uid() OR (sender_id = auth.uid() AND status = 'pending'))
  WITH CHECK (receiver_id = auth.uid() OR (sender_id = auth.uid() AND status = 'cancelled'));

-- --- CONNECTIONS POLICIES ---
DROP POLICY IF EXISTS "Users can view their own connections" ON public.connections;
CREATE POLICY "Users can view their own connections"
  ON public.connections FOR SELECT
  TO authenticated
  USING (user1_id = auth.uid() OR user2_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "System and connected users can insert connections" ON public.connections;
CREATE POLICY "System and connected users can insert connections"
  ON public.connections FOR INSERT
  TO authenticated
  WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Connected users can delete connections" ON public.connections;
CREATE POLICY "Connected users can delete connections"
  ON public.connections FOR DELETE
  TO authenticated
  USING (user1_id = auth.uid() OR user2_id = auth.uid() OR public.is_admin());

-- --- CONVERSATIONS & MEMBERS POLICIES ---
DROP POLICY IF EXISTS "Users can see conversations they belong to" ON public.conversations;
CREATE POLICY "Users can see conversations they belong to"
  ON public.conversations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members cm 
      WHERE cm.conversation_id = conversations.id AND cm.user_id = auth.uid()
    ) OR public.is_admin()
  );

DROP POLICY IF EXISTS "Users can insert conversations" ON public.conversations;
CREATE POLICY "Users can insert conversations"
  ON public.conversations FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Users can view conversation members of their conversations" ON public.conversation_members;
CREATE POLICY "Users can view conversation members of their conversations"
  ON public.conversation_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members cm2
      WHERE cm2.conversation_id = conversation_members.conversation_id AND cm2.user_id = auth.uid()
    ) OR public.is_admin()
  );

DROP POLICY IF EXISTS "Users can insert conversation members" ON public.conversation_members;
CREATE POLICY "Users can insert conversation members"
  ON public.conversation_members FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.conversation_members cm
      WHERE cm.conversation_id = conversation_members.conversation_id AND cm.user_id = auth.uid()
    ) OR public.is_admin()
  );

DROP POLICY IF EXISTS "Users can update their last read" ON public.conversation_members;
CREATE POLICY "Users can update their last read"
  ON public.conversation_members FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- --- MESSAGES POLICIES ---
DROP POLICY IF EXISTS "Users can read messages in their conversations" ON public.messages;
CREATE POLICY "Users can read messages in their conversations"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversation_members cm 
      WHERE cm.conversation_id = messages.conversation_id AND cm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert messages into their conversations" ON public.messages;
CREATE POLICY "Users can insert messages into their conversations"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.conversation_members cm 
      WHERE cm.conversation_id = messages.conversation_id AND cm.user_id = auth.uid()
    )
  );

-- --- NOTIFICATIONS POLICIES ---
DROP POLICY IF EXISTS "Users can read own notifications" ON public.notifications;
CREATE POLICY "Users can read own notifications"
  ON public.notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
CREATE POLICY "Users can update own notifications"
  ON public.notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users and system can insert notifications" ON public.notifications;
CREATE POLICY "Users and system can insert notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

-- --- OPPORTUNITIES POLICIES ---
DROP POLICY IF EXISTS "Everyone can view published approved opportunities" ON public.opportunities;
CREATE POLICY "Everyone can view published approved opportunities"
  ON public.opportunities FOR SELECT
  TO authenticated
  USING (
    (status = 'published' AND is_approved = TRUE) OR 
    author_id = auth.uid() OR 
    public.is_admin()
  );

DROP POLICY IF EXISTS "Alumni and Admin can insert opportunities" ON public.opportunities;
CREATE POLICY "Alumni and Admin can insert opportunities"
  ON public.opportunities FOR INSERT
  TO authenticated
  WITH CHECK (author_id = auth.uid());

DROP POLICY IF EXISTS "Authors can update own opportunities" ON public.opportunities;
CREATE POLICY "Authors can update own opportunities"
  ON public.opportunities FOR UPDATE
  TO authenticated
  USING (author_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Authors can delete own opportunities" ON public.opportunities;
CREATE POLICY "Authors can delete own opportunities"
  ON public.opportunities FOR DELETE
  TO authenticated
  USING (author_id = auth.uid() OR public.is_admin());

-- --- OPPORTUNITY APPLICATIONS POLICIES ---
DROP POLICY IF EXISTS "Applicants and opportunity owners can view applications" ON public.opportunity_applications;
CREATE POLICY "Applicants and opportunity owners can view applications"
  ON public.opportunity_applications FOR SELECT
  TO authenticated
  USING (
    applicant_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.opportunities o 
      WHERE o.id = opportunity_applications.opportunity_id AND o.author_id = auth.uid()
    ) OR
    public.is_admin()
  );

DROP POLICY IF EXISTS "Students can insert applications" ON public.opportunity_applications;
CREATE POLICY "Students can insert applications"
  ON public.opportunity_applications FOR INSERT
  TO authenticated
  WITH CHECK (applicant_id = auth.uid());

DROP POLICY IF EXISTS "Authors can update application status" ON public.opportunity_applications;
CREATE POLICY "Authors can update application status"
  ON public.opportunity_applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.opportunities o 
      WHERE o.id = opportunity_applications.opportunity_id AND o.author_id = auth.uid()
    ) OR public.is_admin()
  );

-- --- REPORTS POLICIES ---
DROP POLICY IF EXISTS "Users can file reports" ON public.reports;
CREATE POLICY "Users can file reports"
  ON public.reports FOR INSERT
  TO authenticated
  WITH CHECK (reporter_id = auth.uid());

DROP POLICY IF EXISTS "Reporters and Admins can view reports" ON public.reports;
CREATE POLICY "Reporters and Admins can view reports"
  ON public.reports FOR SELECT
  TO authenticated
  USING (reporter_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Only Admins can update reports" ON public.reports;
CREATE POLICY "Only Admins can update reports"
  ON public.reports FOR UPDATE
  TO authenticated
  USING (public.is_admin());

-- --- VERIFICATION REQUESTS POLICIES ---
DROP POLICY IF EXISTS "Users can view own verification requests" ON public.verification_requests;
CREATE POLICY "Users can view own verification requests"
  ON public.verification_requests FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Users can create verification request" ON public.verification_requests;
CREATE POLICY "Users can create verification request"
  ON public.verification_requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Only Admins can update verification requests" ON public.verification_requests;
CREATE POLICY "Only Admins can update verification requests"
  ON public.verification_requests FOR UPDATE
  TO authenticated
  USING (public.is_admin());

-- --- AUDIT LOGS POLICIES ---
DROP POLICY IF EXISTS "Admins can view and create audit logs" ON public.audit_logs;
CREATE POLICY "Admins can view and create audit logs"
  ON public.audit_logs FOR ALL
  TO authenticated
  USING (public.is_admin());

-- Enable Realtime
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
EXCEPTION WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
EXCEPTION WHEN OTHERS THEN null;
END $$;

DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE public.conversation_members;
EXCEPTION WHEN OTHERS THEN null;
END $$;
