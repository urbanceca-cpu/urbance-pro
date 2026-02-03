'use client';

import { useState, useEffect, useRef } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Document {
  id: string;
  type: string;
  url: string;
  status: 'required' | 'submitted' | 'verified' | 'expired';
  created_at: string;
  expires_at?: string;
}

const DOCUMENT_CONFIG = [
  { type: 'government_id', label: 'Government ID', description: "Driver's license, passport, or provincial ID", required: true },
  { type: 'insurance_certificate', label: 'Insurance Certificate', description: 'Proof of liability insurance', required: false },
  { type: 'certification', label: 'Trade Certifications', description: 'Relevant trade licenses or certifications', required: false },
  { type: 'profile_photo', label: 'Profile Photo', description: 'A clear, professional headshot', required: true },
  { type: 'background_check', label: 'Background Check', description: 'Criminal record check results', required: true },
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const supabase = createClient();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('provider_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
    } else {
      setDocuments(data || []);
    }
    setIsLoading(false);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
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

    setUploading(docType);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to upload documents');
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${docType}_${Date.now()}.${fileExt}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('provider-documents')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Failed to upload document');
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('provider-documents')
        .getPublicUrl(fileName);

      // Save document record
      const { error: dbError } = await supabase
        .from('documents')
        .insert({
          provider_id: user.id,
          type: docType,
          url: urlData.publicUrl,
          status: 'submitted',
        });

      if (dbError) {
        console.error('Database error:', dbError);
        toast.error('Failed to save document record');
        return;
      }

      toast.success('Document uploaded successfully!');
      fetchDocuments();
    } catch (err) {
      console.error('Error uploading document:', err);
      toast.error('Failed to upload document');
    } finally {
      setUploading(null);
    }
  };

  const getDocumentForType = (type: string): Document | undefined => {
    return documents.find(doc => doc.type === type);
  };

  const getStatusBadge = (status: string) => {
    const styles: { [key: string]: string } = {
      required: 'bg-amber-100 text-amber-800',
      submitted: 'bg-blue-100 text-blue-800',
      verified: 'bg-green-100 text-green-800',
      expired: 'bg-red-100 text-red-800',
    };
    const labels: { [key: string]: string } = {
      required: 'Required',
      submitted: 'Under Review',
      verified: 'Verified ✓',
      expired: 'Expired',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || styles.required}`}>
        {labels[status] || 'Required'}
      </span>
    );
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <DashboardSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-dark mb-2">Documents</h1>
          <p className="text-medium-grey mb-8">Upload and manage your verification documents</p>

          {/* Progress Card */}
          <Card className="mb-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Document Verification</h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {documents.filter(d => d.status === 'verified').length} of {DOCUMENT_CONFIG.filter(d => d.required).length} required documents verified
                  </p>
                </div>
                <div className="text-4xl font-bold">
                  {Math.round((documents.filter(d => d.status === 'verified').length / DOCUMENT_CONFIG.filter(d => d.required).length) * 100)}%
                </div>
              </div>
              <div className="mt-4 bg-blue-500/30 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${(documents.filter(d => d.status === 'verified').length / DOCUMENT_CONFIG.filter(d => d.required).length) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Documents</CardTitle>
              <CardDescription>Upload documents to complete your profile verification</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-medium-grey">Loading documents...</div>
              ) : (
                <div className="space-y-4">
                  {DOCUMENT_CONFIG.map((config) => {
                    const doc = getDocumentForType(config.type);
                    return (
                      <div key={config.type} className="flex items-center justify-between p-4 border border-medium-grey/10 rounded-xl hover:border-blue-200 transition-colors">
                        <input
                          type="file"
                          ref={(el) => { fileInputRefs.current[config.type] = el; }}
                          accept="image/jpeg,image/png,image/webp,application/pdf"
                          className="hidden"
                          onChange={(e) => handleFileSelect(e, config.type)}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-dark">{config.label}</h4>
                            {config.required && <span className="text-red-500 text-xs">*</span>}
                          </div>
                          <p className="text-sm text-medium-grey">{config.description}</p>
                          {doc && (
                            <p className="text-xs text-medium-grey mt-1">
                              Uploaded: {new Date(doc.created_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(doc?.status || 'required')}
                          {doc ? (
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="outline">View</Button>
                            </a>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={() => fileInputRefs.current[config.type]?.click()}
                              isLoading={uploading === config.type}
                            >
                              {uploading === config.type ? 'Uploading...' : 'Upload'}
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold text-dark mb-2">Need Help?</h3>
              <p className="text-sm text-medium-grey mb-4">
                Having trouble uploading documents? Make sure your files are in JPG, PNG, WebP, or PDF format and under 10MB.
              </p>
              <Button variant="outline" size="sm">Contact Support</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
