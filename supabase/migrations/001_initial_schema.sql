-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'provider' CHECK (role IN ('provider', 'admin')),
  full_name TEXT,
  phone TEXT,
  city TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create provider_applications table
CREATE TABLE IF NOT EXISTS public.provider_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  services TEXT[] DEFAULT '{}',
  experience_years INTEGER NOT NULL DEFAULT 0,
  availability JSONB DEFAULT '{}',
  background_check_consent BOOLEAN NOT NULL DEFAULT FALSE,
  insurance_status TEXT DEFAULT 'unknown',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create provider_services table
CREATE TABLE IF NOT EXISTS public.provider_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_key TEXT NOT NULL,
  price_hint DECIMAL(10, 2),
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_ref TEXT,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_key TEXT NOT NULL,
  address TEXT NOT NULL,
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'assigned', 'in_progress', 'completed', 'cancelled')),
  subtotal DECIMAL(10, 2) NOT NULL DEFAULT 0,
  service_fee DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create payouts table
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CAD',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'required' CHECK (status IN ('required', 'submitted', 'verified', 'expired')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create support_tickets table
CREATE TABLE IF NOT EXISTS public.support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_provider_applications_status ON public.provider_applications(status);
CREATE INDEX IF NOT EXISTS idx_provider_applications_email ON public.provider_applications(email);
CREATE INDEX IF NOT EXISTS idx_provider_applications_user_id ON public.provider_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_provider_services_provider_id ON public.provider_services(provider_id);
CREATE INDEX IF NOT EXISTS idx_jobs_provider_id ON public.jobs(provider_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_payouts_provider_id ON public.payouts(provider_id);
CREATE INDEX IF NOT EXISTS idx_documents_provider_id ON public.documents(provider_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_provider_id ON public.support_tickets(provider_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "profiles_self_read" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_admin_read" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "profiles_self_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = old.role); -- users can't change their own role

CREATE POLICY "profiles_admin_update" ON public.profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Provider Applications: Users can see their own, admins can see all
CREATE POLICY "provider_applications_user_read" ON public.provider_applications
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "provider_applications_admin_read" ON public.provider_applications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "provider_applications_user_insert" ON public.provider_applications
  FOR INSERT WITH CHECK (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "provider_applications_admin_update" ON public.provider_applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Provider Services: Users can see their own, admins can see all
CREATE POLICY "provider_services_user_read" ON public.provider_services
  FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "provider_services_admin_read" ON public.provider_services
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "provider_services_user_write" ON public.provider_services
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "provider_services_user_update" ON public.provider_services
  FOR UPDATE USING (auth.uid() = provider_id);

CREATE POLICY "provider_services_user_delete" ON public.provider_services
  FOR DELETE USING (auth.uid() = provider_id);

-- Jobs: Users can see their own, admins can see all
CREATE POLICY "jobs_user_read" ON public.jobs
  FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "jobs_admin_read" ON public.jobs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "jobs_admin_update" ON public.jobs
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Payouts: Users can see their own, admins can see all
CREATE POLICY "payouts_user_read" ON public.payouts
  FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "payouts_admin_read" ON public.payouts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Documents: Users can see their own, admins can see all
CREATE POLICY "documents_user_read" ON public.documents
  FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "documents_admin_read" ON public.documents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "documents_user_write" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "documents_user_update" ON public.documents
  FOR UPDATE USING (auth.uid() = provider_id);

-- Support Tickets: Users can see their own, admins can see all
CREATE POLICY "support_tickets_user_read" ON public.support_tickets
  FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "support_tickets_admin_read" ON public.support_tickets
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "support_tickets_user_insert" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = provider_id);

CREATE POLICY "support_tickets_user_update" ON public.support_tickets
  FOR UPDATE USING (auth.uid() = provider_id);

-- ============================================
-- TRIGGERS & FUNCTIONS
-- ============================================

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, full_name, email)
  VALUES (new.id, 'provider', new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on auth.users insert
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_provider_applications_updated_at BEFORE UPDATE ON public.provider_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
