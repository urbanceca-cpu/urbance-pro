'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

/* ═══════════════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════════ */

interface BasicInfo {
  full_legal_name: string;
  business_name: string;
  email: string;
  phone: string;
  city: string;
  address_line1: string;
  postal_code: string;
  password: string;
  confirmPassword: string;
}

interface ServicesCoverage {
  primary_category: string;
  sub_services: string[];
  service_areas: string[];
  max_travel_km: string;
  has_vehicle: string;
}

interface Reference {
  name: string;
  phone_or_email: string;
}

interface ExperienceStandards {
  years_experience: string;
  professional_bio: string;
  team_size: string;
  is_licensed: string;
  license_details: string;
  is_insured: string;
  policy_limit: string;
  references: Reference[];
}

interface PricingAvailability {
  availability: string[];
  earliest_start: string;
  scheduling_notes: string;
}

interface UploadedDoc {
  id: string;
  category: string;
  file_name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  progress: number;
  status: 'uploading' | 'done' | 'error';
}

/* ═══════════════════════════════════════════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════════════════════════════════════ */

const SUB_SERVICES: Record<string, string[]> = {
  cleaning: ['Regular House Cleaning', 'Deep Cleaning', 'Move-In/Out Cleaning', 'Carpet Cleaning', 'Window Cleaning', 'Pressure Washing'],
  handyman: ['General Repairs', 'Furniture Assembly', 'Painting & Touch-ups', 'Plumbing Repairs', 'Electrical (minor)', 'Drywall Patching', 'Tile & Grout'],
  movers: ['Local Moving', 'Long-Distance Moving', 'Packing & Unpacking', 'Furniture Moving', 'Piano Moving', 'Senior Moves'],
  junk_removal: ['Household Junk', 'Appliance Removal', 'Furniture Removal', 'Construction Debris', 'E-Waste', 'Yard Waste'],
  other: ['Lawn Care', 'Snow Removal', 'Pet Care', 'Errand Running', 'Personal Organizing', 'Event Setup'],
};

const SERVICE_AREAS = [
  'Vancouver', 'Burnaby', 'Surrey', 'Richmond', 'Coquitlam',
  'North Vancouver', 'West Vancouver', 'New Westminster', 'Delta',
  'Langley', 'Maple Ridge', 'Abbotsford', 'Port Coquitlam', 'Port Moody',
];

const DOC_CATEGORIES = [
  { value: 'government_id', label: 'Government ID' },
  { value: 'business_license', label: 'Business License' },
  { value: 'insurance_certificate', label: 'Insurance Certificate' },
  { value: 'trade_certification', label: 'Trade Certification' },
  { value: 'worksafebc', label: 'WorkSafeBC' },
  { value: 'proof_of_address', label: 'Proof of Address' },
  { value: 'other', label: 'Other' },
];

const STEP_COLORS = ['#2F80ED', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0F172A'];
const STEP_LIGHTS = ['#EBF3FD', '#F5F3FF', '#ECFDF5', '#FFFBEB', '#FEF2F2', '#F1F5F9'];

const STEPS = [
  { n: 1, title: 'Basic Info', icon: '👤', hint: 'Your name, contact details, and location.' },
  { n: 2, title: 'Services & Coverage', icon: '🛠', hint: 'What you offer and where you work.' },
  { n: 3, title: 'Experience & Standards', icon: '⭐', hint: 'Your background, licensing, and insurance.' },
  { n: 4, title: 'Availability', icon: '📅', hint: 'When you are available to work.' },
  { n: 5, title: 'Document Upload', icon: '📎', hint: 'Required documents for verification.' },
  { n: 6, title: 'Review & Submit', icon: '✅', hint: 'Review everything before submitting.' },
];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'application/pdf'];

/* ═══════════════════════════════════════════════════════════════════════════════
   HELPER COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[13px] font-semibold text-gray-700 mb-1.5">
      {children}{required && <span className="text-red-600 ml-0.5">*</span>}
    </label>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] text-gray-400 mt-1">{children}</p>;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-[12px] text-red-600 mt-1 flex items-center gap-1">⚠ {msg}</p>;
}

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  const { error, className, ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full px-3.5 py-2.5 rounded-[10px] text-sm border-[1.5px] outline-none transition-colors font-[inherit] ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
      } focus:border-blue-500 ${className ?? ''}`}
    />
  );
}

function StyledTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  const { error, className, ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full px-3.5 py-2.5 rounded-[10px] text-sm border-[1.5px] outline-none transition-colors font-[inherit] resize-y min-h-[100px] ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
      } focus:border-blue-500 ${className ?? ''}`}
    />
  );
}

function StyledSelect(props: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  const { error, children, className, ...rest } = props;
  return (
    <select
      {...rest}
      className={`w-full px-3.5 py-2.5 rounded-[10px] text-sm border-[1.5px] outline-none transition-colors font-[inherit] appearance-none bg-white pr-9 ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-200'
      } focus:border-blue-500 ${className ?? ''}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 14px center',
      }}
    >
      {children}
    </select>
  );
}

function MultiSelectChips({ options, selected, onChange, color }: {
  options: string[]; selected: string[]; onChange: (v: string[]) => void; color: string;
}) {
  const toggle = (v: string) => onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v]);
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(o => {
        const active = selected.includes(o);
        return (
          <button key={o} type="button" onClick={() => toggle(o)}
            className="px-3.5 py-1.5 rounded-full text-[13px] border-[1.5px] cursor-pointer transition-all font-[inherit]"
            style={{
              fontWeight: active ? 600 : 400,
              borderColor: active ? color : '#E5E7EB',
              backgroundColor: active ? color : '#FFFFFF',
              color: active ? '#ffffff' : '#6B7280',
            }}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-4 mt-7 pb-2 border-b border-gray-100">
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   INITIAL STATE FACTORIES
   ═══════════════════════════════════════════════════════════════════════════ */

const emptyBasicInfo = (): BasicInfo => ({
  full_legal_name: '', business_name: '', email: '', phone: '',
  city: '', address_line1: '', postal_code: '', password: '', confirmPassword: '',
});

const emptyServices = (): ServicesCoverage => ({
  primary_category: '', sub_services: [], service_areas: [], max_travel_km: '', has_vehicle: '',
});

const emptyExperience = (): ExperienceStandards => ({
  years_experience: '', professional_bio: '', team_size: '',
  is_licensed: '', license_details: '', is_insured: '',
  policy_limit: '', references: [{ name: '', phone_or_email: '' }, { name: '', phone_or_email: '' }],
});

const emptyPricing = (): PricingAvailability => ({
  availability: [], earliest_start: '', scheduling_notes: '',
});

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

