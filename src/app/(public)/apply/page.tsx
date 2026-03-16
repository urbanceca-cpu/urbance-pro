'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

// ─── Types ────────────────────────────────────────────────────────────────────

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

interface ExperienceStandards {
  years_experience: string;
  professional_bio: string;
  team_size: string;
  is_licensed: string;
  license_details: string;
  is_insured: string;
  policy_limit: string;
  background_check: string;
}

interface PricingAvailability {
  pricing_model: string;
  min_job_price: string;
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

// ─── Constants ────────────────────────────────────────────────────────────────

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
  { value: 'government_id',         label: 'Government ID' },
  { value: 'business_license',      label: 'Business License' },
  { value: 'insurance_certificate', label: 'Insurance Certificate' },
  { value: 'trade_certification',   label: 'Trade Certification' },
  { value: 'worksafebc',            label: 'WorkSafeBC' },
  { value: 'background_check',      label: 'Background Check' },
  { value: 'proof_of_address',      label: 'Proof of Address' },
  { value: 'other',                 label: 'Other' },
];

const STEP_COLORS = ['#2F80ED', '#7C3AED', '#059669', '#D97706', '#DC2626', '#0F172A'];
const STEP_LIGHTS = ['#EBF3FD', '#F5F3FF', '#ECFDF5', '#FFFBEB', '#FEF2F2', '#F1F5F9'];

const STEPS = [
  { n: 1, title: 'Basic Info',             icon: '👤', hint: 'Your name, contact details, and location.' },
  { n: 2, title: 'Services & Coverage',    icon: '🛠', hint: 'What you offer and where you work.' },
  { n: 3, title: 'Experience & Standards', icon: '⭐', hint: 'Your background, licensing, and insurance.' },
  { n: 4, title: 'Pricing & Availability', icon: '💰', hint: 'Your rates and when you are available.' },
  { n: 5, title: 'Document Upload',        icon: '📎', hint: 'Required documents for verification.' },
  { n: 6, title: 'Review & Submit',        icon: '✅', hint: 'Review everything before submitting.' },
];

// ─── Helper Components ────────────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
      {children}{required && <span style={{ color: '#DC2626', marginLeft: '3px' }}>*</span>}
    </label>
  );
}

function FieldHint({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '4px' }}>{children}</p>;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p style={{ fontSize: '12px', color: '#DC2626', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>⚠ {msg}</p>;
}

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  const { error, ...rest } = props;
  return (
    <input
      {...rest}
      style={{
        width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px',
        border: `1.5px solid ${error ? '#FCA5A5' : '#E5E7EB'}`,
        backgroundColor: error ? '#FFF5F5' : '#FFFFFF',
        color: '#111111', outline: 'none', boxSizing: 'border-box',
        transition: 'border-color 0.2s',
        fontFamily: 'inherit',
        ...rest.style,
      }}
      onFocus={e => { e.currentTarget.style.borderColor = error ? '#DC2626' : '#2F80ED'; }}
      onBlur={e => { e.currentTarget.style.borderColor = error ? '#FCA5A5' : '#E5E7EB'; }}
    />
  );
}

function StyledTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  const { error, ...rest } = props;
  return (
    <textarea
      {...rest}
      style={{
        width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px',
        border: `1.5px solid ${error ? '#FCA5A5' : '#E5E7EB'}`,
        backgroundColor: error ? '#FFF5F5' : '#FFFFFF',
        color: '#111111', outline: 'none', boxSizing: 'border-box',
        resize: 'vertical', minHeight: '100px',
        transition: 'border-color 0.2s', fontFamily: 'inherit',
        ...rest.style,
      }}
      onFocus={e => { e.currentTarget.style.borderColor = error ? '#DC2626' : '#2F80ED'; }}
      onBlur={e => { e.currentTarget.style.borderColor = error ? '#FCA5A5' : '#E5E7EB'; }}
    />
  );
}

