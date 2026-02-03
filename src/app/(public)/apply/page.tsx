'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AVAILABLE_SERVICES } from '@/lib/constants';
import { toast } from 'sonner';

const applicationSchema = z.object({
  // Account Credentials - Step 0
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  password_confirm: z.string().min(8, 'Please confirm your password'),
  
  // Identity - Step 0
  first_name: z.string().min(2, 'First name required'),
  last_name: z.string().min(2, 'Last name required'),
  display_name: z.string().optional(),
  date_of_birth: z.string().min(1, 'Date of birth required'),
  id_type: z.string().min(1, 'ID type required'),
  id_number: z.string().min(1, 'ID number required'),
  id_expiry: z.string().min(1, 'ID expiry required'),
  id_document_front: z.string().optional(), // File upload URL
  id_document_back: z.string().optional(), // File upload URL
  proof_of_address: z.string().optional(), // File upload URL
  
  // Contact - Step 1
  email: z.string().optional(),
  phone: z.string().optional(),
  secondary_phone: z.string().optional(),
  preferred_contact: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  emergency_contact_relationship: z.string().optional(),
  
  // Address - Step 1
  street_address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  
  // Work Eligibility - Step 2
  can_work_canada: z.boolean().optional(),
  work_status: z.string().optional(),
  sin_number: z.string().optional(),
  work_permit_document: z.string().optional(), // File upload URL
  work_permit_expiry: z.string().optional(),
  
  // Business - Step 2
  provider_type: z.string().optional(),
  business_name: z.string().optional(),
  business_number: z.string().optional(),
  gst_registered: z.boolean().optional(),
  gst_number: z.string().optional(),
  trade_name: z.string().optional(),
  business_registration_document: z.string().optional(), // File upload URL
  incorporation_date: z.string().optional(),
  
  // Services - Step 3
  services: z.array(z.string()).optional(),
  experience_years: z.number().optional(),
  languages: z.array(z.string()).optional(),
  professional_bio: z.string().optional(),
  certifications: z.array(z.string()).optional(),
  certification_documents: z.array(z.string()).optional(), // File uploads
  trade_licenses: z.array(z.string()).optional(),
  trade_license_documents: z.array(z.string()).optional(), // File uploads
  portfolio_images: z.array(z.string()).optional(), // File uploads
  portfolio_description: z.string().optional(),
  specializations: z.array(z.string()).optional(),
  
  // Availability - Step 3
  availability_days: z.array(z.string()).optional(),
  availability_hours: z.string().optional(),
  same_day_jobs: z.boolean().optional(),
  emergency_jobs: z.boolean().optional(),
  response_time: z.string().optional(), // Within 1hr, 2-4hrs, Same day, etc.
  travel_radius: z.string().optional(),
  service_areas: z.array(z.string()).optional(), // Specific neighborhoods/cities
  own_transportation: z.boolean().optional(),
  vehicle_type: z.string().optional(),
  drivers_license: z.boolean().optional(),
  drivers_license_number: z.string().optional(),
  drivers_license_expiry: z.string().optional(),
  
  // Pricing - Step 3
  hourly_rate_min: z.number().optional(),
  hourly_rate_max: z.number().optional(),
  minimum_job_value: z.number().optional(),
  platform_pricing: z.boolean().optional(),
  weekend_premium: z.boolean().optional(),
  evening_premium: z.boolean().optional(),
  emergency_rate_multiplier: z.number().optional(),
  payment_terms: z.string().optional(),
  
  // Insurance - Step 3
  has_insurance: z.boolean().optional(),
  insurance_provider: z.string().optional(),
  coverage_amount: z.string().optional(),
  insurance_expiry: z.string().optional(),
  insurance_certificate: z.string().optional(), // File upload URL
  insurance_policy_number: z.string().optional(),
  wcb_coverage: z.boolean().optional(),
  wcb_number: z.string().optional(),
  
  // Background Check - Step 3
  background_check_consent: z.boolean().optional(),
  criminal_record: z.boolean().optional(),
  
  // References - Step 3
  reference1_name: z.string().optional(),
  reference1_phone: z.string().optional(),
  reference1_email: z.string().optional(),
  reference1_relationship: z.string().optional(),
  reference1_years_known: z.number().optional(),
  reference2_name: z.string().optional(),
  reference2_phone: z.string().optional(),
  reference2_email: z.string().optional(),
  reference2_relationship: z.string().optional(),
  reference2_years_known: z.number().optional(),
  reference3_name: z.string().optional(),
  reference3_phone: z.string().optional(),
  reference3_email: z.string().optional(),
  reference3_relationship: z.string().optional(),
  reference3_years_known: z.number().optional(),
  
  // Banking
  bank_account_name: z.string().optional(),
  bank_name: z.string().optional(),
  account_type: z.string().optional(),
  transit_number: z.string().optional(),
  institution_number: z.string().optional(),
  account_number: z.string().optional(),
  void_cheque_document: z.string().optional(), // File upload URL
  payout_frequency: z.string().optional(),
  direct_deposit_confirmed: z.boolean().optional(),
  
  // Technology - Step 3
  smartphone_type: z.string().optional(),
  app_comfortable: z.boolean().optional(),
  internet_reliability: z.number().optional(),
  computer_access: z.boolean().optional(),
  tech_savviness: z.string().optional(), // Beginner, Intermediate, Advanced
  online_platform_experience: z.array(z.string()).optional(),
  
  // Agreements - Step 3
  terms_accepted: z.boolean().optional(),
  privacy_accepted: z.boolean().optional(),
  signature: z.string().optional(),
}).refine(data => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ['password_confirm'],
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export default function Apply() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    mode: 'onChange',
    defaultValues: {
      country: 'Canada',
      province: 'British Columbia',
      can_work_canada: true,
      preferred_contact: 'sms',
      same_day_jobs: false,
      emergency_jobs: false,
      platform_pricing: true,
      gst_registered: false,
      own_transportation: true,
      drivers_license: true,
      app_comfortable: true,
      internet_reliability: 4,
      services: [],
      languages: [],
      availability_days: [],
    }
  });

  const steps = [
    { id: 1, title: 'Account & Identity', icon: '👤', color: 'from-blue-500 to-cyan-500', description: 'Create your login' },
    { id: 2, title: 'Contact & Address', icon: '📍', color: 'from-violet-500 to-purple-500', description: 'Where to reach you' },
    { id: 3, title: 'Work & Business', icon: '📋', color: 'from-emerald-500 to-teal-500', description: 'Legal authorization' },
    { id: 4, title: 'Services & Verification', icon: '🚀', color: 'from-purple-600 to-indigo-600', description: 'Complete profile' },
  ];

  const onSubmit = async (data: ApplicationFormData) => {
    // Validate current step before proceeding
    let isStepValid = true;
    let errorMessage = '';
    
    if (currentStep === 0) {
      // Validate Step 0 fields (account credentials and identity)
      const username = watch('username');
      const password = watch('password');
      const passwordConfirm = watch('password_confirm');
      const firstName = watch('first_name');
      const lastName = watch('last_name');
      const dob = watch('date_of_birth');
      const idType = watch('id_type');
      const idNumber = watch('id_number');
      const idExpiry = watch('id_expiry');
      
      if (!username || username.length < 3) {
        errorMessage = 'Username must be at least 3 characters';
        isStepValid = false;
      } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        errorMessage = 'Username can only contain letters, numbers, and underscores';
        isStepValid = false;
      } else if (!password || password.length < 8) {
        errorMessage = 'Password must be at least 8 characters';
        isStepValid = false;
      } else if (!passwordConfirm || password !== passwordConfirm) {
        errorMessage = "Passwords don't match";
        isStepValid = false;
      } else if (!firstName || firstName.length < 2) {
        errorMessage = 'First name is required';
        isStepValid = false;
      } else if (!lastName || lastName.length < 2) {
        errorMessage = 'Last name is required';
        isStepValid = false;
      } else if (!dob) {
        errorMessage = 'Date of birth is required';
        isStepValid = false;
      } else if (!idType) {
        errorMessage = 'ID type is required';
        isStepValid = false;
      } else if (!idNumber) {
        errorMessage = 'ID number is required';
        isStepValid = false;
      } else if (!idExpiry) {
        errorMessage = 'ID expiry date is required';
        isStepValid = false;
      }
      
    } else if (currentStep === 1) {
      // Validate Step 1 fields
      const email = watch('email');
      const phone = watch('phone');
      const address = watch('street_address');
      const city = watch('city');
      const province = watch('province');
      const postal = watch('postal_code');
      
      if (!email || !email.includes('@')) {
        errorMessage = 'Valid email is required';
        isStepValid = false;
      } else if (!phone || phone.length < 10) {
        errorMessage = 'Valid phone number is required';
        isStepValid = false;
      } else if (!address || address.length < 5) {
        errorMessage = 'Street address is required';
        isStepValid = false;
      } else if (!city || city.length < 2) {
        errorMessage = 'City is required';
        isStepValid = false;
      } else if (!province || province.length < 2) {
        errorMessage = 'Province is required';
        isStepValid = false;
      } else if (!postal || postal.length < 6) {
        errorMessage = 'Postal code is required';
        isStepValid = false;
      }
      
    } else if (currentStep === 2) {
      // Validate Step 2 fields
      const workStatus = watch('work_status');
      const providerType = watch('provider_type');
      
      if (!workStatus) {
        errorMessage = 'Work status is required';
        isStepValid = false;
      } else if (!providerType) {
        errorMessage = 'Provider type is required';
        isStepValid = false;
      }
    }
    
    if (!isStepValid) {
      toast.error(errorMessage || 'Please complete all required fields correctly');
      return; // Don't proceed if validation fails
    }
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Final submission - validate Step 3 critical fields
    const services = watch('services');
    const experienceYears = watch('experience_years');
    const availabilityDays = watch('availability_days');
    const availabilityHours = watch('availability_hours');
    const travelRadius = watch('travel_radius');
    const smartphoneType = watch('smartphone_type');
    const backgroundConsent = watch('background_check_consent');
    const termsAccepted = watch('terms_accepted');
    const privacyAccepted = watch('privacy_accepted');
    const signature = watch('signature');
    
    if (!services || services.length === 0) {
      toast.error('Please select at least one service');
      return;
    }
    if (experienceYears === undefined || experienceYears === null) {
      toast.error('Please enter your years of experience');
      return;
    }
    if (!availabilityDays || availabilityDays.length === 0) {
      toast.error('Please select at least one day of availability');
      return;
    }
    if (!availabilityHours) {
      toast.error('Please select your preferred hours');
      return;
    }
    if (!travelRadius) {
      toast.error('Please select your travel radius');
      return;
    }
    if (!smartphoneType) {
      toast.error('Please select your smartphone type');
      return;
    }
    if (!backgroundConsent) {
      toast.error('Background check consent is required');
      return;
    }
    if (!termsAccepted) {
      toast.error('You must accept the terms and conditions');
      return;
    }
    if (!privacyAccepted) {
      toast.error('You must accept the privacy policy');
      return;
    }
    if (!signature) {
      toast.error('Signature is required');
      return;
    }

    setIsLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from('provider_applications').insert([
      {
        user_id: user?.id || null,
        application_data: data,
        status: 'submitted',
      },
    ]);

    if (error) {
      toast.error('Failed to submit application');
      setIsLoading(false);
      return;
    }

    toast.success('Application submitted successfully!');
    router.push('/apply/success');
  };

  const handleServiceToggle = (service: string) => {
    const updated = selectedServices.includes(service)
      ? selectedServices.filter((s) => s !== service)
      : [...selectedServices, service];
    setSelectedServices(updated);
    setValue('services', updated);
  };

  const handleDayToggle = (day: string) => {
    const updated = selectedDays.includes(day)
      ? selectedDays.filter((d) => d !== day)
      : [...selectedDays, day];
    setSelectedDays(updated);
    setValue('availability_days', updated);
  };

  const handleLanguageToggle = (language: string) => {
    const updated = selectedLanguages.includes(language)
      ? selectedLanguages.filter((l) => l !== language)
      : [...selectedLanguages, language];
    setSelectedLanguages(updated);
    setValue('languages', updated);
  };

  const goBack = (e?: React.MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault();
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (!showForm) {
    return (
      <>
        <div className="relative">
          <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 z-0"></div>
          <Navbar variant="dark" />
        </div>

        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 -mt-20 pt-20">
          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
              <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
              <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full">
              <div className="text-center max-w-4xl mx-auto space-y-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-full animate-pulse">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span className="text-white text-sm font-semibold">Join 5,000+ Successful Professionals</span>
                </div>

                {/* Main Headline */}
                <div className="space-y-6">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1]">
                    Your Journey to
                    <br />
                    <span className="relative inline-block">
                      <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Financial Freedom
                      </span>
                      <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 10C50 2 100 2 150 6C200 10 250 10 298 6" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#60A5FA" />
                            <stop offset="50%" stopColor="#A78BFA" />
                            <stop offset="100%" stopColor="#F472B6" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </span>
                    <br />
                    Starts Here
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                    Take the first step towards earning on your terms. Quick application, fast approval, higher earnings.
                  </p>
                </div>

                {/* Start Button */}
                <div className="pt-8">
                  <button
                    onClick={() => setShowForm(true)}
                    className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-black text-xl rounded-2xl shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center gap-3">
                      <span>Start Application</span>
                      <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </button>
                  <p className="mt-6 text-gray-400 text-sm">✓ Only takes 10 minutes  ✓ No upfront costs  ✓ 98% approval rate</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-4xl mx-auto">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                    <div className="text-4xl mb-3">⚡</div>
                    <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">10 min</div>
                    <div className="text-sm text-gray-400">Application Time</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                    <div className="text-4xl mb-3">🚀</div>
                    <div className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">3-5 days</div>
                    <div className="text-sm text-gray-400">Approval Process</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                    <div className="text-4xl mb-3">💰</div>
                    <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent mb-2">$7.2K</div>
                    <div className="text-sm text-gray-400">Average Monthly</div>
                  </div>
                </div>

                {/* What to Expect - Redesigned */}
                <div className="pt-16 max-w-5xl mx-auto">
                  <div className="text-center mb-12">
                    <h3 className="text-3xl font-black text-white mb-4">Your Application Journey</h3>
                    <p className="text-gray-400">4 simple steps to start earning</p>
                  </div>
                  
                  <div className="relative">
                    {/* Connecting Line */}
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 via-emerald-500 to-orange-500 opacity-20"></div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
                      {steps.map((step, index) => (
                        <div key={step.id} className="relative">
                          {/* Card */}
                          <div className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 h-full flex flex-col">
                            {/* Step Number Badge */}
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-lg">
                              <span className="text-white font-black text-lg">{step.id}</span>
                            </div>
                            
                            {/* Icon with Glow */}
                            <div className="relative mb-6">
                              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} rounded-2xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`}></div>
                              <div className={`relative w-20 h-20 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-4xl shadow-lg transform group-hover:rotate-6 transition-transform duration-500`}>
                                {step.icon}
                              </div>
                            </div>
                            
                            {/* Title */}
                            <h4 className="text-white font-bold text-lg mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                              {step.title}
                            </h4>
                            
                            {/* Description */}
                            <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-grow">
                              {index === 0 && "Share your contact details and location"}
                              {index === 1 && "Select services and experience level"}
                              {index === 2 && "Set your schedule and travel radius"}
                              {index === 3 && "Verify insurance and background check"}
                            </p>
                            
                            {/* Progress Indicator */}
                            <div className="flex gap-1.5 mb-4">
                              {[...Array(4)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                                    i <= index
                                      ? `bg-gradient-to-r ${step.color}`
                                      : 'bg-white/10'
                                  }`}
                                ></div>
                              ))}
                            </div>
                            
                            {/* Time Estimate */}
                            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                              <span className="text-xs text-gray-500 font-medium">~2-3 min</span>
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${step.color} animate-pulse`}></div>
                            </div>
                          </div>
                          
                          {/* Arrow Between Steps */}
                          {index < steps.length - 1 && (
                            <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                              <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Bottom Stats */}
                  <div className="mt-12 flex items-center justify-center gap-8 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>10 min total</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Save & resume anytime</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Mobile friendly</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="relative">
        <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 z-0"></div>
        <Navbar variant="dark" />
      </div>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-24 px-6 pt-40">
        <div className="max-w-7xl mx-auto">
          {/* Compact Progress Tracker */}
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6">
              <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex items-center flex-1 last:flex-initial">
                    <div className="flex items-center gap-3">
                      <div
                        className={`relative w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black transition-all duration-500 ${
                          currentStep >= index
                            ? `bg-gradient-to-br ${step.color} text-white shadow-lg`
                            : currentStep === index - 1
                            ? 'bg-gray-200 text-gray-500 animate-pulse'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {currentStep > index ? (
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </div>
                      <div className="hidden lg:block">
                        <div className={`text-sm font-bold ${currentStep >= index ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.title}
                        </div>
                        <div className="text-xs text-gray-500">{step.icon}</div>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="flex-1 h-0.5 mx-3 bg-gray-200 relative overflow-hidden">
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${step.color} transition-all duration-700 ${
                            currentStep > index ? 'w-full' : 'w-0'
                          }`}
                        ></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Split Layout - Sidebar + Form */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Sidebar - Current Step Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Current Step Card */}
              <div className={`bg-gradient-to-br ${steps[currentStep].color} rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition-all duration-500`}>
                <div className="text-6xl mb-6">{steps[currentStep].icon}</div>
                <h2 className="text-3xl font-black mb-3">{steps[currentStep].title}</h2>
                <p className="text-white/80 text-sm mb-6">
                  {currentStep === 0 && "Create your login credentials and provide your identity details. Save your username and password!"}
                  {currentStep === 1 && "Tell us how to reach you. We'll use this information to contact you about jobs."}
                  {currentStep === 2 && "Share your work authorization and business details to ensure legal compliance."}
                  {currentStep === 3 && "Almost done! Complete your profile with services, availability, and verification."}
                </p>
                <div className="flex items-center gap-2 text-white/90 text-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">~2 min to complete</span>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💡</span>
                  </div>
                  <h3 className="font-black text-gray-900">Quick Tip</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {currentStep === 0 && "Write down your username and password! You'll need these to sign in after your application is approved."}
                  {currentStep === 1 && "Select all services you can provide. More services = more job opportunities!"}
                  {currentStep === 2 && "Flexible availability increases your chances of getting more bookings."}
                  {currentStep === 3 && "Having insurance shows professionalism and can help you earn more trust."}
                </p>
              </div>

              {/* Progress Stats */}
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/50">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold text-gray-900">Application Progress</span>
                      <span className="font-black text-gray-900">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${steps[currentStep].color} transition-all duration-700`}
                        style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-2xl font-black text-gray-900">{currentStep + 1}/{steps.length}</div>
                      <div className="text-xs text-gray-500">Steps Done</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-gray-900">{(steps.length - currentStep - 1) * 2}</div>
                      <div className="text-xs text-gray-500">Min Left</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                {/* Animated Top Bar */}
                <div className="relative h-3 bg-gray-100 overflow-hidden">
                  <div
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${steps[currentStep].color} transition-all duration-700`}
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
                
                <div className="p-8 md:p-12">
                  {/* Step Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-4 py-1.5 rounded-full text-xs font-black bg-gradient-to-r ${steps[currentStep].color} text-white`}>
                        STEP {currentStep + 1}
                      </span>
                      <span className="text-sm text-gray-500 font-medium">of {steps.length}</span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-2">{steps[currentStep].title}</h3>
                    <p className="text-gray-600 text-sm">{steps[currentStep].description}</p>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 0: Account Credentials & Identity */}
                {currentStep === 0 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl p-6 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-1">Create Your Login Credentials</h4>
                          <p className="text-blue-100 text-sm">Choose a username and secure password. You'll use these to sign in after approval.</p>
                          <p className="text-yellow-200 text-xs mt-2 font-semibold">⚠️ Important: Save your username and password - you'll need them to access your account!</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        id="username"
                        label="Username (for sign-in)"
                        placeholder="johndoe123"
                        {...register('username')}
                        error={errors.username?.message}
                      />
                      <div></div>
                      <Input
                        id="password"
                        label="Password (min 8 characters)"
                        type="password"
                        placeholder="••••••••"
                        {...register('password')}
                        error={errors.password?.message}
                      />
                      <Input
                        id="password_confirm"
                        label="Confirm Password"
                        type="password"
                        placeholder="••••••••"
                        {...register('password_confirm')}
                        error={errors.password_confirm?.message}
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 my-6">
                      <h4 className="font-bold text-gray-900 mb-2">Basic Identity</h4>
                      <p className="text-sm text-gray-600">Provide your legal name and identification details</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        id="first_name"
                        label="Legal First Name"
                        placeholder="John"
                        {...register('first_name')}
                        error={errors.first_name?.message}
                      />
                      <Input
                        id="last_name"
                        label="Legal Last Name"
                        placeholder="Doe"
                        {...register('last_name')}
                        error={errors.last_name?.message}
                      />
                      <Input
                        id="display_name"
                        label="Preferred Display Name (Optional)"
                        placeholder="Johnny"
                        {...register('display_name')}
                      />
                      <Input
                        id="date_of_birth"
                        label="Date of Birth (18+ required)"
                        type="date"
                        {...register('date_of_birth')}
                        error={errors.date_of_birth?.message}
                      />
                      <Select
                        id="id_type"
                        label="Government ID Type"
                        options={[
                          { value: 'drivers_license', label: 'Driver\'s License' },
                          { value: 'passport', label: 'Passport' },
                          { value: 'pr_card', label: 'PR Card' },
                        ]}
                        {...register('id_type')}
                        error={errors.id_type?.message}
                      />
                      <Input
                        id="id_number"
                        label="Government ID Number"
                        placeholder="ID Number"
                        {...register('id_number')}
                        error={errors.id_number?.message}
                      />
                      <Input
                        id="id_expiry"
                        label="ID Expiry Date"
                        type="date"
                        {...register('id_expiry')}
                        error={errors.id_expiry?.message}
                      />
                    </div>
                    
                    {/* Document Uploads */}
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-6 mt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Document Uploads (Optional Now)</h4>
                          <p className="text-sm text-gray-600">You can upload these now or later in your dashboard</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            <div className="text-left">
                              <p className="text-sm font-semibold text-gray-900">ID Front</p>
                              <p className="text-xs text-gray-500">Upload later</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors cursor-pointer">
                          <div className="flex items-center gap-3">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            <div className="text-left">
                              <p className="text-sm font-semibold text-gray-900">ID Back</p>
                              <p className="text-xs text-gray-500">Upload later</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors cursor-pointer md:col-span-2">
                          <div className="flex items-center gap-3">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <div className="text-left">
                              <p className="text-sm font-semibold text-gray-900">Proof of Address</p>
                              <p className="text-xs text-gray-500">Utility bill, lease agreement - Upload later</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
                      <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-blue-900">
                        <span className="font-semibold">Privacy Protected:</span> All personal information is encrypted and stored securely. Document uploads will be available in your dashboard after this initial application.
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Contact & Address */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-6">
                      <h4 className="font-bold text-gray-900 mb-2">Contact Details</h4>
                      <p className="text-sm text-gray-600">How customers and our team can reach you</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <Input
                        id="email"
                        label="Primary Email Address"
                        type="email"
                        placeholder="you@example.com"
                        {...register('email')}
                        error={errors.email?.message}
                      />
                      <Input
                        id="phone"
                        label="Mobile Phone Number"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        {...register('phone')}
                        error={errors.phone?.message}
                      />
                      <Input
                        id="secondary_phone"
                        label="Secondary Phone (Optional)"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        {...register('secondary_phone')}
                      />
                      <Select
                        id="preferred_contact"
                        label="Preferred Contact Method"
                        options={[
                          { value: 'sms', label: 'SMS Text Message' },
                          { value: 'email', label: 'Email' },
                          { value: 'app', label: 'In-App Notification' },
                        ]}
                        {...register('preferred_contact')}
                      />
                    </div>

                    {/* Emergency Contact */}
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-6 mt-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">Emergency Contact</h4>
                          <p className="text-sm text-gray-600">Someone we can reach in case of emergency</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <Input
                          id="emergency_contact_name"
                          label="Full Name"
                          placeholder="Jane Doe"
                          {...register('emergency_contact_name')}
                        />
                        <Input
                          id="emergency_contact_phone"
                          label="Phone Number"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          {...register('emergency_contact_phone')}
                        />
                        <Input
                          id="emergency_contact_relationship"
                          label="Relationship"
                          placeholder="e.g., Spouse, Parent, Sibling"
                          {...register('emergency_contact_relationship')}
                        />
                      </div>
                    </div>

                    <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mt-6 mb-4">
                      <h4 className="font-bold text-gray-900 mb-2">Residential Address</h4>
                      <p className="text-sm text-gray-600">Your primary service location</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <Input
                          id="street_address"
                          label="Street Address"
                          placeholder="123 Main Street, Unit 4"
                          {...register('street_address')}
                          error={errors.street_address?.message}
                        />
                      </div>
                      <Input
                        id="city"
                        label="City"
                        placeholder="Vancouver"
                        {...register('city')}
                        error={errors.city?.message}
                      />
                      <Select
                        id="province"
                        label="Province"
                        options={[
                          { value: 'British Columbia', label: 'British Columbia' },
                          { value: 'Alberta', label: 'Alberta' },
                          { value: 'Ontario', label: 'Ontario' },
                          { value: 'Quebec', label: 'Quebec' },
                        ]}
                        {...register('province')}
                        error={errors.province?.message}
                      />
                      <Input
                        id="postal_code"
                        label="Postal Code"
                        placeholder="V6B 1A1"
                        {...register('postal_code')}
                        error={errors.postal_code?.message}
                      />
                      <Input
                        id="country"
                        label="Country"
                        value="Canada"
                        disabled
                        {...register('country')}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Work Eligibility & Business Status */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fade-in">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6">
                      <h4 className="font-bold text-gray-900 mb-2">Legal Work Authorization</h4>
                      <p className="text-sm text-gray-600">Confirm your eligibility to work in Canada</p>
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                        <input
                          type="checkbox"
                          {...register('can_work_canada')}
                          className="h-6 w-6 accent-emerald-500 rounded"
                        />
                        <label className="text-sm font-semibold text-gray-900">
                          I am legally allowed to work in Canada
                        </label>
                      </div>

                      <Select
                        id="work_status"
                        label="Work Authorization Status"
                        options={[
                          { value: 'citizen', label: 'Canadian Citizen' },
                          { value: 'pr', label: 'Permanent Resident' },
                          { value: 'work_permit', label: 'Work Permit Holder' },
                        ]}
                        {...register('work_status')}
                        error={errors.work_status?.message}
                      />
                      
                      <Input
                        id="sin_number"
                        label="Social Insurance Number (SIN)"
                        placeholder="000-000-000"
                        {...register('sin_number')}
                      />
                      
                      {watch('work_status') === 'work_permit' && (
                        <div className="grid md:grid-cols-2 gap-6 mt-4 animate-fade-in">
                          <Input
                            id="work_permit_expiry"
                            label="Work Permit Expiry Date"
                            type="date"
                            {...register('work_permit_expiry')}
                          />
                          <div className="bg-white rounded-lg p-4 border-2 border-dashed border-emerald-300 hover:border-emerald-500 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <div className="text-left">
                                <p className="text-sm font-semibold text-gray-900">Work Permit</p>
                                <p className="text-xs text-gray-500">Upload later in dashboard</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-8 mb-4">
                      <h4 className="font-bold text-gray-900 mb-2">Business Operating Status</h4>
                      <p className="text-sm text-gray-600">How you operate your service business</p>
                    </div>

                    <div className="space-y-6">
                      <Select
                        id="provider_type"
                        label="Provider Type"
                        options={[
                          { value: 'individual', label: 'Individual / Sole Proprietor' },
                          { value: 'incorporated', label: 'Incorporated Business' },
                        ]}
                        {...register('provider_type')}
                      />

                      {watch('provider_type') === 'incorporated' && (
                        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                          <Input
                            id="business_name"
                            label="Business Legal Name"
                            placeholder="Your Company Inc."
                            {...register('business_name')}
                          />
                          <Input
                            id="business_number"
                            label="Business Number (BN)"
                            placeholder="123456789RC0001"
                            {...register('business_number')}
                          />
                          <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                            <input
                              type="checkbox"
                              {...register('gst_registered')}
                              className="h-5 w-5 accent-amber-500 rounded"
                            />
                            <label className="text-sm font-semibold text-gray-900">
                              GST/HST Registered
                            </label>
                          </div>
                          <Input
                            id="trade_name"
                            label="Trade Name / DBA (if different)"
                            placeholder="Your Trading Name"
                            {...register('trade_name')}
                          />
                          {watch('gst_registered') && (
                            <Input
                              id="gst_number"
                              label="GST/HST Number"
                              placeholder="123456789RT0001"
                              {...register('gst_number')}
                            />
                          )}
                          <Input
                            id="incorporation_date"
                            label="Incorporation Date"
                            type="date"
                            {...register('incorporation_date')}
                          />
                          <div className="md:col-span-2 bg-white rounded-lg p-4 border-2 border-dashed border-amber-300 hover:border-amber-500 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                              <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <div className="text-left">
                                <p className="text-sm font-semibold text-gray-900">Business Registration Certificate</p>
                                <p className="text-xs text-gray-500">Articles of incorporation - Upload later in dashboard</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Services, Skills & Final Verification */}
                {currentStep === 3 && (
                  <div className="space-y-8 animate-fade-in">
                    {/* Services Offered */}
                    <div>
                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                        <h4 className="font-bold text-gray-900 mb-2">Services Offered</h4>
                        <p className="text-sm text-gray-600">Select all services you're qualified to provide</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {AVAILABLE_SERVICES.map((service) => (
                          <div
                            key={service.key}
                            onClick={() => handleServiceToggle(service.key)}
                            className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                              selectedServices.includes(service.key)
                                ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-xl scale-[1.02]'
                                : 'border-gray-200 hover:border-purple-300 hover:shadow-md hover:scale-[1.01]'
                            }`}
                          >
                            {selectedServices.includes(service.key) && (
                              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">{service.label}</div>
                                <div className="text-sm text-gray-600">{service.description}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors.services && <p className="text-red-600 text-sm mt-2 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.services.message}
                      </p>}
                    </div>

                    {/* Experience & Skills */}
                    <div>
                      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mb-6">
                        <h4 className="font-bold text-gray-900 mb-2">Skills & Experience</h4>
                        <p className="text-sm text-gray-600">Tell us about your professional background</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <Input
                          id="experience_years"
                          label="Years of Professional Experience"
                          type="number"
                          placeholder="e.g., 5"
                          {...register('experience_years', { valueAsNumber: true })}
                          error={errors.experience_years?.message}
                        />
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-3">Languages Spoken</label>
                          <div className="grid grid-cols-2 gap-2">
                            {['English', 'Punjabi', 'Hindi', 'French', 'Mandarin', 'Spanish'].map((lang) => (
                              <button
                                key={lang}
                                type="button"
                                onClick={() => handleLanguageToggle(lang.toLowerCase())}
                                className={`p-3 rounded-lg border-2 text-sm font-semibold transition-all ${
                                  selectedLanguages.includes(lang.toLowerCase())
                                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                                    : 'border-gray-200 text-gray-600 hover:border-cyan-300'
                                }`}
                              >
                                {lang}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <Textarea
                          id="professional_bio"
                          label="Professional Bio (Optional)"
                          placeholder="Describe your experience, specializations, and what makes you great at what you do..."
                          rows={4}
                          {...register('professional_bio')}
                        />
                        <p className="text-xs text-gray-500 mt-2">200-300 words recommended</p>
                      </div>
                      
                      {/* Certifications & Licenses */}
                      <div className="mt-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl p-6">
                        <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          Professional Certifications & Trade Licenses (Optional)
                        </h5>
                        <p className="text-sm text-gray-600 mb-4">List any relevant certifications, tickets, or trade licenses (e.g., Red Seal, Gas Fitter, Electrician License)</p>
                        
                        <Textarea
                          id="certifications"
                          placeholder="e.g., Red Seal Plumber, Level 2 Electrician, HVAC Certified..."
                          rows={2}
                          {...register('certifications')}
                        />
                        
                        <div className="mt-4 grid md:grid-cols-2 gap-4">
                          <div className="bg-white rounded-lg p-4 border-2 border-dashed border-cyan-300 hover:border-cyan-500 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                              <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <div className="text-left">
                                <p className="text-sm font-semibold text-gray-900">Certification Documents</p>
                                <p className="text-xs text-gray-500">Upload later in dashboard</p>
                              </div>
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 border-2 border-dashed border-cyan-300 hover:border-cyan-500 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                              <svg className="w-8 h-8 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <div className="text-left">
                                <p className="text-sm font-semibold text-gray-900">Trade License Documents</p>
                                <p className="text-xs text-gray-500">Upload later in dashboard</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Portfolio */}
                      <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
                        <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Work Portfolio (Optional)
                        </h5>
                        <p className="text-sm text-gray-600 mb-4">Showcase your best work with before/after photos or project descriptions</p>
                        
                        <Textarea
                          id="portfolio_description"
                          placeholder="Describe your notable projects, achievements, and types of work you specialize in..."
                          rows={2}
                          {...register('portfolio_description')}
                        />
                        
                        <div className="mt-4 bg-white rounded-lg p-6 border-2 border-dashed border-purple-300 hover:border-purple-500 transition-colors cursor-pointer text-center">
                          <svg className="w-12 h-12 text-purple-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm font-semibold text-gray-900">Upload Portfolio Images</p>
                          <p className="text-xs text-gray-500 mt-1">Before/After photos of your work - Upload later in dashboard</p>
                        </div>
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                        <h4 className="font-bold text-gray-900 mb-2">Availability & Coverage</h4>
                        <p className="text-sm text-gray-600">When and where you can work</p>
                      </div>

                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-4">Available Days</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                              <button
                                key={day}
                                type="button"
                                onClick={() => handleDayToggle(day.toLowerCase())}
                                className={`relative p-4 rounded-xl border-2 font-bold transition-all duration-300 ${
                                  selectedDays.includes(day.toLowerCase())
                                    ? 'border-green-500 bg-gradient-to-br from-green-400 to-emerald-400 text-white shadow-lg'
                                    : 'border-gray-200 text-gray-600 hover:border-green-300'
                                }`}
                              >
                                {selectedDays.includes(day.toLowerCase()) && (
                                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </div>
                                )}
                                {day.slice(0, 3)}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <Select
                            id="availability_hours"
                            label="Preferred Hours"
                            options={[
                              { value: '6am-12pm', label: 'Early Morning (6am-12pm)' },
                              { value: '12pm-6pm', label: 'Afternoon (12pm-6pm)' },
                              { value: '6pm-10pm', label: 'Evening (6pm-10pm)' },
                              { value: 'flexible', label: 'Flexible' },
                            ]}
                            {...register('availability_hours')}
                            error={errors.availability_hours?.message}
                          />
                          <Select
                            id="travel_radius"
                            label="Travel Radius"
                            options={[
                              { value: '5km', label: 'Within 5 km' },
                              { value: '10km', label: 'Within 10 km' },
                              { value: '20km', label: 'Within 20 km' },
                              { value: 'unlimited', label: 'Anywhere in city' },
                            ]}
                            {...register('travel_radius')}
                            error={errors.travel_radius?.message}
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                            <input
                              type="checkbox"
                              {...register('same_day_jobs')}
                              className="h-5 w-5 accent-green-500 rounded"
                            />
                            <label className="text-sm font-semibold text-gray-900">
                              Accept same-day jobs
                            </label>
                          </div>
                          <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                            <input
                              type="checkbox"
                              {...register('emergency_jobs')}
                              className="h-5 w-5 accent-green-500 rounded"
                            />
                            <label className="text-sm font-semibold text-gray-900">
                              Accept emergency jobs
                            </label>
                          </div>
                          <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                            <input
                              type="checkbox"
                              {...register('own_transportation')}
                              className="h-5 w-5 accent-green-500 rounded"
                            />
                            <label className="text-sm font-semibold text-gray-900">
                              Own transportation
                            </label>
                          </div>
                          <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                            <input
                              type="checkbox"
                              {...register('drivers_license')}
                              className="h-5 w-5 accent-green-500 rounded"
                            />
                            <label className="text-sm font-semibold text-gray-900">
                              Valid driver's license
                            </label>
                          </div>
                        </div>

                        {watch('own_transportation') && (
                          <Input
                            id="vehicle_type"
                            label="Vehicle Type"
                            placeholder="e.g., Pickup truck, Van, SUV"
                            {...register('vehicle_type')}
                          />
                        )}
                        
                        {watch('drivers_license') && (
                          <div className="grid md:grid-cols-2 gap-6 mt-4 animate-fade-in">
                            <Input
                              id="drivers_license_number"
                              label="Driver's License Number"
                              placeholder="Licence number"
                              {...register('drivers_license_number')}
                            />
                            <Input
                              id="drivers_license_expiry"
                              label="Expiry Date"
                              type="date"
                              {...register('drivers_license_expiry')}
                            />
                          </div>
                        )}
                        
                        <div className="mt-6 grid md:grid-cols-2 gap-6">
                          <Select
                            id="response_time"
                            label="Response Time to Job Requests"
                            options={[
                              { value: 'within_1_hour', label: 'Within 1 hour' },
                              { value: 'within_2_4_hours', label: 'Within 2-4 hours' },
                              { value: 'same_day', label: 'Same day only' },
                              { value: 'next_day', label: 'Next day or later' },
                            ]}
                            {...register('response_time')}
                          />
                          <Textarea
                            id="service_areas"
                            label="Specific Service Areas (Neighborhoods/Cities)"
                            placeholder="e.g., Downtown Vancouver, West Vancouver, Burnaby..."
                            rows={2}
                            {...register('service_areas')}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Earnings */}
                    <div>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                        <h4 className="font-bold text-gray-900 mb-2">Pricing & Earnings</h4>
                        <p className="text-sm text-gray-600">Set your rates and payment preferences (optional - we can help)</p>
                      </div>

                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <Input
                            id="hourly_rate_min"
                            label="Minimum Hourly Rate ($)"
                            type="number"
                            placeholder="e.g., 50"
                            {...register('hourly_rate_min', { valueAsNumber: true })}
                          />
                          <Input
                            id="hourly_rate_max"
                            label="Maximum Hourly Rate ($)"
                            type="number"
                            placeholder="e.g., 150"
                            {...register('hourly_rate_max', { valueAsNumber: true })}
                          />
                          <Input
                            id="minimum_job_value"
                            label="Minimum Job Value ($)"
                            type="number"
                            placeholder="e.g., 100"
                            {...register('minimum_job_value', { valueAsNumber: true })}
                          />
                          <Select
                            id="payment_terms"
                            label="Payment Terms Preference"
                            options={[
                              { value: 'immediate', label: 'Immediate (within 24 hrs)' },
                              { value: 'weekly', label: 'Weekly' },
                              { value: 'biweekly', label: 'Bi-weekly' },
                              { value: 'monthly', label: 'Monthly' },
                            ]}
                            {...register('payment_terms')}
                          />
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                            <input
                              type="checkbox"
                              {...register('weekend_premium')}
                              className="h-5 w-5 accent-yellow-500 rounded"
                            />
                            <label className="text-sm font-semibold text-gray-900">
                              Charge weekend premium
                            </label>
                          </div>
                          <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                            <input
                              type="checkbox"
                              {...register('evening_premium')}
                              className="h-5 w-5 accent-yellow-500 rounded"
                            />
                            <label className="text-sm font-semibold text-gray-900">
                              Charge evening premium
                            </label>
                          </div>
                          <Input
                            id="emergency_rate_multiplier"
                            label="Emergency Rate Multiplier"
                            type="number"
                            step="0.1"
                            placeholder="e.g., 1.5"
                            {...register('emergency_rate_multiplier', { valueAsNumber: true })}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Insurance & Background Check */}
                    <div>
                      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
                        <h4 className="font-bold text-gray-900 mb-2">Insurance & Safety Verification</h4>
                        <p className="text-sm text-gray-600">Required for trust and protection</p>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                          <input
                            type="checkbox"
                            {...register('has_insurance')}
                            className="h-6 w-6 accent-indigo-500 rounded"
                          />
                          <label className="text-sm font-semibold text-gray-900">
                            I have liability insurance ($2M minimum recommended)
                          </label>
                        </div>

                        {watch('has_insurance') && (
                          <div className="space-y-4 animate-fade-in">
                            <div className="grid md:grid-cols-3 gap-6">
                              <Input
                                id="insurance_provider"
                                label="Insurance Provider"
                                placeholder="Provider name"
                                {...register('insurance_provider')}
                              />
                              <Select
                                id="coverage_amount"
                                label="Coverage Amount"
                                options={[
                                  { value: '1M', label: '$1 Million' },
                                  { value: '2M', label: '$2 Million' },
                                  { value: '5M+', label: '$5 Million+' },
                                ]}
                                {...register('coverage_amount')}
                              />
                              <Input
                                id="insurance_expiry"
                                label="Expiry Date"
                                type="date"
                                {...register('insurance_expiry')}
                              />
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-6">
                              <Input
                                id="insurance_policy_number"
                                label="Policy Number"
                                placeholder="Your policy number"
                                {...register('insurance_policy_number')}
                              />
                              <div className="bg-white rounded-lg p-4 border-2 border-dashed border-indigo-300 hover:border-indigo-500 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                  <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  <div className="text-left">
                                    <p className="text-sm font-semibold text-gray-900">Insurance Certificate</p>
                                    <p className="text-xs text-gray-500">Upload later in dashboard</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
                              <input
                                type="checkbox"
                                {...register('wcb_coverage')}
                                className="h-5 w-5 accent-indigo-500 rounded"
                              />
                              <label className="text-sm font-semibold text-gray-900">
                                I have WCB (Workers' Compensation) Coverage
                              </label>
                            </div>
                            
                            {watch('wcb_coverage') && (
                              <Input
                                id="wcb_number"
                                label="WCB Account Number"
                                placeholder="Your WCB number"
                                {...register('wcb_number')}
                              />
                            )}
                          </div>
                        )}

                        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-300 rounded-2xl p-8 shadow-lg">
                          <div className="flex gap-4">
                            <div className="flex-shrink-0">
                              <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg">
                                <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-black text-xl text-gray-900 mb-3">Background Check Required</h4>
                              <p className="text-sm text-gray-700 leading-relaxed mb-6">
                                For the safety and trust of our community, all service providers must consent to a comprehensive background verification.
                              </p>
                              <div className="space-y-4">
                                <label className="flex items-start gap-4 cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    {...register('background_check_consent')}
                                    className="mt-1 h-6 w-6 accent-red-500 rounded-lg cursor-pointer"
                                  />
                                  <span className="text-sm text-gray-900 font-semibold group-hover:text-red-600 transition-colors">
                                    I consent to a background check and understand it's required for all service providers
                                  </span>
                                </label>
                                {errors.background_check_consent && (
                                  <p className="text-red-600 text-sm flex items-center gap-2 font-semibold">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    {errors.background_check_consent.message}
                                  </p>
                                )}
                                <label className="flex items-start gap-4">
                                  <input
                                    type="checkbox"
                                    {...register('criminal_record')}
                                    className="mt-1 h-5 w-5 accent-red-500 rounded"
                                  />
                                  <span className="text-sm text-gray-700">
                                    I declare that I have no criminal record relevant to home services
                                  </span>
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional References */}
                    <div>
                      <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 mb-6">
                        <h4 className="font-bold text-gray-900 mb-2">Professional References</h4>
                        <p className="text-sm text-gray-600">Provide contact information for two professional references (optional but recommended)</p>
                      </div>

                      <div className="space-y-8">
                        {/* Reference 1 */}
                        <div className="border border-gray-200 rounded-xl p-6 bg-white">
                          <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">1</span>
                            Reference Contact #1
                          </h5>
                          <div className="grid md:grid-cols-3 gap-6">
                            <Input
                              id="reference1_name"
                              label="Full Name"
                              placeholder="Jane Smith"
                              {...register('reference1_name')}
                            />
                            <Input
                              id="reference1_phone"
                              label="Phone Number"
                              placeholder="(555) 123-4567"
                              {...register('reference1_phone')}
                            />
                            <Input
                              id="reference1_email"
                              label="Email Address"
                              type="email"
                              placeholder="jane@example.com"
                              {...register('reference1_email')}
                            />
                            <Input
                              id="reference1_relationship"
                              label="Relationship"
                              placeholder="e.g., Former Client, Supervisor"
                              {...register('reference1_relationship')}
                            />
                            <Input
                              id="reference1_years_known"
                              label="Years You've Known Them"
                              type="number"
                              placeholder="e.g., 5"
                              {...register('reference1_years_known', { valueAsNumber: true })}
                            />
                          </div>
                        </div>

                        {/* Reference 2 */}
                        <div className="border border-gray-200 rounded-xl p-6 bg-white">
                          <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">2</span>
                            Reference Contact #2
                          </h5>
                          <div className="grid md:grid-cols-3 gap-6">
                            <Input
                              id="reference2_name"
                              label="Full Name"
                              placeholder="John Davis"
                              {...register('reference2_name')}
                            />
                            <Input
                              id="reference2_phone"
                              label="Phone Number"
                              placeholder="(555) 987-6543"
                              {...register('reference2_phone')}
                            />
                            <Input
                              id="reference2_email"
                              label="Email Address"
                              type="email"
                              placeholder="john@example.com"
                              {...register('reference2_email')}
                            />
                            <Input
                              id="reference2_relationship"
                              label="Relationship"
                              placeholder="e.g., Business Partner, Client"
                              {...register('reference2_relationship')}
                            />
                            <Input
                              id="reference2_years_known"
                              label="Years You've Known Them"
                              type="number"
                              placeholder="e.g., 3"
                              {...register('reference2_years_known', { valueAsNumber: true })}
                            />
                          </div>
                        </div>
                        
                        {/* Reference 3 */}
                        <div className="border border-gray-200 rounded-xl p-6 bg-white">
                          <h5 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-sm font-bold">3</span>
                            Reference Contact #3 (Optional)
                          </h5>
                          <div className="grid md:grid-cols-3 gap-6">
                            <Input
                              id="reference3_name"
                              label="Full Name"
                              placeholder="Sarah Wilson"
                              {...register('reference3_name')}
                            />
                            <Input
                              id="reference3_phone"
                              label="Phone Number"
                              placeholder="(555) 456-7890"
                              {...register('reference3_phone')}
                            />
                            <Input
                              id="reference3_email"
                              label="Email Address"
                              type="email"
                              placeholder="sarah@example.com"
                              {...register('reference3_email')}
                            />
                            <Input
                              id="reference3_relationship"
                              label="Relationship"
                              placeholder="e.g., Colleague, Former Employer"
                              {...register('reference3_relationship')}
                            />
                            <Input
                              id="reference3_years_known"
                              label="Years You've Known Them"
                              type="number"
                              placeholder="e.g., 2"
                              {...register('reference3_years_known', { valueAsNumber: true })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Banking & Payouts */}
                    <div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                        <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Banking & Direct Deposit (Optional Now)
                        </h4>
                        <p className="text-sm text-gray-600">Set up direct deposit for faster payouts</p>
                      </div>

                      <div className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <Input
                            id="bank_account_name"
                            label="Account Holder Name"
                            placeholder="Your full name"
                            {...register('bank_account_name')}
                          />
                          <Input
                            id="bank_name"
                            label="Bank Name"
                            placeholder="e.g., Royal Bank, TD, BMO"
                            {...register('bank_name')}
                          />
                          <Select
                            id="account_type"
                            label="Account Type"
                            options={[
                              { value: 'chequing', label: 'Chequing' },
                              { value: 'savings', label: 'Savings' },
                            ]}
                            {...register('account_type')}
                          />
                          <Select
                            id="payout_frequency"
                            label="Preferred Payout Frequency"
                            options={[
                              { value: 'daily', label: 'Daily' },
                              { value: 'weekly', label: 'Weekly' },
                              { value: 'biweekly', label: 'Bi-weekly' },
                              { value: 'monthly', label: 'Monthly' },
                            ]}
                            {...register('payout_frequency')}
                          />
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                          <Input
                            id="transit_number"
                            label="Transit Number (5 digits)"
                            placeholder="00001"
                            {...register('transit_number')}
                          />
                          <Input
                            id="institution_number"
                            label="Institution Number (3 digits)"
                            placeholder="004"
                            {...register('institution_number')}
                          />
                          <Input
                            id="account_number"
                            label="Account Number"
                            placeholder="Your account number"
                            {...register('account_number')}
                          />
                        </div>

                        <div className="bg-white rounded-lg p-6 border-2 border-dashed border-green-300 hover:border-green-500 transition-colors cursor-pointer">
                          <div className="flex items-center gap-4">
                            <svg className="w-12 h-12 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div className="flex-1">
                              <p className="text-sm font-semibold text-gray-900">Upload Void Cheque</p>
                              <p className="text-xs text-gray-600 mt-1">A blank cheque showing your banking details (for verification)</p>
                              <p className="text-xs text-gray-500 mt-2">Upload later in your dashboard</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-xl">
                          <input
                            type="checkbox"
                            {...register('direct_deposit_confirmed')}
                            className="h-5 w-5 accent-green-600 rounded"
                          />
                          <label className="text-sm font-semibold text-gray-900">
                            I consent to receive payments via direct deposit
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Technology & Platform */}
                    <div>
                      <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-6">
                        <h4 className="font-bold text-gray-900 mb-2">Technology & Platform Use</h4>
                        <p className="text-sm text-gray-600">Ensure you can use our platform effectively</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <Select
                          id="smartphone_type"
                          label="Smartphone Type"
                          options={[
                            { value: 'ios', label: 'iOS (iPhone)' },
                            { value: 'android', label: 'Android' },
                          ]}
                          {...register('smartphone_type')}
                        />
                        <Select
                          id="tech_savviness"
                          label="Tech Comfort Level"
                          options={[
                            { value: 'beginner', label: 'Beginner' },
                            { value: 'intermediate', label: 'Intermediate' },
                            { value: 'advanced', label: 'Advanced' },
                          ]}
                          {...register('tech_savviness')}
                        />
                        
                        <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                          <input
                            type="checkbox"
                            {...register('computer_access')}
                            className="h-5 w-5 accent-pink-500 rounded"
                          />
                          <label className="text-sm font-semibold text-gray-900">
                            Have access to a computer
                          </label>
                        </div>
                        
                        <div className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl">
                          <input
                            type="checkbox"
                            {...register('app_comfortable')}
                            className="h-5 w-5 accent-pink-500 rounded"
                          />
                          <label className="text-sm font-semibold text-gray-900">
                            Comfortable using mobile apps
                          </label>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <label className="block text-sm font-bold text-gray-900 mb-3">Previous Online Platform Experience (Optional)</label>
                        <p className="text-xs text-gray-600 mb-3">Have you used any of these platforms before?</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {['TaskRabbit', 'Uber', 'Airbnb', 'Fiverr', 'Upwork', 'DoorDash', 'Instacart', 'Etsy', 'Other gig platform'].map((platform) => (
                            <button
                              key={platform}
                              type="button"
                              className="p-3 rounded-lg border border-pink-200 text-sm font-semibold text-gray-700 hover:bg-pink-50 hover:border-pink-400 transition-all text-left"
                            >
                              {platform}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Final Agreements */}
                    <div>
                      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
                        <h4 className="font-black text-gray-900 mb-2">Terms & Agreements</h4>
                        <p className="text-sm text-gray-600">Final step before submission</p>
                      </div>

                      <div className="space-y-4">
                        <label className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-purple-300 transition-colors">
                          <input
                            type="checkbox"
                            {...register('terms_accepted')}
                            className="mt-1 h-6 w-6 accent-purple-500 rounded cursor-pointer"
                          />
                          <span className="text-sm text-gray-900">
                            I accept the <a href="/terms" className="text-purple-600 font-semibold hover:underline">Independent Contractor Agreement</a> and <a href="/terms" className="text-purple-600 font-semibold hover:underline">Terms of Service</a>
                          </span>
                        </label>
                        {errors.terms_accepted && <p className="text-red-600 text-sm">{errors.terms_accepted.message}</p>}

                        <label className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-purple-300 transition-colors">
                          <input
                            type="checkbox"
                            {...register('privacy_accepted')}
                            className="mt-1 h-6 w-6 accent-purple-500 rounded cursor-pointer"
                          />
                          <span className="text-sm text-gray-900">
                            I have read and accept the <a href="/privacy" className="text-purple-600 font-semibold hover:underline">Privacy Policy</a>
                          </span>
                        </label>
                        {errors.privacy_accepted && <p className="text-red-600 text-sm">{errors.privacy_accepted.message}</p>}

                        <div className="mt-6">
                          <Input
                            id="signature"
                            label="Digital Signature (Type your full legal name)"
                            placeholder="John Doe"
                            {...register('signature')}
                            error={errors.signature?.message}
                          />
                          <p className="text-xs text-gray-500 mt-2">By typing your name, you're electronically signing this application</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-4 pt-8 border-t border-gray-200">
                  {currentStep > 0 && (
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={goBack}
                      className="px-8 py-4 font-bold"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Back
                    </Button>
                  )}
                  <Button 
                    type="submit" 
                    className={`flex-1 px-8 py-4 text-lg font-black ${currentStep === 0 ? 'w-full' : ''}`}
                    isLoading={isLoading}
                  >
                    {currentStep === 3 ? (
                      <>
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Submit Complete Application
                      </>
                    ) : (
                      <>
                        Continue to {steps[currentStep + 1].title}
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
          </div>

          {/* Trust & Security Footer */}
          <div className="mt-8 bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/50 shadow-lg">
            <div className="flex items-center justify-center gap-8 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-black text-gray-900">256-bit Encrypted</div>
                  <div className="text-xs text-gray-600">Bank-level security</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-black text-gray-900">Fast Approval</div>
                  <div className="text-xs text-gray-600">3-5 business days</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-black text-gray-900">Zero Fees</div>
                  <div className="text-xs text-gray-600">100% earnings</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-black text-gray-900">24/7 Support</div>
                  <div className="text-xs text-gray-600">Always here to help</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