export default function ApplyPage() {
  const router = useRouter();
  const supabase = createClient();

  // ── Auth state ──
  const [userId, setUserId] = useState<string | null>(null);
  const [appId, setAppId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // ── Navigation ──
  const [step, setStep] = useState(1);
  const [stepsCompleted, setStepsCompleted] = useState<Record<number, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  // ── Form data ──
  const [basicInfo, setBasicInfo] = useState<BasicInfo>(emptyBasicInfo());
  const [services, setServices] = useState<ServicesCoverage>(emptyServices());
  const [experience, setExperience] = useState<ExperienceStandards>(emptyExperience());
  const [pricing, setPricing] = useState<PricingAvailability>(emptyPricing());
  const [docs, setDocs] = useState<UploadedDoc[]>([]);

  // ── UI state ──
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ── Document upload UI ──
  const [pendingCategory, setPendingCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadSuccessTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ─── Init: Load session + existing application ───────────────────────── */
  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (cancelled) return;
        if (!user) { setLoading(false); return; }

        setUserId(user.id);
        setBasicInfo(prev => ({ ...prev, email: user.email ?? '' }));

        // Fetch existing draft
        const { data: existing } = await supabase
          .from('provider_applications')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (cancelled) return;

        if (existing) {
          setAppId(existing.id);
          if (existing.status === 'submitted') { setSubmitted(true); setLoading(false); return; }

          // Restore form data
          if (existing.basic_info && typeof existing.basic_info === 'object') {
            setBasicInfo(prev => ({ ...prev, ...existing.basic_info, email: user.email ?? '' }));
          }
          if (existing.services_coverage) setServices(prev => ({ ...prev, ...existing.services_coverage }));
          if (existing.experience_standards) setExperience(prev => ({ ...prev, ...existing.experience_standards }));
          if (existing.pricing_availability) setPricing(prev => ({ ...prev, ...existing.pricing_availability }));
          if (existing.step_completed) setStepsCompleted(existing.step_completed);

          // Load uploaded docs
          const { data: docRows } = await supabase
            .from('provider_documents')
            .select('*')
            .eq('application_id', existing.id);

          if (!cancelled && docRows) {
            setDocs(docRows.map((d: Record<string, unknown>) => ({
              id: d.id as string,
              category: d.category as string,
              file_name: d.file_name as string,
              file_path: d.file_path as string,
              file_type: d.file_type as string,
              file_size: d.file_size as number,
              progress: 100,
              status: 'done' as const,
            })));
          }
        }
      } catch (e) {
        console.error('[apply] Init error:', e);
      }
      if (!cancelled) setLoading(false);
    }

    init();
    return () => { cancelled = true; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── Autosave (debounced) ────────────────────────────────────────────── */
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const autosave = useCallback((patch: Record<string, unknown>) => {
    if (!appId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus('saving');
    saveTimer.current = setTimeout(async () => {
      const { error } = await supabase
        .from('provider_applications')
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq('id', appId);
      setSaveStatus(error ? 'error' : 'saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1200);
  }, [appId, supabase]);

  // Auto-save each section (strip passwords)
  useEffect(() => {
    if (!appId) return;
    const { password: _, confirmPassword: __, ...safe } = basicInfo;
    autosave({ basic_info: safe });
  }, [basicInfo, appId, autosave]);

  useEffect(() => { if (appId) autosave({ services_coverage: services }); }, [services, appId, autosave]);
  useEffect(() => { if (appId) autosave({ experience_standards: experience }); }, [experience, appId, autosave]);
  useEffect(() => { if (appId) autosave({ pricing_availability: pricing }); }, [pricing, appId, autosave]);

  // Clear doc validation error when a doc is uploaded
  useEffect(() => {
    if (docs.some(d => d.status === 'done')) {
      setErrors(prev => {
        if (!prev.docs) return prev;
        const next = { ...prev };
        delete next.docs;
        return next;
      });
    }
  }, [docs]);

  // Cleanup upload success timer
  useEffect(() => {
    return () => { if (uploadSuccessTimer.current) clearTimeout(uploadSuccessTimer.current); };
  }, []);

  /* ─── Validation ──────────────────────────────────────────────────────── */
  function validateStep(s: number): Record<string, string> {
    const e: Record<string, string> = {};

    switch (s) {
      case 1: {
        if (!basicInfo.full_legal_name.trim()) e.full_legal_name = 'Full legal name is required';
        if (!basicInfo.phone.trim()) e.phone = 'Phone number is required';
        if (!basicInfo.city.trim()) e.city = 'City is required';
        // Auth fields only when not logged in
        if (!userId) {
          if (!basicInfo.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(basicInfo.email))
            e.email = 'A valid email address is required';
          if (!basicInfo.password || basicInfo.password.length < 8)
            e.password = 'Password must be at least 8 characters';
          if (basicInfo.password !== basicInfo.confirmPassword)
            e.confirmPassword = 'Passwords do not match';
          if (!termsAccepted)
            e.terms = 'You must accept the Terms of Service';
        }
        break;
      }
      case 2: {
        if (!services.primary_category) e.primary_category = 'Select a primary service category';
        if (!services.sub_services.length) e.sub_services = 'Select at least one sub-service';
        if (!services.service_areas.length) e.service_areas = 'Select at least one service area';
        if (!services.has_vehicle) e.has_vehicle = 'Please answer this question';
        break;
      }
      case 3: {
        if (!experience.years_experience) e.years_experience = 'Years of experience required';
        if (!experience.professional_bio.trim() || experience.professional_bio.length < 40)
          e.professional_bio = 'Please write at least 40 characters';
        if (!experience.team_size) e.team_size = 'Team size required';
        if (!experience.is_licensed) e.is_licensed = 'Please answer this question';
        if (!experience.is_insured) e.is_insured = 'Please answer this question';
        if (!experience.references[0]?.name?.trim() || !experience.references[0]?.phone_or_email?.trim())
          e.reference1 = 'First reference name and contact are required';
        if (!experience.references[1]?.name?.trim() || !experience.references[1]?.phone_or_email?.trim())
          e.reference2 = 'Second reference name and contact are required';
        break;
      }
      case 4: {
        if (!pricing.availability.length) e.availability = 'Select at least one availability window';
        break;
      }
      case 5: {
        const uploaded = new Set(docs.filter(d => d.status === 'done').map(d => d.category));
        const missing: string[] = [];
        if (!uploaded.has('government_id')) missing.push('Government ID');
        if (!uploaded.has('proof_of_address')) missing.push('Proof of Address');
        if (experience.is_insured === 'yes' && !uploaded.has('insurance_certificate')) missing.push('Insurance Certificate');
        if (experience.is_licensed === 'yes' && !uploaded.has('trade_certification') && !uploaded.has('business_license')) {
          missing.push('Trade Certification or Business License');
        }
        if (missing.length) e.docs = `Required: ${missing.join(', ')}`;
        break;
      }
    }
    return e;
  }

  /* ─── Account creation (Step 1) ───────────────────────────────────────── */
  async function createAccount(): Promise<boolean> {
    setAuthError('');
    setAuthLoading(true);

    try {
      // ── 1. Server-side: create user (admin, auto-confirmed) + profile + draft ──
      const cleanEmail = basicInfo.email.trim().toLowerCase();
      const cleanName = basicInfo.full_legal_name.trim();

      // Final guard: validate email before sending
      if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        setAuthError('Please enter a valid email address.');
        return false;
      }

      const res = await fetch('/api/provider-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          password: basicInfo.password,
          full_name: cleanName,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.error === 'account_exists') {
          // User already has an account — try signing in instead
          setAuthError('An account with this email already exists. Trying to sign you in...');

          const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: basicInfo.password,
          });

          if (signInErr) {
            setAuthError('An account with this email already exists. Please check your password or use the login page.');
            return false;
          }

          if (signInData.user) {
            setUserId(signInData.user.id);
            setBasicInfo(prev => ({ ...prev, password: '', confirmPassword: '' }));

            // Load existing draft
            const { data: existingApp } = await supabase
              .from('provider_applications')
              .select('*')
              .eq('user_id', signInData.user.id)
              .maybeSingle();

            if (existingApp) {
              setAppId(existingApp.id);
              if (existingApp.status === 'submitted') {
                setSubmitted(true);
                return false;
              }
              // Restore form data
              if (existingApp.basic_info && typeof existingApp.basic_info === 'object') {
                setBasicInfo(prev => ({ ...prev, ...existingApp.basic_info, email: signInData.user.email ?? '', password: '', confirmPassword: '' }));
              }
              if (existingApp.services_coverage) setServices(prev => ({ ...prev, ...existingApp.services_coverage }));
              if (existingApp.experience_standards) setExperience(prev => ({ ...prev, ...existingApp.experience_standards }));
              if (existingApp.pricing_availability) setPricing(prev => ({ ...prev, ...existingApp.pricing_availability }));
              if (existingApp.step_completed) setStepsCompleted(existingApp.step_completed);
            }

            setAuthError('');
            return true;
          }
        }

        setAuthError(result.message || result.error || 'Failed to create account.');
        return false;
      }

      // ── 2. Client-side: sign in with password to get a live session ──
      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: basicInfo.password,
      });

      if (signInErr) {
        console.error('[apply] signInWithPassword failed:', signInErr.message);
        setAuthError('Account created but sign-in failed. Please try the login page.');
        return false;
      }

      if (!signInData.user) {
        setAuthError('Account created but sign-in failed. Please try the login page.');
        return false;
      }

      // ── 3. Set state ──
      setUserId(signInData.user.id);
      setBasicInfo(prev => ({ ...prev, password: '', confirmPassword: '' }));

      if (result.appId) {
        setAppId(result.appId);

        // Save current basic_info to the draft
        const { password: _, confirmPassword: __, ...safeInfo } = basicInfo;
        await supabase
          .from('provider_applications')
          .update({ basic_info: safeInfo })
          .eq('id', result.appId);
      }

      return true;
    } catch (e) {
      console.error('[apply] Signup error:', e);
      setAuthError('Something went wrong. Please try again.');
      return false;
    } finally {
      setAuthLoading(false);
    }
  }

  /* ─── Navigation ──────────────────────────────────────────────────────── */
  async function goNext() {
    // Validate current step
    const errs = validateStep(step);
    if (Object.keys(errs).length) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setErrors({});

    // Step 1: create account if not logged in
    if (step === 1 && !userId) {
      const success = await createAccount();
      if (!success) return;
    }

    // Mark step complete
    const newCompleted = { ...stepsCompleted, [step]: true };
    setStepsCompleted(newCompleted);
    if (appId) {
      await supabase
        .from('provider_applications')
        .update({ step_completed: newCompleted })
        .eq('id', appId);
    }

    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    setErrors({});
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ─── Final submit ────────────────────────────────────────────────────── */
  async function handleSubmit() {
    // Re-validate all steps (skip auth fields since user is logged in)
    for (let s = 1; s <= 5; s++) {
      const e = validateStep(s);
      if (Object.keys(e).length) {
        // For step 1, logged-in users won't have auth errors so this is just field validation
        setErrors(e);
        setStep(s);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setSubmitError('');
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('provider_applications')
        .update({
          status: 'submitted',
          submitted_at: new Date().toISOString(),
          step_completed: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
        })
        .eq('id', appId!);

      if (error) {
        setSubmitError('Submission failed: ' + error.message);
        return;
      }

      setSubmitted(true);
    } catch (e) {
      console.error('[apply] Submit error:', e);
      setSubmitError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ─── Document upload ─────────────────────────────────────────────────── */
  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    // Guard: category required
    if (!pendingCategory) {
      setCategoryError('Please select a document category first.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setCategoryError('');

    // Verify auth (fresh check)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErrors(prev => ({ ...prev, docs: 'You must be signed in. Please complete Step 1 first.' }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const currentUserId = user.id;
    const currentAppId = appId;
    if (!currentAppId) {
      setErrors(prev => ({ ...prev, docs: 'Please complete Step 1 first.' }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    setUploadSuccess(null);
    let lastSuccess: string | null = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate size
      if (file.size > MAX_FILE_SIZE) {
        setErrors(prev => ({ ...prev, docs: `${file.name} exceeds the 20 MB limit.` }));
        continue;
      }

      // Validate type
      const isAllowed = ALLOWED_TYPES.includes(file.type) || file.name.toLowerCase().endsWith('.heic');
      if (!isAllowed) {
        setErrors(prev => ({ ...prev, docs: `${file.name}: unsupported type. Use PDF, JPG, PNG, or HEIC.` }));
        continue;
      }

      const timestamp = Date.now();
      const safeName = file.name.replace(/[^\w.-]/g, '_');
      // Path: {userId}/{timestamp}-{safeName} — matches RLS: (foldername)[1] = auth.uid()
      const storagePath = `${currentUserId}/${timestamp}-${safeName}`;
      const contentType = file.type || 'application/octet-stream';
      const tempId = `${timestamp}-${Math.random().toString(36).slice(2)}`;

      // Optimistic UI: show "uploading"
      const tempDoc: UploadedDoc = {
        id: tempId,
        category: pendingCategory,
        file_name: file.name,
        file_path: storagePath,
        file_type: contentType,
        file_size: file.size,
        progress: 0,
        status: 'uploading',
      };
      setDocs(prev => [...prev, tempDoc]);

      // Clear any existing doc error
      setErrors(prev => {
        const next = { ...prev };
        delete next.docs;
        return next;
      });

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('provider-documents')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType,
        });

      if (uploadError) {
        console.error('[apply] Storage upload error:', uploadError);
        setDocs(prev => prev.map(d => d.id === tempId ? { ...d, status: 'error' } : d));
        setErrors(prev => ({ ...prev, docs: `Upload failed for ${file.name}. Please try again.` }));
        continue;
      }

      // Save to provider_documents table
      const finalPath = uploadData?.path ?? storagePath;
      const { data: savedDoc, error: dbError } = await supabase
        .from('provider_documents')
        .insert({
          user_id: currentUserId,
          application_id: currentAppId,
          category: pendingCategory,
          file_name: file.name,
          file_path: finalPath,
          file_type: contentType,
          file_size: file.size,
        })
        .select('id')
        .single();

      if (dbError) {
        console.error('[apply] Doc DB insert error:', dbError);
        // Upload succeeded, mark as done anyway (reconcilable)
      }

      // Mark as done
      setDocs(prev => prev.map(d =>
        d.id === tempId
          ? { ...d, id: savedDoc?.id ?? tempId, status: 'done', progress: 100, file_path: finalPath }
          : d
      ));

      lastSuccess = file.name;
    }

    // Show success flash
    if (lastSuccess) {
      setUploadSuccess(lastSuccess);
      if (uploadSuccessTimer.current) clearTimeout(uploadSuccessTimer.current);
      uploadSuccessTimer.current = setTimeout(() => setUploadSuccess(null), 4000);
    }

    setIsUploading(false);
    setPendingCategory('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function removeDoc(doc: UploadedDoc) {
    // Remove from storage (ignore errors — file might not exist)
    await supabase.storage.from('provider-documents').remove([doc.file_path]);
    // Remove from DB
    await supabase.from('provider_documents').delete().eq('id', doc.id);
    // Remove from state
    setDocs(prev => prev.filter(d => d.id !== doc.id));
  }

  /* ─── Computed values ─────────────────────────────────────────────────── */
  const completedCount = Object.keys(stepsCompleted).length;
  const pct = Math.round((completedCount / 6) * 100);
  const color = STEP_COLORS[step - 1];
  const light = STEP_LIGHTS[step - 1];
  const doneDocs = docs.filter(d => d.status === 'done');
  const canAdvanceFromStep5 = doneDocs.length > 0;
  const isNextDisabled = authLoading || isUploading || (step === 5 && !canAdvanceFromStep5);

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER: Loading
     ═══════════════════════════════════════════════════════════════════════ */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#F0F6FF,#F5F0FF,#F0FFF8)' }}>
          <div className="text-center">
            <div className="w-10 h-10 border-[3px] border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading your application…</p>
          </div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER: Submitted
     ═══════════════════════════════════════════════════════════════════════ */
  if (submitted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center px-6 py-10" style={{ background: 'linear-gradient(135deg,#F0F6FF,#F5F0FF,#F0FFF8)' }}>
          <div className="bg-white rounded-3xl border border-gray-100 p-14 max-w-lg w-full text-center shadow-lg">
            <div className="w-[72px] h-[72px] rounded-full bg-green-50 flex items-center justify-center text-3xl mx-auto mb-6">✅</div>
            <h1 className="text-[28px] font-extrabold text-gray-900 mb-3 tracking-tight">Application Submitted!</h1>
            <p className="text-base text-gray-500 leading-relaxed mb-6">
              Thank you! Our team is reviewing your information and will notify you within 3–5 business days.
            </p>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8">
              <p className="text-sm font-semibold text-orange-900">Status: Under Review</p>
              <p className="text-xs text-orange-800/80 mt-1">Dashboard access will be granted once approved.</p>
            </div>
            <div className="flex gap-3 justify-center flex-wrap">
              <button onClick={() => router.push('/login')}
                className="px-8 py-3.5 rounded-xl bg-gray-900 text-white text-[15px] font-bold border-none cursor-pointer">
                Go to Login
              </button>
              <button onClick={() => router.push('/')}
                className="px-6 py-3.5 rounded-xl bg-white text-gray-600 text-sm font-semibold border-[1.5px] border-gray-200 cursor-pointer">
                Back to Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER: Landing
     ═══════════════════════════════════════════════════════════════════════ */
  if (showLanding) {
    return (
      <>
        <Navbar />
        <main style={{ fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>
          {/* Hero */}
          <section className="pt-36 pb-20 px-6 border-b border-gray-100 relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#F0F6FF 0%,#F5F0FF 50%,#F0FFF8 100%)' }}>
            <div className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(47,128,237,0.1) 0%,transparent 70%)' }} />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle,rgba(124,58,237,0.08) 0%,transparent 70%)' }} />
            <div className="max-w-3xl mx-auto text-center relative">
              <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-1.5 mb-6">
                <span className="text-xs font-bold text-blue-500 tracking-wider uppercase">Pro Application</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight mb-5">
                Join Urbance as a<br /><span className="text-blue-500">Verified Pro</span>
              </h1>
              <p className="text-lg text-gray-500 leading-relaxed mb-10 max-w-xl mx-auto">
                Complete our 6-step application to get matched with local homeowners and grow your service business.
              </p>
              <div className="flex gap-3 justify-center flex-wrap mb-14">
                <button onClick={() => setShowLanding(false)}
                  className="inline-flex items-center gap-2.5 px-9 py-4 rounded-[14px] bg-blue-500 text-white text-base font-bold border-none cursor-pointer shadow-lg shadow-blue-500/30">
                  Start My Application
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <a href="/how-it-works"
                  className="inline-flex items-center gap-2 px-7 py-4 rounded-[14px] bg-white text-gray-900 text-[15px] font-semibold border-[1.5px] border-gray-200 no-underline cursor-pointer">
                  How It Works
                </a>
              </div>
              <div className="grid grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden max-w-md mx-auto">
                {[{ n: '~10 min', l: 'To complete' }, { n: '3–5 days', l: 'Review time' }, { n: '$0', l: 'Application fee' }].map(s => (
                  <div key={s.l} className="bg-white py-5 px-4 text-center">
                    <div className="text-lg font-extrabold text-gray-900 tracking-tight">{s.n}</div>
                    <div className="text-xs text-gray-400 mt-1">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Steps overview */}
          <section className="py-20 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-[28px] font-extrabold text-gray-900 tracking-tight mb-2.5">What You&apos;ll Need to Complete</h2>
                <p className="text-[15px] text-gray-500">Six short steps — save your progress at any time.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { n: 1, c: '#2F80ED', icon: '👤', title: 'Basic Info', desc: 'Your name, phone number, and city.' },
                  { n: 2, c: '#7C3AED', icon: '🛠', title: 'Services & Coverage', desc: 'What you offer and where you work.' },
                  { n: 3, c: '#059669', icon: '⭐', title: 'Experience & Standards', desc: 'Years of experience, licensing, insurance.' },
                  { n: 4, c: '#D97706', icon: '💰', title: 'Pricing & Availability', desc: 'Your rates and available schedule.' },
                  { n: 5, c: '#DC2626', icon: '📎', title: 'Document Upload', desc: 'ID, insurance certificate, and more.' },
                  { n: 6, c: '#0F172A', icon: '✅', title: 'Review & Submit', desc: 'Check everything and submit.' },
                ].map(s => (
                  <div key={s.n} className="bg-gray-50 rounded-2xl border border-gray-100 p-6 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg" style={{ backgroundColor: s.c }}>{s.icon}</div>
                    <div>
                      <div className="text-[13px] font-bold text-gray-900 mb-1">Step {s.n} — {s.title}</div>
                      <div className="text-[13px] text-gray-500 leading-relaxed">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <button onClick={() => setShowLanding(false)}
                  className="inline-flex items-center gap-2.5 px-10 py-4 rounded-[14px] bg-gray-900 text-white text-base font-bold border-none cursor-pointer">
                  Begin Application →
                </button>
              </div>
            </div>
          </section>

          {/* What to prepare */}
          <section className="px-6 pb-20 bg-white">
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-50 rounded-[20px] border border-gray-100 p-10">
                <h3 className="text-lg font-extrabold text-gray-900 mb-6 tracking-tight">📋 What to Prepare</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { icon: '🪪', title: 'Government ID', desc: "Driver's licence or passport" },
                    { icon: '🏠', title: 'Proof of Address', desc: 'Utility bill or bank statement' },
                    { icon: '🛡', title: 'Insurance Cert.', desc: 'If you carry liability insurance' },
                    { icon: '💳', title: 'Banking Info', desc: 'For direct deposit of earnings' },
                  ].map(i => (
                    <div key={i.title} className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="text-2xl mb-2">{i.icon}</div>
                      <div className="text-[13px] font-bold text-gray-900 mb-1">{i.title}</div>
                      <div className="text-xs text-gray-400">{i.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER: Step Content
     ═══════════════════════════════════════════════════════════════════════ */
  function renderStep() {
    switch (step) {

      /* ── STEP 1: Basic Info ─────────────────────────────────────────────── */
      case 1:
        return (
          <div className="flex flex-col gap-5">
            <SectionHead>Personal Details</SectionHead>
            <div>
              <FieldLabel required>Full Legal Name</FieldLabel>
              <StyledInput placeholder="e.g. John Michael Smith" value={basicInfo.full_legal_name}
                onChange={e => setBasicInfo(b => ({ ...b, full_legal_name: e.target.value }))}
                error={errors.full_legal_name} />
              <FieldHint>Enter your name exactly as it appears on your government-issued ID.</FieldHint>
              <FieldError msg={errors.full_legal_name} />
            </div>
            <div>
              <FieldLabel>Business / Trade Name <span className="text-gray-400 font-normal">(optional)</span></FieldLabel>
              <StyledInput placeholder="e.g. Smith Home Services" value={basicInfo.business_name}
                onChange={e => setBasicInfo(b => ({ ...b, business_name: e.target.value }))} />
              <FieldHint>Leave blank if you operate as an individual.</FieldHint>
            </div>

            <SectionHead>Contact</SectionHead>

            {/* Account creation block — only when NOT logged in */}
            {!userId && (
              <div className="bg-gray-50 rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
                <p className="text-xs text-gray-500 leading-relaxed m-0">
                  Create your Urbance Pro account below. You&apos;ll use these credentials to log in and check your application status.
                </p>

                <div>
                  <FieldLabel required>Email Address</FieldLabel>
                  <StyledInput type="email" name="email" autoComplete="email" placeholder="e.g. john@example.com"
                    value={basicInfo.email}
                    onChange={e => setBasicInfo(b => ({ ...b, email: e.target.value }))}
                    error={errors.email} />
                  <FieldError msg={errors.email} />
                </div>

                <div>
                  <FieldLabel required>Create a Password</FieldLabel>
                  <div className="relative">
                    <StyledInput type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 8 characters"
                      value={basicInfo.password}
                      onChange={e => setBasicInfo(b => ({ ...b, password: e.target.value }))}
                      error={errors.password}
                      className="pr-12" />
                    <button type="button" onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 p-1 flex items-center">
                      {showPassword ? '🙈' : '👁'}
                    </button>
                  </div>
                  <FieldHint>Use at least 8 characters.</FieldHint>
                  <FieldError msg={errors.password} />
                </div>

                <div>
                  <FieldLabel required>Confirm Password</FieldLabel>
                  <div className="relative">
                    <StyledInput type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter your password"
                      value={basicInfo.confirmPassword}
                      onChange={e => setBasicInfo(b => ({ ...b, confirmPassword: e.target.value }))}
                      error={errors.confirmPassword}
                      className="pr-12" />
                    <button type="button" onClick={() => setShowConfirmPassword(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-gray-400 p-1 flex items-center">
                      {showConfirmPassword ? '🙈' : '👁'}
                    </button>
                  </div>
                  <FieldError msg={errors.confirmPassword} />
                </div>

                {/* Terms */}
                <label className={`flex items-start gap-3 cursor-pointer p-3.5 rounded-xl border-[1.5px] transition-colors ${
                  errors.terms ? 'bg-red-50 border-red-300' : termsAccepted ? 'bg-blue-50 border-blue-400' : 'bg-gray-50 border-gray-200'
                }`}>
                  <input type="checkbox" checked={termsAccepted}
                    onChange={e => {
                      setTermsAccepted(e.target.checked);
                      if (e.target.checked) setErrors(prev => { const n = { ...prev }; delete n.terms; return n; });
                    }}
                    className="w-[18px] h-[18px] mt-0.5 flex-shrink-0 accent-blue-500 cursor-pointer" />
                  <span className="text-[13px] text-gray-700 leading-relaxed">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-blue-500 font-semibold no-underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-500 font-semibold no-underline">Privacy Policy</a>.
                    {' '}I confirm I am at least 18 years old and legally eligible to provide services in Canada.
                  </span>
                </label>
                <FieldError msg={errors.terms} />

                {/* Auth error */}
                {authError && (
                  <div className="bg-red-50 border border-red-200 rounded-[10px] p-3">
                    <p className="text-[13px] text-red-600 m-0">⚠️ {authError}</p>
                  </div>
                )}
              </div>
            )}

            {/* Logged-in email (read-only) */}
            {userId && (
              <div>
                <FieldLabel required>Email Address</FieldLabel>
                <StyledInput type="email" value={basicInfo.email} readOnly className="bg-gray-50 text-gray-500" />
                <FieldHint>Logged in as {basicInfo.email}.</FieldHint>
              </div>
            )}

            <div>
              <FieldLabel required>Phone Number</FieldLabel>
              <StyledInput type="tel" placeholder="e.g. (604) 555-0123" value={basicInfo.phone}
                onChange={e => setBasicInfo(b => ({ ...b, phone: e.target.value }))}
                error={errors.phone} />
              <FieldError msg={errors.phone} />
            </div>

            <SectionHead>Location</SectionHead>
            <div>
              <FieldLabel required>City</FieldLabel>
              <StyledInput placeholder="e.g. Vancouver" value={basicInfo.city}
                onChange={e => setBasicInfo(b => ({ ...b, city: e.target.value }))}
                error={errors.city} />
              <FieldError msg={errors.city} />
            </div>
            <div>
              <FieldLabel>Street Address <span className="text-gray-400 font-normal">(optional)</span></FieldLabel>
              <StyledInput placeholder="e.g. 1234 Main St" value={basicInfo.address_line1}
                onChange={e => setBasicInfo(b => ({ ...b, address_line1: e.target.value }))} />
            </div>
            <div>
              <FieldLabel>Postal Code <span className="text-gray-400 font-normal">(optional)</span></FieldLabel>
              <StyledInput placeholder="e.g. V6B 1A1" value={basicInfo.postal_code}
                onChange={e => setBasicInfo(b => ({ ...b, postal_code: e.target.value }))} />
            </div>
          </div>
        );

      /* ── STEP 2: Services & Coverage ────────────────────────────────────── */
      case 2:
        return (
          <div className="flex flex-col gap-5">
            <SectionHead>What You Offer</SectionHead>
            <div>
              <FieldLabel required>Primary Service Category</FieldLabel>
              <StyledSelect value={services.primary_category} error={errors.primary_category}
                onChange={e => setServices(s => ({ ...s, primary_category: e.target.value, sub_services: [] }))}>
                <option value="">Select a category…</option>
                <option value="cleaning">🧹 Cleaning</option>
                <option value="handyman">🔧 Handyman</option>
                <option value="movers">📦 Movers</option>
                <option value="junk_removal">🗑 Junk Removal</option>
                <option value="other">✨ Other</option>
              </StyledSelect>
              <FieldError msg={errors.primary_category} />
            </div>

            {services.primary_category && (
              <div>
                <FieldLabel required>Sub-Services</FieldLabel>
                <FieldHint>Select all that apply.</FieldHint>
                <div className="mt-2.5">
                  <MultiSelectChips
                    options={SUB_SERVICES[services.primary_category] ?? []}
                    selected={services.sub_services}
                    onChange={v => setServices(s => ({ ...s, sub_services: v }))}
                    color={color}
                  />
                </div>
                <FieldError msg={errors.sub_services} />
              </div>
            )}

            <SectionHead>Where You Work</SectionHead>
            <div>
              <FieldLabel required>Service Areas</FieldLabel>
              <FieldHint>Select all cities / municipalities you serve in Metro Vancouver.</FieldHint>
              <div className="mt-2.5">
                <MultiSelectChips options={SERVICE_AREAS} selected={services.service_areas}
                  onChange={v => setServices(s => ({ ...s, service_areas: v }))} color={color} />
              </div>
              <FieldError msg={errors.service_areas} />
            </div>
            <div>
              <FieldLabel>Max Travel Distance (km) <span className="text-gray-400 font-normal">(optional)</span></FieldLabel>
              <StyledInput type="number" min={1} max={200} placeholder="e.g. 25" value={services.max_travel_km}
                onChange={e => setServices(s => ({ ...s, max_travel_km: e.target.value }))} />
            </div>
            <div>
              <FieldLabel required>Do you have a vehicle?</FieldLabel>
              <div className="flex gap-2.5 mt-1.5">
                {['yes', 'no'].map(v => (
                  <button key={v} type="button" onClick={() => setServices(s => ({ ...s, has_vehicle: v }))}
                    className="flex-1 py-2.5 rounded-[10px] text-sm font-semibold border-[1.5px] cursor-pointer transition-all"
                    style={{
                      borderColor: services.has_vehicle === v ? color : '#E5E7EB',
                      backgroundColor: services.has_vehicle === v ? light : '#FFFFFF',
                      color: services.has_vehicle === v ? color : '#6B7280',
                    }}>
                    {v === 'yes' ? '🚗 Yes' : '🚶 No'}
                  </button>
                ))}
              </div>
              <FieldError msg={errors.has_vehicle} />
            </div>
          </div>
        );

      /* ── STEP 3: Experience & Standards ──────────────────────────────────── */
      case 3:
        return (
          <div className="flex flex-col gap-5">
            <SectionHead>Your Background</SectionHead>
            <div>
              <FieldLabel required>Years of Experience</FieldLabel>
              <StyledSelect value={experience.years_experience} error={errors.years_experience}
                onChange={e => setExperience(x => ({ ...x, years_experience: e.target.value }))}>
                <option value="">Select…</option>
                <option value="less_1">Less than 1 year</option>
                <option value="1_2">1–2 years</option>
                <option value="3_5">3–5 years</option>
                <option value="6_10">6–10 years</option>
                <option value="10_plus">10+ years</option>
              </StyledSelect>
              <FieldError msg={errors.years_experience} />
            </div>
            <div>
              <FieldLabel required>Professional Bio</FieldLabel>
              <StyledTextarea
                placeholder="e.g. I have been providing professional cleaning services in the Lower Mainland for 5 years…"
                value={experience.professional_bio}
                onChange={e => setExperience(x => ({ ...x, professional_bio: e.target.value }))}
                error={errors.professional_bio}
                rows={5} />
              <FieldHint>{experience.professional_bio.length}/500 — min. 40 required.</FieldHint>
              <FieldError msg={errors.professional_bio} />
            </div>
            <div>
              <FieldLabel required>Team Size</FieldLabel>
              <div className="flex gap-2.5 mt-1.5">
                {[{ v: 'solo', label: '👤 Solo' }, { v: '2_5', label: '👥 2–5' }, { v: '6_plus', label: '🏢 6+' }].map(o => (
                  <button key={o.v} type="button" onClick={() => setExperience(x => ({ ...x, team_size: o.v }))}
                    className="flex-1 py-2.5 rounded-[10px] text-[13px] font-semibold border-[1.5px] cursor-pointer transition-all"
                    style={{
                      borderColor: experience.team_size === o.v ? color : '#E5E7EB',
                      backgroundColor: experience.team_size === o.v ? light : '#FFFFFF',
                      color: experience.team_size === o.v ? color : '#6B7280',
                    }}>
                    {o.label}
                  </button>
                ))}
              </div>
              <FieldError msg={errors.team_size} />
            </div>

            <SectionHead>Compliance</SectionHead>
            {/* Licensed */}
            <div>
              <FieldLabel required>Are you licensed where required?</FieldLabel>
              <div className="flex gap-2.5 mt-1.5">
                {['yes', 'no'].map(v => (
                  <button key={v} type="button" onClick={() => setExperience(x => ({ ...x, is_licensed: v }))}
                    className="flex-1 py-2.5 rounded-[10px] text-sm font-semibold border-[1.5px] cursor-pointer transition-all"
                    style={{
                      borderColor: experience.is_licensed === v ? color : '#E5E7EB',
                      backgroundColor: experience.is_licensed === v ? light : '#FFFFFF',
                      color: experience.is_licensed === v ? color : '#6B7280',
                    }}>
                    {v === 'yes' ? '✅ Yes' : '❌ No'}
                  </button>
                ))}
              </div>
              {experience.is_licensed === 'yes' && (
                <div className="mt-3">
                  <StyledInput placeholder="e.g. Gas fitter Class B — licence #XXXXX"
                    value={experience.license_details}
                    onChange={e => setExperience(x => ({ ...x, license_details: e.target.value }))} />
                  <FieldHint>List any trades licences, certifications, or registration numbers.</FieldHint>
                </div>
              )}
              <FieldError msg={errors.is_licensed} />
            </div>
            {/* Insured */}
            <div>
              <FieldLabel required>Are you insured?</FieldLabel>
              <div className="flex gap-2.5 mt-1.5">
                {['yes', 'no'].map(v => (
                  <button key={v} type="button" onClick={() => setExperience(x => ({ ...x, is_insured: v }))}
                    className="flex-1 py-2.5 rounded-[10px] text-sm font-semibold border-[1.5px] cursor-pointer transition-all"
                    style={{
                      borderColor: experience.is_insured === v ? color : '#E5E7EB',
                      backgroundColor: experience.is_insured === v ? light : '#FFFFFF',
                      color: experience.is_insured === v ? color : '#6B7280',
                    }}>
                    {v === 'yes' ? '🛡 Yes' : '❌ No'}
                  </button>
                ))}
              </div>
              {experience.is_insured === 'yes' && (
                <div className="mt-3">
                  <StyledInput placeholder="e.g. $2,000,000 general liability"
                    value={experience.policy_limit}
                    onChange={e => setExperience(x => ({ ...x, policy_limit: e.target.value }))} />
                  <FieldHint>Provide coverage amount and policy type.</FieldHint>
                </div>
              )}
              <FieldError msg={errors.is_insured} />
            </div>
            {/* References */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
              <div>
                <FieldLabel required>Professional References</FieldLabel>
                <FieldHint>Provide two references who can vouch for your work quality.</FieldHint>
              </div>
              {[0, 1].map(i => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col gap-3">
                  <p className="text-[12px] font-bold text-gray-400 uppercase tracking-wider m-0">Reference {i + 1}</p>
                  <div>
                    <FieldLabel required>Full Name</FieldLabel>
                    <StyledInput
                      placeholder="e.g. Jane Smith"
                      name={`ref_name_${i}`}
                      autoComplete="off"
                      value={experience.references[i]?.name ?? ''}
                      onChange={e => {
                        const refs = [...experience.references];
                        refs[i] = { ...refs[i], name: e.target.value };
                        setExperience(x => ({ ...x, references: refs }));
                      }}
                      error={i === 0 ? errors.reference1 : errors.reference2}
                    />
                  </div>
                  <div>
                    <FieldLabel required>Phone Number or Email</FieldLabel>
                    <StyledInput
                      placeholder="e.g. 604-555-1234 or jane@email.com"
                      name={`ref_contact_${i}`}
                      autoComplete="off"
                      value={experience.references[i]?.phone_or_email ?? ''}
                      onChange={e => {
                        const refs = [...experience.references];
                        refs[i] = { ...refs[i], phone_or_email: e.target.value };
                        setExperience(x => ({ ...x, references: refs }));
                      }}
                      error={i === 0 ? errors.reference1 : errors.reference2}
                    />
                  </div>
                </div>
              ))}
              <FieldError msg={errors.reference1} />
              <FieldError msg={errors.reference2} />
            </div>
          </div>
        );

      /* ── STEP 4: Pricing & Availability ──────────────────────────────────── */
      case 4:
        return (
          <div className="flex flex-col gap-5">
            <SectionHead>Availability</SectionHead>
            <div>
              <FieldLabel required>When Are You Available?</FieldLabel>
              <FieldHint>Select all that apply.</FieldHint>
              <div className="mt-2.5">
                <MultiSelectChips
                  options={['Weekdays (Mon–Fri)', 'Weekends', 'Evenings', 'Early Mornings', 'On-Call / Flexible']}
                  selected={pricing.availability}
                  onChange={v => setPricing(p => ({ ...p, availability: v }))}
                  color={color}
                />
              </div>
              <FieldError msg={errors.availability} />
            </div>
            <div>
              <FieldLabel>Earliest Available Start Date <span className="text-gray-400 font-normal">(optional)</span></FieldLabel>
              <StyledInput type="date" value={pricing.earliest_start}
                onChange={e => setPricing(p => ({ ...p, earliest_start: e.target.value }))} />
            </div>
            <div>
              <FieldLabel>Scheduling Notes <span className="text-gray-400 font-normal">(optional)</span></FieldLabel>
              <StyledTextarea rows={3} placeholder="e.g. Not available on statutory holidays."
                value={pricing.scheduling_notes}
                onChange={e => setPricing(p => ({ ...p, scheduling_notes: e.target.value }))} />
            </div>
          </div>
        );

      /* ── STEP 5: Documents ───────────────────────────────────────────────── */
      case 5:
        return (
          <div className="flex flex-col gap-5">
            {/* Info hint (not an error) */}
            {doneDocs.length === 0 && !errors.docs && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                <span className="text-lg flex-shrink-0">📋</span>
                <div>
                  <p className="text-[13px] font-bold text-blue-700 m-0 mb-1">Documents Required</p>
                  <p className="text-xs text-blue-800 m-0 leading-relaxed">
                    Upload at least one document to proceed. Government ID and insurance certificate are strongly recommended.
                  </p>
                </div>
              </div>
            )}

            {/* Success flash */}
            {uploadSuccess && (
              <div className="bg-green-50 border border-green-300 rounded-[10px] p-3 flex items-center gap-2.5">
                <span className="text-base">✅</span>
                <p className="text-[13px] font-semibold text-green-800 m-0">
                  Uploaded: <span className="font-bold">{uploadSuccess}</span>
                </p>
              </div>
            )}

            {/* Uploaded docs list */}
            {docs.length > 0 && (
              <div className="flex flex-col gap-2">
                <SectionHead>Uploaded Documents ({doneDocs.length})</SectionHead>
                {docs.map(doc => (
                  <div key={doc.id} className={`flex items-center gap-3 p-3 px-4 rounded-[10px] border ${
                    doc.status === 'error' ? 'bg-red-50 border-red-200' :
                    doc.status === 'done' ? 'bg-green-50 border-green-200' :
                    'bg-gray-50 border-gray-100'
                  }`}>
                    <span className="text-xl">
                      {doc.status === 'done' ? '✅' : doc.status === 'error' ? '❌' : '📄'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-900 m-0 truncate">{doc.file_name}</p>
                      <p className="text-[11px] text-gray-500 m-0">
                        {DOC_CATEGORIES.find(c => c.value === doc.category)?.label ?? doc.category}
                        {' · '}{(doc.file_size / 1024 / 1024).toFixed(1)} MB
                      </p>
                      {doc.status === 'uploading' && (
                        <div className="h-1 bg-gray-200 rounded-full mt-1.5 overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full w-1/2 animate-pulse" />
                        </div>
                      )}
                      {doc.status === 'done' && <p className="text-[11px] text-green-600 mt-0.5 m-0 font-semibold">✓ Uploaded</p>}
                      {doc.status === 'error' && <p className="text-[11px] text-red-600 mt-0.5 m-0 font-semibold">Upload failed — try again</p>}
                    </div>
                    {doc.status === 'uploading' && <span className="text-xs text-gray-500 flex-shrink-0">Uploading…</span>}
                    {doc.status !== 'uploading' && (
                      <button type="button" onClick={() => removeDoc(doc)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold text-red-600 border border-red-200 bg-red-50 cursor-pointer flex-shrink-0">
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add document */}
            <SectionHead>Add a Document</SectionHead>
            <div>
              <FieldLabel required>1. Select Document Category</FieldLabel>
              <StyledSelect value={pendingCategory}
                onChange={e => { setPendingCategory(e.target.value); setCategoryError(''); }}
                error={categoryError || undefined}>
                <option value="">— Choose a category —</option>
                {DOC_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </StyledSelect>
              {categoryError ? <FieldError msg={categoryError} /> : <FieldHint>Choose a category first, then upload the file.</FieldHint>}
            </div>

            <div>
              <FieldLabel>2. Upload File</FieldLabel>
              <input ref={fileInputRef} type="file" multiple
                accept=".pdf,.jpg,.jpeg,.png,.heic,.heif"
                disabled={!pendingCategory || isUploading}
                onChange={e => handleFileUpload(e.target.files)}
                className="hidden" />
              <button type="button"
                disabled={!pendingCategory || isUploading}
                onClick={() => {
                  if (!pendingCategory) { setCategoryError('Please select a category first.'); return; }
                  fileInputRef.current?.click();
                }}
                className="w-full py-5 rounded-xl text-sm font-semibold border-2 border-dashed transition-all cursor-pointer disabled:cursor-not-allowed"
                style={{
                  borderColor: (pendingCategory && !isUploading) ? color : '#E5E7EB',
                  backgroundColor: (pendingCategory && !isUploading) ? light : '#F9FAFB',
                  color: (pendingCategory && !isUploading) ? color : '#9CA3AF',
                }}>
                {isUploading ? '⏳ Uploading…' : pendingCategory ? '📁 Choose File(s) to Upload' : '← Select a category above first'}
              </button>
              <FieldHint>Accepted: PDF, JPG, PNG, HEIC · Max 20 MB per file.</FieldHint>
              {/* Show upload errors (not validation gate errors) */}
              {errors.docs && (
                <FieldError msg={errors.docs} />
              )}
            </div>
          </div>
        );

      /* ── STEP 6: Review & Submit ─────────────────────────────────────────── */
      case 6: {
        const sections = [
          {
            n: 1, title: 'Basic Info', c: STEP_COLORS[0],
            rows: [
              ['Full Name', basicInfo.full_legal_name],
              ['Business Name', basicInfo.business_name || '—'],
              ['Email', basicInfo.email],
              ['Phone', basicInfo.phone],
              ['City', basicInfo.city],
              ['Address', basicInfo.address_line1 || '—'],
              ['Postal Code', basicInfo.postal_code || '—'],
            ],
          },
          {
            n: 2, title: 'Services & Coverage', c: STEP_COLORS[1],
            rows: [
              ['Category', services.primary_category],
              ['Sub-Services', services.sub_services.join(', ') || '—'],
              ['Service Areas', services.service_areas.join(', ') || '—'],
              ['Has Vehicle', services.has_vehicle || '—'],
              ['Max Travel (km)', services.max_travel_km || '—'],
            ],
          },
          {
            n: 3, title: 'Experience & Standards', c: STEP_COLORS[2],
            rows: [
              ['Years Experience', experience.years_experience],
              ['Bio', experience.professional_bio ? experience.professional_bio.slice(0, 80) + '…' : '—'],
              ['Team Size', experience.team_size],
              ['Licensed', experience.is_licensed],
              ['Insured', experience.is_insured],
              ['Reference 1', experience.references[0]?.name ? `${experience.references[0].name} — ${experience.references[0].phone_or_email}` : '—'],
              ['Reference 2', experience.references[1]?.name ? `${experience.references[1].name} — ${experience.references[1].phone_or_email}` : '—'],
            ],
          },
          {
            n: 4, title: 'Availability', c: STEP_COLORS[3],
            rows: [
              ['Availability', pricing.availability.join(', ') || '—'],
              ['Start Date', pricing.earliest_start || '—'],
              ['Notes', pricing.scheduling_notes || '—'],
            ],
          },
          {
            n: 5, title: 'Documents', c: STEP_COLORS[4],
            rows: doneDocs.map(d => [
              DOC_CATEGORIES.find(c => c.value === d.category)?.label ?? d.category,
              d.file_name,
            ]),
          },
        ];

        return (
          <div className="flex flex-col gap-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-[13px] text-green-800 m-0">
                🎉 Almost there! Review your information below. Click <strong>Edit</strong> on any section to make changes.
              </p>
            </div>

            {sections.map(section => (
              <div key={section.n} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: section.c }}>
                      <span className="text-xs font-extrabold text-white">{section.n}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{section.title}</span>
                  </div>
                  <button type="button"
                    onClick={() => { setErrors({}); setStep(section.n); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="px-3.5 py-1 rounded-lg text-xs font-semibold cursor-pointer border"
                    style={{ color: section.c, borderColor: section.c + '20', backgroundColor: STEP_LIGHTS[section.n - 1] }}>
                    Edit
                  </button>
                </div>
                <div className="p-5 flex flex-col gap-2.5">
                  {section.rows.length > 0 ? section.rows.map(([k, v]) => (
                    <div key={k} className="flex gap-3 text-[13px]">
                      <span className="text-gray-400 min-w-[140px] flex-shrink-0">{k}</span>
                      <span className="text-gray-900 font-medium break-words">{v || '—'}</span>
                    </div>
                  )) : (
                    <p className="text-[13px] text-gray-400 m-0">No entries yet.</p>
                  )}
                </div>
              </div>
            ))}

            {/* Consent */}
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
              <p className="text-[13px] text-gray-500 m-0 leading-relaxed">
                By submitting this application, you confirm that all information provided is accurate and complete. Providing false information may result in disqualification.
              </p>
            </div>

            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-[10px] p-3 mb-4">
                <p className="text-[13px] text-red-600 m-0">⚠️ {submitError}</p>
              </div>
            )}

            <button type="button" onClick={handleSubmit} disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gray-900 text-white text-base font-bold border-none cursor-pointer shadow-lg shadow-black/15 disabled:opacity-70 disabled:cursor-not-allowed">
              {isSubmitting ? '⏳ Submitting…' : '🚀 Submit Application'}
            </button>
          </div>
        );
      }

      default:
        return null;
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RENDER: Main Form Layout
     ═══════════════════════════════════════════════════════════════════════ */
  const nextBtnLabel = authLoading
    ? '⏳ Creating account…'
    : isUploading
      ? '⏳ Upload in progress…'
      : step === 1 && !userId
        ? 'Create Account & Continue'
        : step === 5
          ? 'Review Application'
          : 'Save & Continue';

  return (
    <>
      <Navbar />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        .mobile-cta { display: none; }
        @media (max-width: 768px) {
          .apply-grid { grid-template-columns: 1fr !important; }
          .apply-sidebar { display: none !important; }
          .mobile-cta { display: block !important; }
        }
      `}</style>

      <main className="min-h-screen pt-[100px] pb-20 relative"
        style={{ background: 'linear-gradient(135deg,#F0F6FF 0%,#F5F0FF 40%,#F0FFF8 80%,#FFFBF0 100%)', fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif" }}>

        {/* Background blobs */}
        <div className="fixed -top-32 -right-32 w-[480px] h-[480px] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle,rgba(47,128,237,0.08) 0%,transparent 70%)' }} />
        <div className="fixed -bottom-20 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none z-0" style={{ background: 'radial-gradient(circle,rgba(124,58,237,0.07) 0%,transparent 70%)' }} />

        <div className="max-w-[1100px] mx-auto px-6 relative z-[1]">

          {/* ── Progress bar ── */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 px-6 mb-6 shadow-sm">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-bold text-gray-900">Application Progress</span>
              <div className="flex items-center gap-2.5">
                {saveStatus === 'saving' && <span className="text-[11px] text-gray-400">● Saving…</span>}
                {saveStatus === 'saved' && <span className="text-[11px] text-green-600">✓ Saved</span>}
                {saveStatus === 'error' && <span className="text-[11px] text-red-600">⚠ Save error</span>}
                <span className="text-xs font-extrabold text-gray-900">{pct}%</span>
              </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
            {/* Step dots */}
            <div className="flex items-center">
              {STEPS.map((s, i) => {
                const done = stepsCompleted[s.n];
                const active = step === s.n;
                const c = STEP_COLORS[i];
                return (
                  <div key={s.n} className="flex items-center" style={{ flex: i < STEPS.length - 1 ? 1 : undefined }}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-[10px] flex-shrink-0 flex items-center justify-center transition-all duration-300"
                        style={{
                          backgroundColor: done ? c : active ? c : '#F3F4F6',
                          boxShadow: active ? `0 4px 12px ${c}44` : 'none',
                        }}>
                        {done
                          ? <svg width="14" height="14" viewBox="0 0 16 16"><path d="M3 8l4 4 6-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                          : <span className="text-xs font-extrabold" style={{ color: active ? '#fff' : '#9CA3AF' }}>{s.n}</span>
                        }
                      </div>
                      <span className="hidden lg:block text-xs whitespace-nowrap" style={{ fontWeight: active ? 700 : 400, color: active ? '#111111' : '#9CA3AF' }}>
                        {s.title}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-0.5 mx-2 bg-gray-100 rounded-sm overflow-hidden">
                        <div className="h-full transition-all duration-500 ease-out" style={{ backgroundColor: c, width: done ? '100%' : '0%' }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Main grid ── */}
          <div className="apply-grid" style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', alignItems: 'start' }}>

            {/* ── Sidebar ── */}
            <div className="apply-sidebar flex flex-col gap-3.5 sticky top-[110px]">
              <div className="rounded-[18px] p-6 text-white" style={{ backgroundColor: color, boxShadow: `0 10px 32px ${color}44` }}>
                <div className="text-4xl mb-3">{STEPS[step - 1].icon}</div>
                <div className="text-[10px] font-bold text-white/60 tracking-widest uppercase mb-1">Step {step} of 6</div>
                <h2 className="text-lg font-bold text-white m-0 mb-2.5">{STEPS[step - 1].title}</h2>
                <p className="text-[13px] text-white/75 leading-relaxed m-0">{STEPS[step - 1].hint}</p>
              </div>

              <div className="bg-white rounded-[14px] border border-gray-100 p-4 shadow-sm">
                {STEPS.map((s, i) => {
                  const done = !!stepsCompleted[s.n];
                  const active = step === s.n;
                  const c = STEP_COLORS[i];
                  return (
                    <div key={s.n} className="flex items-center gap-2.5 py-2" style={{ borderBottom: i < STEPS.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                      <div className="w-6 h-6 rounded-[7px] flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: done ? c : active ? c : '#F3F4F6' }}>
                        {done
                          ? <svg width="11" height="11" viewBox="0 0 16 16"><path d="M3 8l4 4 6-6" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
                          : <span className="text-[10px] font-extrabold" style={{ color: active ? '#fff' : '#9CA3AF' }}>{s.n}</span>
                        }
                      </div>
                      <span className="text-xs" style={{ fontWeight: active ? 700 : 400, color: active ? '#111' : done ? '#6B7280' : '#9CA3AF' }}>
                        {s.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Form card ── */}
            <div className="bg-white rounded-[20px] border border-gray-100 overflow-hidden shadow-md">
              <div className="h-1" style={{ backgroundColor: color }} />
              <div className="p-8">
                {/* Header */}
                <div className="mb-7">
                  <div className="inline-flex items-center gap-2 rounded-full px-3.5 py-1 mb-3" style={{ backgroundColor: light }}>
                    <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color }}> Step {step} of 6</span>
                  </div>
                  <h3 className="text-[22px] font-extrabold text-gray-900 m-0 mb-1.5 tracking-tight">{STEPS[step - 1].title}</h3>
                  <p className="text-sm text-gray-500 m-0">{STEPS[step - 1].hint}</p>
                </div>

                {/* Error banner */}
                {Object.keys(errors).length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-[10px] p-4 mb-5 flex gap-2.5 items-start">
                    <span className="text-base flex-shrink-0">⚠</span>
                    <div>
                      <p className="text-[13px] font-bold text-red-600 m-0 mb-1">Please fix the following:</p>
                      <ul className="m-0 pl-4">
                        {Object.values(errors).map((msg, i) => (
                          <li key={i} className="text-xs text-red-700 leading-relaxed">{msg}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Step content */}
                {renderStep()}

                {/* Navigation buttons */}
                {step < 6 && (
                  <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                    {step > 1 && (
                      <button type="button" onClick={goBack}
                        className="flex items-center gap-1.5 px-5 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-gray-500 text-sm font-semibold cursor-pointer">
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Back
                      </button>
                    )}
                    <button type="button" onClick={goNext} disabled={isNextDisabled}
                      className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl border-none text-sm font-bold cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-70"
                      style={{
                        backgroundColor: (step === 5 && !canAdvanceFromStep5) ? '#E5E7EB' : color,
                        color: (step === 5 && !canAdvanceFromStep5) ? '#9CA3AF' : '#ffffff',
                        boxShadow: (step === 5 && !canAdvanceFromStep5) ? 'none' : `0 4px 14px ${color}44`,
                      }}>
                      {nextBtnLabel}
                      {!authLoading && !isUploading && (
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile sticky bottom bar */}
          {step < 6 && (
            <div className="mobile-cta fixed bottom-0 left-0 right-0 z-50 p-3 bg-white border-t border-gray-100 shadow-lg">
              <button type="button" onClick={goNext} disabled={isNextDisabled}
                className="w-full py-4 rounded-xl text-base font-bold border-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
                style={{
                  backgroundColor: (step === 5 && !canAdvanceFromStep5) ? '#E5E7EB' : color,
                  color: (step === 5 && !canAdvanceFromStep5) ? '#9CA3AF' : '#ffffff',
                }}>
                {authLoading ? '⏳ Creating account…' : isUploading ? '⏳ Uploading…' : step === 5 ? 'Review Application →' : 'Save & Continue →'}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