function StyledSelect(props: React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }) {
  const { error, children, ...rest } = props;
  return (
    <select
      {...rest}
      style={{
        width: '100%', padding: '11px 14px', borderRadius: '10px', fontSize: '14px',
        border: `1.5px solid ${error ? '#FCA5A5' : '#E5E7EB'}`,
        backgroundColor: '#FFFFFF', color: '#111111', outline: 'none',
        boxSizing: 'border-box', appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center',
        paddingRight: '36px', transition: 'border-color 0.2s', fontFamily: 'inherit',
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
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
      {options.map(o => {
        const active = selected.includes(o);
        return (
          <button key={o} type="button" onClick={() => toggle(o)} style={{
            padding: '7px 14px', borderRadius: '100px', fontSize: '13px', fontWeight: active ? 600 : 400,
            border: `1.5px solid ${active ? color : '#E5E7EB'}`,
            backgroundColor: active ? color : '#FFFFFF',
            color: active ? '#ffffff' : '#6B7280',
            cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
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
    <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px', marginTop: '28px', paddingBottom: '8px', borderBottom: '1px solid #F3F4F6' }}>
      {children}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ApplyPage() {
  const router = useRouter();
  const supabase = createClient();

  // ── Auth + App ID state ──
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [appId, setAppId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // ── Step state ──
  const [step, setStep] = useState(1);
  const [stepsCompleted, setStepsCompleted] = useState<Record<number, boolean>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showLanding, setShowLanding] = useState(true);

  // ── Form data ──
  const [basicInfo, setBasicInfo] = useState<BasicInfo>({ full_legal_name: '', business_name: '', email: '', phone: '', city: '', address_line1: '', postal_code: '', password: '', confirmPassword: '' });
  // Show/hide password toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [services, setServices] = useState<ServicesCoverage>({ primary_category: '', sub_services: [], service_areas: [], max_travel_km: '', has_vehicle: '' });
  const [experience, setExperience] = useState<ExperienceStandards>({ years_experience: '', professional_bio: '', team_size: '', is_licensed: '', license_details: '', is_insured: '', policy_limit: '', background_check: '' });
  const [pricing, setPricing] = useState<PricingAvailability>({ pricing_model: '', min_job_price: '', availability: [], earliest_start: '', scheduling_notes: '' });
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  // Inline auth state (used when user is not yet logged in — step 1)
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // ── Doc upload UI ──
  const [pendingCategory, setPendingCategory] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null); // file name of last successful upload
  const [categoryError, setCategoryError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── Load session + existing application ─────────────────────────────────
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      // Not logged in — still show the form, just don't load saved data
      if (!user) { setLoading(false); return; }
      setUserId(user.id);
      setUserEmail(user.email ?? '');
      setBasicInfo(b => ({ ...b, email: user.email ?? '' }));

      // fetch or create draft application
      const { data: existing } = await supabase
        .from('provider_applications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        setAppId(existing.id);
        if (existing.status === 'submitted') { setSubmitted(true); }
        if (existing.basic_info)             setBasicInfo({ ...existing.basic_info, email: user.email ?? '' });
        if (existing.services_coverage)      setServices(existing.services_coverage);
        if (existing.experience_standards)   setExperience(existing.experience_standards);
        if (existing.pricing_availability)   setPricing(existing.pricing_availability);
        if (existing.step_completed)         setStepsCompleted(existing.step_completed);
        // load docs
        const { data: docRows } = await supabase
          .from('provider_documents')
          .select('*')
          .eq('application_id', existing.id);
        if (docRows) {
          setDocs(docRows.map((d: Record<string, unknown>) => ({
            id: d.id as string, category: d.category as string, file_name: d.file_name as string,
            file_path: d.file_path as string, file_type: d.file_type as string,
            file_size: d.file_size as number, progress: 100, status: 'done' as const,
          })));
        }
      } else {
        const { data: created } = await supabase
          .from('provider_applications')
          .insert({ user_id: user.id, status: 'draft', step_completed: {}, basic_info: {}, services_coverage: {}, experience_standards: {}, pricing_availability: {} })
          .select('id')
          .single();
        if (created) setAppId(created.id);
      }
      setLoading(false);
    }
    init();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Debounced autosave ───────────────────────────────────────────────────
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const autosave = useCallback((patch: Record<string, unknown>) => {
    if (!appId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveStatus('saving');
    saveTimer.current = setTimeout(async () => {
      const { error } = await supabase
        .from('provider_applications')
        .update({ ...patch, updated_at: new Date().toISOString() })
        .eq('id', appId!);
      setSaveStatus(error ? 'error' : 'saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1200);
  }, [appId]);  // eslint-disable-line react-hooks/exhaustive-deps

  // autosave on each section change — always strip password before saving to DB
  useEffect(() => { if (appId) { const { password: _p, confirmPassword: _c, ...safeInfo } = basicInfo; autosave({ basic_info: safeInfo }); } }, [basicInfo]);  // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (appId) autosave({ services_coverage: services }); }, [services]);  // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (appId) autosave({ experience_standards: experience }); }, [experience]);  // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (appId) autosave({ pricing_availability: pricing }); }, [pricing]);  // eslint-disable-line react-hooks/exhaustive-deps

  // Reactively clear the docs validation error as soon as at least one document is done
  useEffect(() => {
    if (docs.some(d => d.status === 'done')) {
      setErrors(e => { const n = { ...e }; delete n.docs; return n; });
    }
  }, [docs]);  // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Validation ───────────────────────────────────────────────────────────
  function validateStep(s: number, skipAuth = false): Record<string, string> {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!basicInfo.full_legal_name.trim()) e.full_legal_name = 'Full legal name is required';
      if (!basicInfo.phone.trim()) e.phone = 'Phone number is required';
      if (!basicInfo.city.trim()) e.city = 'City is required';
      // Only require email/password when not already logged in
      if (!skipAuth && !userId) {
        if (!basicInfo.email.trim() || !/^[^@]+@[^@]+\.[^@]+$/.test(basicInfo.email)) e.email = 'A valid email address is required';
        if (!basicInfo.password || basicInfo.password.length < 8) e.password = 'Password must be at least 8 characters';
        if (basicInfo.password !== basicInfo.confirmPassword) e.confirmPassword = 'Passwords do not match';
        if (!termsAccepted) e.terms = 'You must accept the Terms of Service and Privacy Policy to continue';
      }
    }
    if (s === 2) {
      if (!services.primary_category) e.primary_category = 'Select a primary service category';
      if (!services.sub_services.length) e.sub_services = 'Select at least one sub-service';
      if (!services.service_areas.length) e.service_areas = 'Select at least one service area';
      if (!services.has_vehicle) e.has_vehicle = 'Please answer this question';
    }
    if (s === 3) {
      if (!experience.years_experience) e.years_experience = 'Years of experience required';
      if (!experience.professional_bio.trim() || experience.professional_bio.length < 40) e.professional_bio = 'Please write at least 40 characters';
      if (!experience.team_size) e.team_size = 'Team size required';
      if (!experience.is_licensed) e.is_licensed = 'Please answer this question';
      if (!experience.is_insured) e.is_insured = 'Please answer this question';
      if (!experience.background_check) e.background_check = 'Please answer this question';
    }
    if (s === 4) {
      if (!pricing.availability.length) e.availability = 'Select at least one availability window';
    }
    if (s === 5) {
      if (!docs.some(d => d.status === 'done')) e.docs = 'At least one document is required';
    }
    return e;
  }

  async function goNext() {
    const errs = validateStep(step);
    if (Object.keys(errs).length) { setErrors(errs); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setErrors({});

    // ── Step 1: create account ────────────────────────────────────────────
    if (step === 1 && !userId) {
      setAuthError('');
      setAuthLoading(true);
      try {
        // ── Auth: sign up client-side ──────────────────────────────────────
        // signUp() returns a session directly when email confirmation is
        // disabled in Supabase. No signInWithPassword needed after this.
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: basicInfo.email,
          password: basicInfo.password,
          options: { data: { full_name: basicInfo.full_legal_name } },
        });

        if (signUpError) {
          console.error('signUp error:', signUpError);
          const msg = signUpError.message.toLowerCase();
          if (msg.includes('already registered') || msg.includes('already exists') || msg.includes('user already')) {
            setAuthError('An account with this email already exists. Please use the login page to continue.');
          } else {
            setAuthError(signUpError.message ?? 'Failed to create account. Please try again.');
          }
          setAuthLoading(false);
          return;
        }

        if (!signUpData.user) {
          setAuthError('Failed to create account. Please try again.');
          setAuthLoading(false);
          return;
        }

        if (!signUpData.session) {
          // Supabase returns user+no session when the email already exists OR
          // when email confirmation is enabled. Either way we can't proceed.
          setAuthError(
            'An account with this email may already exist. Please use the login page, or check your inbox for a confirmation email.'
          );
          setAuthLoading(false);
          return;
        }

        // Session is live — auth.uid() matches user.id for all RLS checks
        const uid = signUpData.user.id;
        const fullName = basicInfo.full_legal_name?.trim() || 'Provider';
        const infoToSave = { ...basicInfo, password: '', confirmPassword: '' };
        setUserId(uid);
        setUserEmail(basicInfo.email);
        setBasicInfo(infoToSave);

        // ── DB setup: profile + draft app via admin API route ─────────────
        // Send the session JWT so the server can verify identity independently
        const accessToken = signUpData.session.access_token;
        const res = await fetch('/api/provider-signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ full_name: fullName }),
        });
        const result = await res.json();
        if (!res.ok) {
          // Non-fatal — profile trigger may have already created the row
          console.warn('DB setup warning:', result.error);
        }

        let aid: string | null = result.appId ?? null;
        if (!aid) {
          const { data: created } = await supabase.from('provider_applications')
            .insert({ user_id: uid, status: 'draft', step_completed: {}, basic_info: infoToSave, services_coverage: services, experience_standards: experience, pricing_availability: pricing })
            .select('id').single();
          aid = created?.id ?? null;
        } else {
          await supabase.from('provider_applications').update({ basic_info: infoToSave }).eq('id', aid);
        }
        if (aid) setAppId(aid);

        const newCompleted = { ...stepsCompleted, 1: true };
        setStepsCompleted(newCompleted);
        if (aid) await supabase.from('provider_applications').update({ step_completed: newCompleted }).eq('id', aid);

        setAuthLoading(false);
        setStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (err) {
        console.error('Signup error:', err);
        setAuthError('Something went wrong. Please try again.');
        setAuthLoading(false);
      }
      return;
    }

    const newCompleted = { ...stepsCompleted, [step]: true };
    setStepsCompleted(newCompleted);
    if (appId) {
      await supabase.from('provider_applications').update({ step_completed: newCompleted }).eq('id', appId);
    }
    setStep(s => s + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    setErrors({});
    setStep(s => s - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ─── Final submit ─────────────────────────────────────────────────────────
  async function handleSubmit() {
    // validate all steps (skip auth check since user is already logged in by this point)
    for (let s = 1; s <= 5; s++) {
      const e = validateStep(s, true);
      if (Object.keys(e).length) {
        setErrors(e);
        setStep(s);
        return;
      }
    }
    setSubmitError('');
    setIsSubmitting(true);
    const { error } = await supabase
      .from('provider_applications')
      .update({
        status: 'submitted',
        submitted_at: new Date().toISOString(),
        step_completed: { 1: true, 2: true, 3: true, 4: true, 5: true, 6: true },
      })
      .eq('id', appId!);
    setIsSubmitting(false);
    if (error) { setSubmitError('Submission failed: ' + error.message + '. Please try again.'); return; }
    setSubmitted(true);
  }

  // ─── Document upload ──────────────────────────────────────────────────────
  async function handleFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return;

    // Guard: category must be selected first
    if (!pendingCategory) {
      setCategoryError('Please select a document category before uploading.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    setCategoryError('');

    // Always fetch a fresh session — stale state can cause 401/CORS failures
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErrors(e => ({ ...e, docs: 'You must be signed in to upload documents. Please complete Step 1 first.' }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    const activeUserId = user.id;
    const activeAppId = appId ?? userId; // fallback to userId if appId not set yet

    if (!activeAppId) {
      setErrors(e => ({ ...e, docs: 'Please complete Step 1 first to enable document uploads.' }));
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const MAX_SIZE = 20 * 1024 * 1024;
    setIsUploading(true);
    setUploadSuccess(null);
    let lastSuccessName: string | null = null;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > MAX_SIZE) {
        setErrors(e => ({ ...e, docs: `${file.name} exceeds the 20 MB limit.` }));
        continue;
      }
      const allowed = ['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'application/pdf'];
      if (!allowed.includes(file.type) && !file.name.toLowerCase().endsWith('.heic')) {
        setErrors(e => ({ ...e, docs: `${file.name}: unsupported file type. Use PDF, JPG, PNG, or HEIC.` }));
        continue;
      }

      const timestamp = Date.now();
      const safeName = file.name.replace(/[^\w.-]/g, '_');
      // RLS: (storage.foldername(name))[1] = auth.uid()::text
      // First path segment MUST be the user UUID with no prefix folder.
      const storagePath = `${activeUserId}/${timestamp}-${safeName}`;
      const contentType = file.type || 'application/octet-stream';

      const uid = `${timestamp}-${Math.random().toString(36).slice(2)}`;

      // Add as "uploading" immediately so user sees feedback
      const tempDoc: UploadedDoc = {
        id: uid, category: pendingCategory, file_name: file.name,
        file_path: storagePath, file_type: contentType,
        file_size: file.size, progress: 0, status: 'uploading',
      };
      setDocs(d => [...d, tempDoc]);
      setErrors(e => { const n = { ...e }; delete n.docs; return n; });

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('provider-documents')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setDocs(d => d.map(x => x.id === uid ? { ...x, status: 'error', progress: 0 } : x));
        setErrors(e => ({ ...e, docs: 'Document upload failed. Please try again.' }));
        continue;
      }

      console.log('Upload success:', uploadData);

      // Save record to provider_documents table
      const finalPath = uploadData?.path ?? storagePath;
      const { data: savedDoc, error: dbError } = await supabase.from('provider_documents').insert({
        user_id: activeUserId,
        application_id: activeAppId,
        category: pendingCategory,
        file_name: file.name,
        file_path: finalPath,
        file_type: contentType,
        file_size: file.size,
      }).select('id').single();

      if (dbError) {
        console.error('DB insert error:', dbError);
        // Upload succeeded but DB record failed — still mark as done (can be reconciled)
      }

      setDocs(d => d.map(x => x.id === uid
        ? { ...x, id: savedDoc?.id ?? uid, status: 'done', progress: 100, file_path: finalPath }
        : x
      ));
      setErrors(e => { const n = { ...e }; delete n.docs; return n; });
      lastSuccessName = file.name;
    }

    if (lastSuccessName) {
      setUploadSuccess(lastSuccessName);
      setTimeout(() => setUploadSuccess(null), 4000);
    }

    setIsUploading(false);
    setPendingCategory('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function removeDoc(doc: UploadedDoc) {
    await supabase.storage.from('provider-documents').remove([doc.file_path]);
    await supabase.from('provider_documents').delete().eq('id', doc.id);
    setDocs(d => d.filter(x => x.id !== doc.id));
  }

  // ─── Render helpers ───────────────────────────────────────────────────────
  const pct = Math.round((Object.keys(stepsCompleted).length / 6) * 100);
  const color = STEP_COLORS[step - 1];
  const light = STEP_LIGHTS[step - 1];

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#F0F6FF,#F5F0FF,#F0FFF8)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid #E5E7EB', borderTopColor: '#2F80ED', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: '#6B7280', fontSize: '14px' }}>Loading your application…</p>
          </div>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#F0F6FF,#F5F0FF,#F0FFF8)', padding: '40px 24px' }}>
          <div className="apply-submitted-card" style={{ backgroundColor: '#ffffff', borderRadius: '24px', border: '1px solid #EEEFF1', padding: '56px 48px', maxWidth: '520px', width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.06)' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 24px' }}>✅</div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111111', margin: '0 0 12px', letterSpacing: '-0.03em' }}>Application Submitted!</h1>
            <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.7, margin: '0 0 24px' }}>
              Thank you. Your application has been submitted successfully. Our team is reviewing your information and will notify you within 3–5 business days.
            </p>
            <div style={{ backgroundColor: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '12px', padding: '16px 20px', marginBottom: '32px' }}>
              <p style={{ fontSize: '13px', color: '#92400E', margin: 0, fontWeight: 600 }}>Status: Under Review</p>
              <p style={{ fontSize: '12px', color: '#92400E', margin: '4px 0 0', opacity: 0.8 }}>Dashboard access will be granted once approved.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => router.push('/login')} style={{ padding: '14px 32px', borderRadius: '12px', backgroundColor: '#111111', color: '#ffffff', fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                Go to Login
              </button>
              <button onClick={() => router.push('/')} style={{ padding: '14px 24px', borderRadius: '12px', backgroundColor: '#ffffff', color: '#374151', fontSize: '14px', fontWeight: 600, border: '1.5px solid #E5E7EB', cursor: 'pointer', fontFamily: 'inherit' }}>
                Back to Home
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ─── Landing screen ──────────────────────────────────────────────────────
  if (showLanding) {
    return (
      <>
        <Navbar />
        <main style={{ fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif", backgroundColor: '#ffffff', color: '#111111' }}>
          {/* Hero */}
          <section className="apply-landing-hero" style={{ padding: '140px 24px 80px', background: 'linear-gradient(135deg,#F0F6FF 0%,#F5F0FF 50%,#F0FFF8 100%)', borderBottom: '1px solid #EEEFF1', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(47,128,237,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.08) 0%,transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center', position: 'relative' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#EBF3FD', borderRadius: '100px', padding: '7px 16px', marginBottom: '24px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#2F80ED', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Pro Application</span>
              </div>
              <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, color: '#111111', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 20px' }}>
                Join Urbance as a<br /><span style={{ color: '#2F80ED' }}>Verified Pro</span>
              </h1>
              <p style={{ fontSize: '18px', color: '#6B7280', lineHeight: 1.7, margin: '0 0 40px', maxWidth: '540px', marginLeft: 'auto', marginRight: 'auto' }}>
                Complete our 6-step application to get matched with local homeowners and grow your service business.
              </p>
              <div className="apply-landing-cta-row" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' as const, marginBottom: '56px' }}>
                <button onClick={() => setShowLanding(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '16px 36px', borderRadius: '14px', backgroundColor: '#2F80ED', color: '#ffffff', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 24px rgba(47,128,237,0.3)' }}>
                  Start My Application
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
                <a href="/how-it-works" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '16px 28px', borderRadius: '14px', backgroundColor: '#ffffff', color: '#111111', fontSize: '15px', fontWeight: 600, border: '1.5px solid #E5E7EB', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'none' }}>How It Works</a>
              </div>
              {/* Stat strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', backgroundColor: '#EEEFF1', borderRadius: '16px', overflow: 'hidden', maxWidth: '480px', margin: '0 auto' }}>
                {[{ n: '~10 min', l: 'To complete' }, { n: '3–5 days', l: 'Review time' }, { n: '$0', l: 'Application fee' }].map(s => (
                  <div key={s.l} style={{ backgroundColor: '#ffffff', padding: '20px 16px', textAlign: 'center' }}>
                    <div style={{ fontSize: '18px', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em' }}>{s.n}</div>
                    <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '3px' }}>{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Steps overview */}
          <section style={{ padding: '80px 24px', backgroundColor: '#ffffff' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#111111', letterSpacing: '-0.03em', margin: '0 0 10px' }}>What You&apos;ll Need to Complete</h2>
                <p style={{ fontSize: '15px', color: '#6B7280', margin: 0 }}>Six short steps — save your progress at any time.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '16px' }}>
                {[
                  { n: 1, color: '#2F80ED', light: '#EBF3FD', icon: '👤', title: 'Basic Info',             desc: 'Your name, phone number, and city.' },
                  { n: 2, color: '#7C3AED', light: '#F5F3FF', icon: '🛠',  title: 'Services & Coverage',    desc: 'What you offer and where you work.' },
                  { n: 3, color: '#059669', light: '#ECFDF5', icon: '⭐', title: 'Experience & Standards', desc: 'Years of experience, licensing, insurance.' },
                  { n: 4, color: '#D97706', light: '#FFFBEB', icon: '💰', title: 'Pricing & Availability', desc: 'Your rates and available schedule.' },
                  { n: 5, color: '#DC2626', light: '#FEF2F2', icon: '📎', title: 'Document Upload',        desc: 'ID, insurance certificate, and more.' },
                  { n: 6, color: '#0F172A', light: '#F1F5F9', icon: '✅', title: 'Review & Submit',        desc: 'Check everything and submit.' },
                ].map(s => (
                  <div key={s.n} style={{ backgroundColor: '#FAFBFC', borderRadius: '16px', border: '1px solid #EEEFF1', padding: '24px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <span style={{ fontSize: '18px' }}>{s.icon}</span>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '4px' }}>Step {s.n} — {s.title}</div>
                      <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: '48px' }}>
                <button onClick={() => setShowLanding(false)} style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', padding: '15px 40px', borderRadius: '14px', backgroundColor: '#111111', color: '#ffffff', fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                  Begin Application →
                </button>
              </div>
            </div>
          </section>

          {/* What to prepare */}
          <section style={{ padding: '0 24px 80px', backgroundColor: '#ffffff' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto' }}>
              <div style={{ backgroundColor: '#F8F9FC', borderRadius: '20px', border: '1px solid #EEEFF1', padding: '40px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111111', margin: '0 0 24px', letterSpacing: '-0.02em' }}>📋 What to Prepare</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '16px' }}>
                  {[
                    { icon: '🪪', title: 'Government ID', desc: 'Driver\'s licence or passport' },
                    { icon: '🏠', title: 'Proof of Address', desc: 'Utility bill or bank statement' },
                    { icon: '🛡', title: 'Insurance Cert.', desc: 'If you carry liability insurance' },
                    { icon: '💳', title: 'Banking Info', desc: 'For direct deposit of earnings' },
                  ].map(i => (
                    <div key={i.title} style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #EEEFF1', padding: '18px' }}>
                      <div style={{ fontSize: '24px', marginBottom: '8px' }}>{i.icon}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#111111', marginBottom: '4px' }}>{i.title}</div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{i.desc}</div>
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

  // ─── Step content ─────────────────────────────────────────────────────────
  function renderStep() {
    switch (step) {

      // ── STEP 1: Basic Info ───────────────────────────────────────────────
      case 1: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
            <FieldLabel>Business / Trade Name <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span></FieldLabel>
            <StyledInput placeholder="e.g. Smith Home Services" value={basicInfo.business_name}
              onChange={e => setBasicInfo(b => ({ ...b, business_name: e.target.value }))} />
            <FieldHint>Leave blank if you operate as an individual.</FieldHint>
          </div>

          <SectionHead>Contact</SectionHead>

          {/* ── Account creation block (only when not logged in) ── */}
          {!userId && (
            <div style={{ backgroundColor: '#F8F9FC', borderRadius: '16px', border: '1px solid #EEEFF1', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, lineHeight: 1.6 }}>
                Create your Urbance Pro account below. You&apos;ll use these credentials to log in and check your application status.
              </p>

              {/* Email */}
              <div>
                <FieldLabel required>Email Address</FieldLabel>
                <StyledInput type="email" placeholder="e.g. john@example.com"
                  value={basicInfo.email}
                  onChange={e => setBasicInfo(b => ({ ...b, email: e.target.value }))}
                  error={errors.email} />
                <FieldError msg={errors.email} />
              </div>

              {/* Password */}
              <div>
                <FieldLabel required>Create a Password</FieldLabel>
                <div style={{ position: 'relative' }}>
                  <StyledInput type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={basicInfo.password}
                    onChange={e => setBasicInfo(b => ({ ...b, password: e.target.value }))}
                    error={errors.password}
                    style={{ paddingRight: '48px' }} />
                  <button type="button" onClick={() => setShowPassword(v => !v)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '4px', display: 'flex', alignItems: 'center' }}>
                    {showPassword
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                <FieldHint>Use at least 8 characters. You&apos;ll use this to log in to your dashboard.</FieldHint>
                <FieldError msg={errors.password} />
              </div>

              {/* Confirm Password */}
              <div>
                <FieldLabel required>Confirm Password</FieldLabel>
                <div style={{ position: 'relative' }}>
                  <StyledInput type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={basicInfo.confirmPassword}
                    onChange={e => setBasicInfo(b => ({ ...b, confirmPassword: e.target.value }))}
                    error={errors.confirmPassword}
                    style={{ paddingRight: '48px' }} />
                  <button type="button" onClick={() => setShowConfirmPassword(v => !v)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '4px', display: 'flex', alignItems: 'center' }}>
                    {showConfirmPassword
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
                <FieldError msg={errors.confirmPassword} />
              </div>

              {/* Terms & Privacy */}
              <div style={{ paddingTop: '4px' }}>
                  <label style={{
                    display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer',
                    padding: '14px 16px', borderRadius: '12px',
                    backgroundColor: errors.terms ? '#FEF2F2' : '#F8F9FC',
                    border: `1.5px solid ${errors.terms ? '#FCA5A5' : termsAccepted ? '#2F80ED' : '#E5E7EB'}`,
                    transition: 'border-color 0.15s',
                  }}>
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={e => {
                        setTermsAccepted(e.target.checked);
                        if (e.target.checked) setErrors(ev => { const n = { ...ev }; delete n.terms; return n; });
                      }}
                      style={{ width: '18px', height: '18px', marginTop: '1px', flexShrink: 0, accentColor: '#2F80ED', cursor: 'pointer' }}
                    />
                    <span style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>
                      I agree to the{' '}
                      <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#2F80ED', fontWeight: 600, textDecoration: 'none' }}>Terms of Service</a>
                      {' '}and{' '}
                      <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#2F80ED', fontWeight: 600, textDecoration: 'none' }}>Privacy Policy</a>.
                      {' '}I confirm I am at least 18 years old and legally eligible to provide services in Canada.
                    </span>
                  </label>
                  <FieldError msg={errors.terms} />
              </div>

              {/* Auth error */}
              {authError && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 14px' }}>
                  <p style={{ fontSize: '13px', color: '#DC2626', margin: 0 }}>⚠️ {authError}</p>
                </div>
              )}
            </div>
          )}

          {/* Email read-only when already logged in */}
          {userId && (
            <div>
              <FieldLabel required>Email Address</FieldLabel>
              <StyledInput type="email" value={basicInfo.email} readOnly
                style={{ backgroundColor: '#F9FAFB', color: '#6B7280' }} />
              <FieldHint>Logged in as {basicInfo.email}. Contact support to change.</FieldHint>
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
            <FieldLabel>Street Address <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span></FieldLabel>
            <StyledInput placeholder="e.g. 1234 Main St" value={basicInfo.address_line1}
              onChange={e => setBasicInfo(b => ({ ...b, address_line1: e.target.value }))} />
          </div>
          <div>
            <FieldLabel>Postal Code <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span></FieldLabel>
            <StyledInput placeholder="e.g. V6B 1A1" value={basicInfo.postal_code}
              onChange={e => setBasicInfo(b => ({ ...b, postal_code: e.target.value }))} />
          </div>
        </div>
      );

      // ── STEP 2: Services & Coverage ──────────────────────────────────────
      case 2: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              <FieldHint>Select all that apply to you.</FieldHint>
              <div style={{ marginTop: '10px' }}>
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
            <div style={{ marginTop: '10px' }}>
              <MultiSelectChips options={SERVICE_AREAS} selected={services.service_areas}
                onChange={v => setServices(s => ({ ...s, service_areas: v }))} color={color} />
            </div>
            <FieldError msg={errors.service_areas} />
          </div>
          <div>
            <FieldLabel>Max Travel Distance (km) <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span></FieldLabel>
            <StyledInput type="number" min={1} max={200} placeholder="e.g. 25" value={services.max_travel_km}
              onChange={e => setServices(s => ({ ...s, max_travel_km: e.target.value }))} />
          </div>
          <div>
            <FieldLabel required>Do you have a vehicle?</FieldLabel>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              {['yes', 'no'].map(v => (
                <button key={v} type="button" onClick={() => setServices(s => ({ ...s, has_vehicle: v }))} style={{
                  flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                  border: `1.5px solid ${services.has_vehicle === v ? color : '#E5E7EB'}`,
                  backgroundColor: services.has_vehicle === v ? light : '#FFFFFF',
                  color: services.has_vehicle === v ? color : '#6B7280',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>{v === 'yes' ? '🚗 Yes' : '🚶 No'}</button>
              ))}
            </div>
            <FieldError msg={errors.has_vehicle} />
          </div>
        </div>
      );

      // ── STEP 3: Experience & Standards ──────────────────────────────────
      case 3: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
              placeholder="e.g. I have been providing professional cleaning services in the Lower Mainland for 5 years. I specialise in deep cleans and move-in/move-out services, and always arrive with my own equipment…"
              value={experience.professional_bio}
              onChange={e => setExperience(x => ({ ...x, professional_bio: e.target.value }))}
              error={errors.professional_bio}
              rows={5}
            />
            <FieldHint>{experience.professional_bio.length}/500 characters — minimum 40 required.</FieldHint>
            <FieldError msg={errors.professional_bio} />
          </div>
          <div>
            <FieldLabel required>Team Size</FieldLabel>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              {[{ v: 'solo', label: '👤 Solo' }, { v: '2_5', label: '👥 2–5' }, { v: '6_plus', label: '🏢 6+' }].map(o => (
                <button key={o.v} type="button" onClick={() => setExperience(x => ({ ...x, team_size: o.v }))} style={{
                  flex: 1, padding: '11px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                  border: `1.5px solid ${experience.team_size === o.v ? color : '#E5E7EB'}`,
                  backgroundColor: experience.team_size === o.v ? light : '#FFFFFF',
                  color: experience.team_size === o.v ? color : '#6B7280',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>{o.label}</button>
              ))}
            </div>
            <FieldError msg={errors.team_size} />
          </div>

          <SectionHead>Compliance</SectionHead>
          <div>
            <FieldLabel required>Are you licensed where required?</FieldLabel>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              {['yes', 'no'].map(v => (
                <button key={v} type="button" onClick={() => setExperience(x => ({ ...x, is_licensed: v }))} style={{
                  flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                  border: `1.5px solid ${experience.is_licensed === v ? color : '#E5E7EB'}`,
                  backgroundColor: experience.is_licensed === v ? light : '#FFFFFF',
                  color: experience.is_licensed === v ? color : '#6B7280',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>{v === 'yes' ? '✅ Yes' : '❌ No'}</button>
              ))}
            </div>
            {experience.is_licensed === 'yes' && (
              <div style={{ marginTop: '12px' }}>
                <StyledInput placeholder="e.g. Gas fitter Class B — licence #XXXXX" value={experience.license_details}
                  onChange={e => setExperience(x => ({ ...x, license_details: e.target.value }))} />
                <FieldHint>List any trades licences, certifications, or registration numbers.</FieldHint>
              </div>
            )}
            <FieldError msg={errors.is_licensed} />
          </div>

          <div>
            <FieldLabel required>Are you insured?</FieldLabel>
            <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
              {['yes', 'no'].map(v => (
                <button key={v} type="button" onClick={() => setExperience(x => ({ ...x, is_insured: v }))} style={{
                  flex: 1, padding: '11px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
                  border: `1.5px solid ${experience.is_insured === v ? color : '#E5E7EB'}`,
                  backgroundColor: experience.is_insured === v ? light : '#FFFFFF',
                  color: experience.is_insured === v ? color : '#6B7280',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>{v === 'yes' ? '🛡 Yes' : '❌ No'}</button>
              ))}
            </div>
            {experience.is_insured === 'yes' && (
              <div style={{ marginTop: '12px' }}>
                <StyledInput placeholder="e.g. $2,000,000 general liability" value={experience.policy_limit}
                  onChange={e => setExperience(x => ({ ...x, policy_limit: e.target.value }))} />
                <FieldHint>Provide coverage amount and policy type.</FieldHint>
              </div>
            )}
            <FieldError msg={errors.is_insured} />
          </div>

          <div>
            <FieldLabel required>Background Check Status</FieldLabel>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '6px' }}>
              {[{ v: 'yes', label: '✅ Have one' }, { v: 'no', label: '❌ Do not have one' }, { v: 'need', label: '🔄 Will get one' }].map(o => (
                <button key={o.v} type="button" onClick={() => setExperience(x => ({ ...x, background_check: o.v }))} style={{
                  flex: 1, minWidth: '140px', padding: '11px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                  border: `1.5px solid ${experience.background_check === o.v ? color : '#E5E7EB'}`,
                  backgroundColor: experience.background_check === o.v ? light : '#FFFFFF',
                  color: experience.background_check === o.v ? color : '#6B7280',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>{o.label}</button>
              ))}
            </div>
            <FieldError msg={errors.background_check} />
          </div>
        </div>
      );

      // ── STEP 4: Pricing & Availability ──────────────────────────────────
      case 4: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <SectionHead>Availability</SectionHead>
          <div>
            <FieldLabel required>When Are You Available?</FieldLabel>
            <FieldHint>Select all that apply.</FieldHint>
            <div style={{ marginTop: '10px' }}>
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
            <FieldLabel>Earliest Available Start Date <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span></FieldLabel>
            <StyledInput type="date" value={pricing.earliest_start}
              onChange={e => setPricing(p => ({ ...p, earliest_start: e.target.value }))} />
          </div>
          <div>
            <FieldLabel>Scheduling Notes <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span></FieldLabel>
            <StyledTextarea rows={3} placeholder="e.g. Not available on statutory holidays. Prefer morning bookings."
              value={pricing.scheduling_notes}
              onChange={e => setPricing(p => ({ ...p, scheduling_notes: e.target.value }))} />
          </div>
        </div>
      );

      // ── STEP 5: Documents ────────────────────────────────────────────────
      case 5: {
        const doneDocs = docs.filter(d => d.status === 'done');
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Neutral info hint — only shown before any doc is uploaded, not an error */}
            {doneDocs.length === 0 && (
              <div style={{ backgroundColor: '#F0F6FF', border: '1px solid #BFDBFE', borderRadius: '12px', padding: '16px 18px', display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>📋</span>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#1D4ED8', margin: '0 0 4px' }}>Documents Required</p>
                  <p style={{ fontSize: '12px', color: '#1E40AF', margin: 0, lineHeight: 1.6 }}>
                    Upload at least one document to unlock the next step. Government ID and insurance certificate are strongly recommended.
                  </p>
                </div>
              </div>
            )}

            {/* ✅ Upload success flash */}
            {uploadSuccess && (
              <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #6EE7B7', borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '16px' }}>✅</span>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#065F46', margin: 0 }}>
                  File uploaded successfully: <span style={{ fontWeight: 700 }}>{uploadSuccess}</span>
                </p>
              </div>
            )}

            {/* Uploaded documents list */}
            {docs.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <SectionHead>Uploaded Documents ({doneDocs.length})</SectionHead>
                {docs.map(doc => (
                  <div key={doc.id} style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
                    backgroundColor: doc.status === 'error' ? '#FFF5F5' : doc.status === 'done' ? '#F0FDF4' : '#F8F9FC',
                    borderRadius: '10px',
                    border: `1px solid ${doc.status === 'error' ? '#FECACA' : doc.status === 'done' ? '#BBF7D0' : '#EEEFF1'}`,
                  }}>
                    <span style={{ fontSize: '20px' }}>
                      {doc.status === 'done' ? '✅' : doc.status === 'error' ? '❌' : (doc.file_type.includes('pdf') ? '📄' : '🖼')}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#111111', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.file_name}
                      </p>
                      <p style={{ fontSize: '11px', color: '#6B7280', margin: 0 }}>
                        {DOC_CATEGORIES.find(c => c.value === doc.category)?.label ?? doc.category}
                        {' · '}{(doc.file_size / 1024 / 1024).toFixed(1)} MB
                      </p>
                      {doc.status === 'uploading' && (
                        <div style={{ height: '4px', backgroundColor: '#E5E7EB', borderRadius: '100px', marginTop: '6px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', backgroundColor: '#2F80ED', borderRadius: '100px', animation: 'progress-slide 1.2s ease-in-out infinite', width: '50%' }} />
                        </div>
                      )}
                      {doc.status === 'done' && (
                        <p style={{ fontSize: '11px', color: '#059669', margin: '3px 0 0', fontWeight: 600 }}>✓ Uploaded</p>
                      )}
                      {doc.status === 'error' && (
                        <p style={{ fontSize: '11px', color: '#DC2626', margin: '3px 0 0', fontWeight: 600 }}>Upload failed — please try again</p>
                      )}
                    </div>
                    {doc.status === 'uploading' && (
                      <span style={{ fontSize: '12px', color: '#6B7280', flexShrink: 0 }}>Uploading…</span>
                    )}
                    {doc.status !== 'uploading' && (
                      <button type="button" onClick={() => removeDoc(doc)} style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: '#DC2626', border: '1px solid #FECACA', backgroundColor: '#FFF5F5', cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }}>
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Add a document */}
            <SectionHead>Add a Document</SectionHead>

            {/* Step 1 of upload: pick category */}
            <div>
              <FieldLabel required>1. Select Document Category</FieldLabel>
              <StyledSelect
                value={pendingCategory}
                onChange={e => { setPendingCategory(e.target.value); setCategoryError(''); }}
                error={categoryError || undefined}
              >
                <option value="">— Choose a category —</option>
                {DOC_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </StyledSelect>
              {categoryError
                ? <FieldError msg={categoryError} />
                : <FieldHint>Choose a category first, then upload the file.</FieldHint>
              }
            </div>

            {/* Step 2 of upload: pick file */}
            <div>
              <FieldLabel>2. Upload File</FieldLabel>
              <input ref={fileInputRef} type="file" id="doc-upload" multiple
                accept=".pdf,.jpg,.jpeg,.png,.heic,.heif"
                disabled={!pendingCategory || isUploading}
                onChange={e => handleFileUpload(e.target.files)}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                disabled={!pendingCategory || isUploading}
                onClick={() => {
                  if (!pendingCategory) {
                    setCategoryError('Please select a document category before uploading.');
                    return;
                  }
                  fileInputRef.current?.click();
                }}
                style={{
                  width: '100%', padding: '20px', borderRadius: '12px', fontSize: '14px', fontWeight: 600,
                  border: `2px dashed ${(pendingCategory && !isUploading) ? color : '#E5E7EB'}`,
                  backgroundColor: (pendingCategory && !isUploading) ? light : '#F9FAFB',
                  color: (pendingCategory && !isUploading) ? color : '#9CA3AF',
                  cursor: (pendingCategory && !isUploading) ? 'pointer' : 'not-allowed',
                  fontFamily: 'inherit', transition: 'all 0.2s',
                }}
              >
                {isUploading
                  ? '⏳ Uploading, please wait…'
                  : pendingCategory
                    ? '📁 Choose File(s) to Upload'
                    : '← Select a category above first'
                }
              </button>
              <FieldHint>Accepted: PDF, JPG, PNG, HEIC · Max 20 MB per file.</FieldHint>
              {/* Only show upload errors here — validation errors (e.g. "at least one required")
                  are shown in the top error banner and NOT duplicated here */}
              {errors.docs && errors.docs !== 'At least one document is required' && (
                <FieldError msg={errors.docs} />
              )}
            </div>

          </div>
        );
      }

      // ── STEP 6: Review & Submit ──────────────────────────────────────────
      case 6: return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '16px 18px' }}>
            <p style={{ fontSize: '13px', color: '#065F46', margin: 0 }}>🎉 Almost there! Review your information below before submitting. Click <strong>Edit</strong> on any section to make changes.</p>
          </div>

          {/* Summary cards */}
          {[
            {
              n: 1, title: 'Basic Info', color: STEP_COLORS[0],
              rows: [
                ['Full Name', basicInfo.full_legal_name],
                ['Business Name', basicInfo.business_name || '—'],
                ['Email', basicInfo.email],
                ['Phone', basicInfo.phone],
                ['City', basicInfo.city],
                ['Address', basicInfo.address_line1 || '—'],
                ['Postal Code', basicInfo.postal_code || '—'],
              ]
            },
            {
              n: 2, title: 'Services & Coverage', color: STEP_COLORS[1],
              rows: [
                ['Category', services.primary_category],
                ['Sub-Services', services.sub_services.join(', ') || '—'],
                ['Service Areas', services.service_areas.join(', ') || '—'],
                ['Has Vehicle', services.has_vehicle || '—'],
                ['Max Travel (km)', services.max_travel_km || '—'],
              ]
            },
            {
              n: 3, title: 'Experience & Standards', color: STEP_COLORS[2],
              rows: [
                ['Years Experience', experience.years_experience],
                ['Bio', experience.professional_bio ? experience.professional_bio.slice(0, 80) + '…' : '—'],
                ['Team Size', experience.team_size],
                ['Licensed', experience.is_licensed],
                ['Insured', experience.is_insured],
                ['Background Check', experience.background_check],
              ]
            },
            {
              n: 4, title: 'Availability', color: STEP_COLORS[3],
              rows: [
                ['Availability', pricing.availability.join(', ') || '—'],
                ['Start Date', pricing.earliest_start || '—'],
                ['Scheduling Notes', pricing.scheduling_notes || '—'],
              ]
            },
            {
              n: 5, title: 'Documents', color: STEP_COLORS[4],
              rows: docs.filter(d => d.status === 'done').map(d => [
                DOC_CATEGORIES.find(c => c.value === d.category)?.label ?? d.category,
                d.file_name,
              ]),
            },
          ].map(section => (
            <div key={section.n} style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #EEEFF1', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #F3F4F6', backgroundColor: '#FAFAFA' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: section.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff' }}>{section.n}</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#111111' }}>{section.title}</span>
                </div>
                <button type="button" onClick={() => { setErrors({}); setStep(section.n); window.scrollTo({ top: 0, behavior: 'smooth' }); }} style={{ padding: '5px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, color: section.color, border: `1px solid ${section.color}20`, backgroundColor: STEP_LIGHTS[section.n - 1], cursor: 'pointer', fontFamily: 'inherit' }}>
                  Edit
                </button>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {section.rows.map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', gap: '12px', fontSize: '13px' }}>
                    <span style={{ color: '#9CA3AF', minWidth: '140px', flexShrink: 0 }}>{k}</span>
                    <span style={{ color: '#111111', fontWeight: 500, wordBreak: 'break-word' }}>{v || '—'}</span>
                  </div>
                ))}
                {section.rows.length === 0 && <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>No entries yet.</p>}
              </div>
            </div>
          ))}

          {/* Consent */}
          <div style={{ backgroundColor: '#F8F9FC', borderRadius: '12px', padding: '20px', border: '1px solid #EEEFF1' }}>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: 0, lineHeight: 1.7 }}>
              By submitting this application, you confirm that all information provided is accurate and complete to the best of your knowledge. Providing false information may result in permanent disqualification.
            </p>
          </div>

          {submitError && (
            <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '16px' }}>
              <p style={{ fontSize: '13px', color: '#DC2626', margin: 0 }}>⚠️ {submitError}</p>
            </div>
          )}
          <button type="button" onClick={handleSubmit} disabled={isSubmitting} style={{
            width: '100%', padding: '16px', borderRadius: '12px', backgroundColor: '#111111', color: '#ffffff',
            fontSize: '16px', fontWeight: 700, border: 'none', cursor: isSubmitting ? 'not-allowed' : 'pointer',
            opacity: isSubmitting ? 0.7 : 1, fontFamily: 'inherit',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          }}>
            {isSubmitting ? '⏳ Submitting…' : '🚀 Submit Application'}
          </button>
        </div>
      );

      default: return null;
    }
  }

  // ─── Main render ──────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes progress-slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }
        * { box-sizing: border-box; }
        .mobile-cta { display: none; }
        @media (max-width: 768px) {
          .apply-grid { grid-template-columns: 1fr !important; }
          .apply-sidebar { display: none !important; }
          .mobile-cta { display: block !important; }
        }
        @media (max-width: 640px) {
          .apply-submitted-card { padding: 36px 20px !important; border-radius: 16px !important; }
          .apply-landing-hero   { padding: 110px 16px 60px !important; }
          .apply-landing-cta-row { flex-direction: column !important; align-items: stretch !important; }
          .apply-landing-cta-row a,
          .apply-landing-cta-row button { text-align: center; justify-content: center; }
        }
      `}</style>

      <main style={{
        minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px',
        background: 'linear-gradient(135deg,#F0F6FF 0%,#F5F0FF 40%,#F0FFF8 80%,#FFFBF0 100%)',
        fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,sans-serif",
        position: 'relative',
      }}>
        {/* Blobs */}
        <div style={{ position: 'fixed', top: '-120px', right: '-120px', width: '480px', height: '480px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(47,128,237,0.08) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
        <div style={{ position: 'fixed', bottom: '-80px', left: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,58,237,0.07) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>

          {/* ── Top progress bar ── */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #EEEFF1', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 16px rgba(0,0,0,0.04)' }}>
            {/* % bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#111111' }}>Application Progress</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {saveStatus === 'saving' && <span style={{ fontSize: '11px', color: '#9CA3AF' }}>● Saving…</span>}
                {saveStatus === 'saved' && <span style={{ fontSize: '11px', color: '#059669' }}>✓ Saved</span>}
                {saveStatus === 'error' && <span style={{ fontSize: '11px', color: '#DC2626' }}>⚠ Save error</span>}
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#111111' }}>{pct}%</span>
              </div>
            </div>
            <div style={{ height: '6px', backgroundColor: '#F0F0F0', borderRadius: '100px', overflow: 'hidden', marginBottom: '18px' }}>
              <div style={{ height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: '100px', transition: 'width 0.6s ease' }} />
            </div>
            {/* Step dots */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {STEPS.map((s, i) => {
                const done = stepsCompleted[s.n];
                const active = step === s.n;
                const c = STEP_COLORS[i];
                return (
                  <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : undefined }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0,
                        backgroundColor: done ? c : (active ? c : '#F3F4F6'),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: active ? `0 4px 12px ${c}44` : 'none', transition: 'all 0.3s',
                      }}>
                        {done
                          ? <svg width="14" height="14" viewBox="0 0 16 16"><path d="M3 8l4 4 6-6" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
                          : <span style={{ fontSize: '12px', fontWeight: 800, color: active ? '#fff' : '#9CA3AF' }}>{s.n}</span>
                        }
                      </div>
                      <span className="hidden lg:block" style={{ fontSize: '12px', fontWeight: active ? 700 : 400, color: active ? '#111111' : '#9CA3AF', whiteSpace: 'nowrap' }}>
                        {s.title}
                      </span>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div style={{ flex: 1, height: '2px', margin: '0 8px', backgroundColor: '#F0F0F0', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', backgroundColor: c, width: done ? '100%' : '0%', transition: 'width 0.6s ease' }} />
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
            <div className="apply-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'sticky', top: '110px' }}>
              {/* Step card */}
              <div style={{ backgroundColor: color, borderRadius: '18px', padding: '24px', color: '#ffffff', boxShadow: `0 10px 32px ${color}44` }}>
                <div style={{ fontSize: '36px', marginBottom: '12px' }}>{STEPS[step - 1].icon}</div>
                <div style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '4px' }}>Step {step} of 6</div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', margin: '0 0 10px' }}>{STEPS[step - 1].title}</h2>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: 0 }}>{STEPS[step - 1].hint}</p>
              </div>

              {/* All steps list */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', border: '1px solid #EEEFF1', padding: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
                {STEPS.map((s, i) => {
                  const done = !!stepsCompleted[s.n];
                  const active = step === s.n;
                  const c = STEP_COLORS[i];
                  return (
                    <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < STEPS.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '7px', backgroundColor: done ? c : (active ? c : '#F3F4F6'), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {done
                          ? <svg width="11" height="11" viewBox="0 0 16 16"><path d="M3 8l4 4 6-6" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg>
                          : <span style={{ fontSize: '10px', fontWeight: 800, color: active ? '#fff' : '#9CA3AF' }}>{s.n}</span>
                        }
                      </div>
                      <span style={{ fontSize: '12px', fontWeight: active ? 700 : 400, color: active ? '#111111' : done ? '#6B7280' : '#9CA3AF' }}>
                        {s.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Form card ── */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', border: '1px solid #EEEFF1', overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,0.05)' }}>
              {/* Coloured top strip */}
              <div style={{ height: '4px', backgroundColor: color }} />

              <div style={{ padding: '32px' }}>
                {/* Step header */}
                <div style={{ marginBottom: '28px' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: light, borderRadius: '100px', padding: '5px 14px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Step {step} of 6</span>
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#111111', margin: '0 0 6px', letterSpacing: '-0.02em' }}>{STEPS[step - 1].title}</h3>
                  <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>{STEPS[step - 1].hint}</p>
                </div>

                {/* Error banner */}
                {Object.keys(errors).length > 0 && (
                  <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '16px', flexShrink: 0 }}>⚠</span>
                    <div>
                      <p style={{ fontSize: '13px', fontWeight: 700, color: '#DC2626', margin: '0 0 4px' }}>Please fix the following:</p>
                      <ul style={{ margin: 0, paddingLeft: '16px' }}>
                        {Object.values(errors).map((msg, i) => <li key={i} style={{ fontSize: '12px', color: '#B91C1C', lineHeight: 1.6 }}>{msg}</li>)}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Step form fields */}
                {renderStep()}

                {/* ── Nav buttons ── */}
                {step < 6 && (
                  <div style={{ display: 'flex', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #F3F4F6' }}>
                    {step > 1 && (
                      <button type="button" onClick={goBack} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '13px 22px', borderRadius: '12px', border: '1.5px solid #E5E7EB',
                        backgroundColor: '#ffffff', color: '#6B7280', fontSize: '14px', fontWeight: 600,
                        cursor: 'pointer', fontFamily: 'inherit',
                      }}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Back
                      </button>
                    )}
                    <button type="button" onClick={goNext} disabled={authLoading || isUploading || (step === 5 && docs.filter(d => d.status === 'done').length === 0)} style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                      padding: '13px 22px', borderRadius: '12px', border: 'none',
                      backgroundColor: (step === 5 && docs.filter(d => d.status === 'done').length === 0) ? '#E5E7EB' : color,
                      color: (step === 5 && docs.filter(d => d.status === 'done').length === 0) ? '#9CA3AF' : '#ffffff',
                      fontSize: '14px', fontWeight: 700,
                      cursor: (authLoading || isUploading || (step === 5 && docs.filter(d => d.status === 'done').length === 0)) ? 'not-allowed' : 'pointer',
                      fontFamily: 'inherit',
                      boxShadow: (step === 5 && docs.filter(d => d.status === 'done').length === 0) ? 'none' : `0 4px 14px ${color}44`,
                      opacity: (authLoading || isUploading) ? 0.75 : 1,
                    }}>
                      {authLoading
                        ? '⏳ Creating account…'
                        : isUploading
                          ? '⏳ Upload in progress…'
                          : step === 1 && !userId
                            ? 'Create Account & Continue'
                            : step === 5 ? 'Review Application' : 'Save & Continue'}
                      {!authLoading && !isUploading && <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </button>
                  </div>
                )}

                {/* Mobile sticky CTA (Step 6 handled inline) */}
              </div>
            </div>
          </div>

          {/* Mobile sticky bottom bar */}
          {step < 6 && (
            <div style={{
              position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
              padding: '12px 16px', backgroundColor: '#ffffff', borderTop: '1px solid #EEEFF1',
              boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
            }} className="mobile-cta">
              <button type="button" onClick={goNext} disabled={authLoading || isUploading || (step === 5 && docs.filter(d => d.status === 'done').length === 0)} style={{
                width: '100%', padding: '15px', borderRadius: '12px',
                backgroundColor: (step === 5 && docs.filter(d => d.status === 'done').length === 0) ? '#E5E7EB' : color,
                color: (step === 5 && docs.filter(d => d.status === 'done').length === 0) ? '#9CA3AF' : '#ffffff',
                fontSize: '16px', fontWeight: 700, border: 'none',
                cursor: (authLoading || isUploading || (step === 5 && docs.filter(d => d.status === 'done').length === 0)) ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit',
                opacity: (authLoading || isUploading) ? 0.75 : 1,
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
