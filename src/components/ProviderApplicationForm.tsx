'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Stepper } from '@/components/ui/Stepper';
import { APPLICATION_STEPS, AVAILABLE_SERVICES } from '@/lib/constants';
import { toast } from 'sonner';

// Document types for upload
interface UploadedDocument {
  file: File | null;
  preview: string | null;
  uploading: boolean;
  uploaded: boolean;
  url: string | null;
}

const applicationSchema = z.object({
  full_name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Valid phone required'),
  city: z.string().min(2, 'City required'),
  services: z.array(z.string()).min(1, 'Select at least one service'),
  experience_years: z.number().min(0, 'Valid experience required'),
  availability_days: z.array(z.string()),
  availability_hours: z.string(),
  travel_radius: z.string(),
  background_check_consent: z.boolean(),
  insurance_status: z.string(),
});

type ApplicationFormData = z.infer<typeof applicationSchema>;

export function ProviderApplicationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const router = useRouter();
  const supabase = createClient();

  // Document upload states
  const [documents, setDocuments] = useState<{
    government_id: UploadedDocument;
    insurance_certificate: UploadedDocument;
    certification: UploadedDocument;
    profile_photo: UploadedDocument;
  }>({
    government_id: { file: null, preview: null, uploading: false, uploaded: false, url: null },
    insurance_certificate: { file: null, preview: null, uploading: false, uploaded: false, url: null },
    certification: { file: null, preview: null, uploading: false, uploaded: false, url: null },
    profile_photo: { file: null, preview: null, uploading: false, uploaded: false, url: null },
  });

  // File input refs
  const govIdRef = useRef<HTMLInputElement>(null);
  const insuranceRef = useRef<HTMLInputElement>(null);
  const certificationRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    mode: 'onBlur',
  });

  // Handle file selection
  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: keyof typeof documents
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPG, PNG, WebP and PDF files are allowed');
      return;
    }

    // Create preview for images
    let preview: string | null = null;
    if (file.type.startsWith('image/')) {
      preview = URL.createObjectURL(file);
    }

    setDocuments((prev) => ({
      ...prev,
      [docType]: { ...prev[docType], file, preview, uploaded: false, url: null },
    }));
  };

  // Upload document to Supabase Storage
  const uploadDocument = async (
    docType: keyof typeof documents,
    userId: string,
    applicationId: string
  ): Promise<string | null> => {
    const doc = documents[docType];
    if (!doc.file) return null;

    setDocuments((prev) => ({
      ...prev,
      [docType]: { ...prev[docType], uploading: true },
    }));

    try {
      const fileExt = doc.file.name.split('.').pop();
      const fileName = `${userId}/${applicationId}/${docType}_${Date.now()}.${fileExt}`;

      console.log(`[Upload] Uploading ${docType} to ${fileName}`);

      const { data, error } = await supabase.storage
        .from('provider-documents')
        .upload(fileName, doc.file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.error(`[Upload Error] ${docType}:`, error);
        toast.error(`Failed to upload ${docType.replace(/_/g, ' ')}: ${error.message}`);
        setDocuments((prev) => ({
          ...prev,
          [docType]: { ...prev[docType], uploading: false },
        }));
        return null;
      }

      console.log(`[Upload Success] ${docType}:`, data);

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('provider-documents')
        .getPublicUrl(fileName);

      console.log(`[Upload URL] ${docType}:`, urlData.publicUrl);

      setDocuments((prev) => ({
        ...prev,
        [docType]: { ...prev[docType], uploading: false, uploaded: true, url: urlData.publicUrl },
      }));

      return urlData.publicUrl;
    } catch (err) {
      console.error(`[Upload Exception] ${docType}:`, err);
      toast.error(`Error uploading ${docType.replace(/_/g, ' ')}`);
      setDocuments((prev) => ({
        ...prev,
        [docType]: { ...prev[docType], uploading: false },
      }));
      return null;
    }
  };

  // Remove selected file
  const removeFile = (docType: keyof typeof documents) => {
    if (documents[docType].preview) {
      URL.revokeObjectURL(documents[docType].preview!);
    }
    setDocuments((prev) => ({
      ...prev,
      [docType]: { file: null, preview: null, uploading: false, uploaded: false, url: null },
    }));
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      return;
    }

    setIsLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // First, create the application to get an ID
      const { data: applicationData, error: applicationError } = await supabase
        .from('provider_applications')
        .insert([
          {
            user_id: user?.id || null,
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            city: data.city,
            services: data.services,
            experience_years: data.experience_years,
            availability: {
              days: data.availability_days,
              hours: data.availability_hours,
              travel_radius: data.travel_radius,
            },
            background_check_consent: data.background_check_consent,
            insurance_status: data.insurance_status,
            status: 'submitted',
          },
        ])
        .select()
        .single();

      if (applicationError || !applicationData) {
        toast.error('Failed to submit application');
        setIsLoading(false);
        return;
      }

      const applicationId = applicationData.id;
      const userId = user?.id || 'anonymous';

      // Upload all documents
      const documentTypes: (keyof typeof documents)[] = [
        'government_id',
        'insurance_certificate',
        'certification',
        'profile_photo',
      ];

      const uploadedDocs: { type: string; url: string }[] = [];

      for (const docType of documentTypes) {
        if (documents[docType].file) {
          const url = await uploadDocument(docType, userId, applicationId);
          if (url) {
            uploadedDocs.push({ type: docType, url });
          }
        }
      }

      // Save document records to database
      if (uploadedDocs.length > 0 && user?.id) {
        const documentRecords = uploadedDocs.map((doc) => ({
          provider_id: user.id,
          application_id: applicationId,
          type: doc.type,
          url: doc.url,
          status: 'submitted',
        }));

        const { error: docError } = await supabase.from('documents').insert(documentRecords);

        if (docError) {
          console.error('Error saving document records:', docError);
          // Don't fail the application, just log the error
        }
      }

      toast.success('Application submitted successfully!');
      router.push('/apply/success');
    } catch (err) {
      console.error('Application submission error:', err);
      toast.error('Failed to submit application');
      setIsLoading(false);
    }
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

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Stepper steps={APPLICATION_STEPS} currentStep={currentStep} />

      <Card className="mt-12 bg-white/90 backdrop-blur border-blue-100">
        <CardHeader>
          <CardTitle>{APPLICATION_STEPS[currentStep - 1].title}</CardTitle>
          <CardDescription>{APPLICATION_STEPS[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 && (
              <>
                <Input
                  id="full_name"
                  label="Full Name"
                  placeholder="John Doe"
                  {...register('full_name')}
                  error={errors.full_name?.message}
                />
                <Input
                  id="email"
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  error={errors.email?.message}
                />
                <Input
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  {...register('phone')}
                  error={errors.phone?.message}
                />
                <Select
                  id="city"
                  label="City"
                  options={[
                    { value: 'vancouver', label: 'Vancouver' },
                    { value: 'surrey', label: 'Surrey' },
                    { value: 'burnaby', label: 'Burnaby' },
                    { value: 'richmond', label: 'Richmond' },
                    { value: 'coquitlam', label: 'Coquitlam' },
                    { value: 'langley', label: 'Langley' },
                    { value: 'delta', label: 'Delta' },
                    { value: 'north-vancouver', label: 'North Vancouver' },
                    { value: 'new-westminster', label: 'New Westminster' },
                    { value: 'port-coquitlam', label: 'Port Coquitlam' },
                    { value: 'port-moody', label: 'Port Moody' },
                    { value: 'maple-ridge', label: 'Maple Ridge' },
                  ]}
                  {...register('city')}
                  error={errors.city?.message}
                />
              </>
            )}

            {currentStep === 2 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-dark mb-4">Services</label>
                  <div className="grid grid-cols-2 gap-4">
                    {AVAILABLE_SERVICES.map((service) => (
                      <div
                        key={service.key}
                        onClick={() => handleServiceToggle(service.key)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedServices.includes(service.key)
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-blue-100 hover:border-blue-300'
                        }`}
                      >
                        <div className="font-semibold text-dark">{service.label}</div>
                        <div className="text-sm text-medium-grey">{service.description}</div>
                      </div>
                    ))}
                  </div>
                  {errors.services && <p className="text-red-600 text-sm mt-2">{errors.services.message}</p>}
                </div>

                <Input
                  id="experience_years"
                  label="Years of Experience"
                  type="number"
                  placeholder="5"
                  {...register('experience_years', { valueAsNumber: true })}
                  error={errors.experience_years?.message}
                />
              </>
            )}

            {currentStep === 3 && (
              <>
                <div>
                  <label className="block text-sm font-medium text-dark mb-4">Available Days</label>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedDays.includes(day)
                            ? 'bg-[#2F80ED] text-white'
                            : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <Select
                  id="availability_hours"
                  label="Preferred Hours"
                  options={[
                    { value: 'mornings', label: 'Mornings (8am - 12pm)' },
                    { value: 'afternoons', label: 'Afternoons (12pm - 5pm)' },
                    { value: 'evenings', label: 'Evenings (5pm - 9pm)' },
                    { value: 'flexible', label: 'Flexible' },
                  ]}
                  {...register('availability_hours')}
                  error={errors.availability_hours?.message}
                />

                <Select
                  id="travel_radius"
                  label="Travel Radius"
                  options={[
                    { value: '5km', label: 'Up to 5 km' },
                    { value: '10km', label: 'Up to 10 km' },
                    { value: '20km', label: 'Up to 20 km' },
                    { value: '40km', label: 'Up to 40 km' },
                  ]}
                  {...register('travel_radius')}
                  error={errors.travel_radius?.message}
                />
              </>
            )}

            {currentStep === 4 && (
              <>
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      📄 Upload clear, legible copies of your documents. Accepted formats: JPG, PNG, WebP, PDF (max 10MB each)
                    </p>
                  </div>

                  {/* Government ID */}
                  <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-colors">
                    <input
                      ref={govIdRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, 'government_id')}
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-dark">Government ID *</h4>
                        <p className="text-sm text-medium-grey">Driver&apos;s license, passport, or provincial ID</p>
                      </div>
                      {documents.government_id.file ? (
                        <div className="flex items-center gap-3">
                          {documents.government_id.preview && (
                            <img src={documents.government_id.preview} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
                          )}
                          <span className="text-sm text-green-600 font-medium">✓ {documents.government_id.file.name}</span>
                          <button type="button" onClick={() => removeFile('government_id')} className="text-red-500 hover:text-red-700 text-sm">
                            Remove
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => govIdRef.current?.click()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Upload
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Insurance Certificate */}
                  <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-colors">
                    <input
                      ref={insuranceRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, 'insurance_certificate')}
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-dark">Insurance Certificate</h4>
                        <p className="text-sm text-medium-grey">Proof of liability insurance (if you have your own)</p>
                      </div>
                      {documents.insurance_certificate.file ? (
                        <div className="flex items-center gap-3">
                          {documents.insurance_certificate.preview && (
                            <img src={documents.insurance_certificate.preview} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
                          )}
                          <span className="text-sm text-green-600 font-medium">✓ {documents.insurance_certificate.file.name}</span>
                          <button type="button" onClick={() => removeFile('insurance_certificate')} className="text-red-500 hover:text-red-700 text-sm">
                            Remove
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => insuranceRef.current?.click()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Upload
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Trade Certifications */}
                  <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-colors">
                    <input
                      ref={certificationRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, 'certification')}
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-dark">Trade Certifications</h4>
                        <p className="text-sm text-medium-grey">Any relevant trade licenses or certifications</p>
                      </div>
                      {documents.certification.file ? (
                        <div className="flex items-center gap-3">
                          {documents.certification.preview && (
                            <img src={documents.certification.preview} alt="Preview" className="w-12 h-12 object-cover rounded-lg" />
                          )}
                          <span className="text-sm text-green-600 font-medium">✓ {documents.certification.file.name}</span>
                          <button type="button" onClick={() => removeFile('certification')} className="text-red-500 hover:text-red-700 text-sm">
                            Remove
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => certificationRef.current?.click()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Upload
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Profile Photo */}
                  <div className="border-2 border-dashed border-blue-200 rounded-xl p-6 hover:border-blue-400 transition-colors">
                    <input
                      ref={photoRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, 'profile_photo')}
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-dark">Profile Photo *</h4>
                        <p className="text-sm text-medium-grey">A clear, professional headshot</p>
                      </div>
                      {documents.profile_photo.file ? (
                        <div className="flex items-center gap-3">
                          {documents.profile_photo.preview && (
                            <img src={documents.profile_photo.preview} alt="Preview" className="w-12 h-12 object-cover rounded-full" />
                          )}
                          <span className="text-sm text-green-600 font-medium">✓ {documents.profile_photo.file.name}</span>
                          <button type="button" onClick={() => removeFile('profile_photo')} className="text-red-500 hover:text-red-700 text-sm">
                            Remove
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => photoRef.current?.click()}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Upload
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-medium-grey mt-4">* Required documents. Other documents help speed up your application approval.</p>
                </div>
              </>
            )}

            {currentStep === 5 && (
              <>
                <Select
                  id="insurance_status"
                  label="Insurance Status"
                  options={[
                    { value: 'insured', label: 'I have my own insurance' },
                    { value: 'needs', label: 'I need coverage through Urbance' },
                  ]}
                  {...register('insurance_status')}
                  error={errors.insurance_status?.message}
                />

                <Textarea
                  id="notes"
                  label="Additional Notes"
                  placeholder="Tell us anything we should know about your experience."
                />

                <label className="flex items-center gap-3 text-sm text-dark">
                  <input type="checkbox" {...register('background_check_consent')} />
                  I agree to a background check
                </label>
                {errors.background_check_consent && (
                  <p className="text-red-600 text-sm">Background check consent is required</p>
                )}
              </>
            )}

            <div className="flex items-center justify-between pt-4">
              <Button type="button" variant="outline" onClick={goBack} disabled={currentStep === 1}>
                Back
              </Button>
              <Button type="submit" isLoading={isLoading}>
                {currentStep < 5 ? 'Continue' : 'Submit Application'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
