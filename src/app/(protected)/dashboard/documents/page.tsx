'use client';

import { useState, useEffect, useRef } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

const S: Record<string, React.CSSProperties> = {
  shell:   { display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter',-apple-system,sans-serif" },
  main:    { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topbar:  { background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 },
  content: { flex: 1, padding: '32px', maxWidth: '780px', width: '100%' },
  card:    { background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' },
};

const DOC_CONFIG = [
  { type: 'government_id',        label: 'Government ID',          desc: "Driver's licence, passport, or provincial ID",     required: true  },
  { type: 'profile_photo',        label: 'Profile Photo',          desc: 'A clear, professional headshot',                   required: true  },
  { type: 'background_check',     label: 'Background Check',       desc: 'Criminal record check results',                    required: true  },
  { type: 'insurance_certificate',label: 'Insurance Certificate',  desc: 'Proof of liability insurance',                     required: false },
  { type: 'certification',        label: 'Trade Certifications',   desc: 'Relevant trade licences or certifications',        required: false },
];

const statusStyle: Record<string, { label: string; color: string; bg: string }> = {
  verified:  { label: 'Verified',   color: '#059669', bg: '#ECFDF5' },
  submitted: { label: 'Submitted',  color: '#D97706', bg: '#FFFBEB' },
  expired:   { label: 'Expired',    color: '#DC2626', bg: '#FEF2F2' },
  required:  { label: 'Required',   color: '#6B7280', bg: '#F9FAFB' },
};

interface Doc { id: string; type: string; url: string; status: string; created_at: string; }

export default function DocumentsPage() {
  const [docs, setDocs]         = useState<Doc[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const refs = useRef<Record<string, HTMLInputElement | null>>({});
  const supabase = createClient();

  useEffect(() => { fetchDocs(); }, []);

  const fetchDocs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data } = await supabase.from('documents').select('*').eq('provider_id', user.id).order('created_at', { ascending: false });
    setDocs(data || []);
    setLoading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) { toast.error('File too large (max 20 MB)'); return; }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    setUploading(docType);
    try {
      const ext  = file.name.split('.').pop();
      const path = `${user.id}/${docType}/${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from('provider-documents').upload(path, file, { upsert: true });
      if (upErr) { toast.error(upErr.message); return; }

      const { data: urlData } = supabase.storage.from('provider-documents').getPublicUrl(path);
      await supabase.from('documents').upsert({ provider_id: user.id, type: docType, url: urlData.publicUrl, status: 'submitted' }, { onConflict: 'provider_id,type' });
      toast.success(`${docType.replace(/_/g,' ')} uploaded`);
      fetchDocs();
    } finally {
      setUploading(null);
      if (refs.current[docType]) refs.current[docType]!.value = '';
    }
  };

  const getDoc = (type: string) => docs.find(d => d.type === type);

  return (
    <div style={S.shell}>
      <DashboardSidebar />
      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Documents</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>Upload & manage your files</div>
          </div>
        </div>
        <div style={S.content}>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '60px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #E2E8F0', borderTopColor: '#3B82F6', animation: 'spin 0.7s linear infinite' }} />
            </div>
          ) : (
            <div style={S.card}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>Required & Optional Documents</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Accepted: PDF, JPG, PNG, HEIC — max 20 MB each</div>
              </div>
              {DOC_CONFIG.map((cfg, i) => {
                const doc = getDoc(cfg.type);
                const ss  = doc ? (statusStyle[doc.status] || statusStyle.submitted) : statusStyle.required;
                const isUp = uploading === cfg.type;
                return (
                  <div key={cfg.type} style={{ padding: '18px 24px', borderBottom: i < DOC_CONFIG.length - 1 ? '1px solid #F8FAFC' : 'none', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {/* Icon */}
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: doc ? '#ECFDF5' : '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={doc ? '#059669' : '#94A3B8'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 600, color: '#111' }}>{cfg.label}</span>
                        {cfg.required && <span style={{ fontSize: '10px', color: '#DC2626', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Required</span>}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94A3B8' }}>{cfg.desc}</div>
                      {doc && <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '3px' }}>Uploaded {new Date(doc.created_at).toLocaleDateString()}</div>}
                    </div>
                    {/* Status + action */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '20px', background: ss.bg, color: ss.color }}>{ss.label}</span>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png,.heic,.heif" ref={el => { refs.current[cfg.type] = el; }} onChange={e => handleUpload(e, cfg.type)} style={{ display: 'none' }} />
                      <button
                        onClick={() => refs.current[cfg.type]?.click()}
                        disabled={isUp}
                        style={{ padding: '7px 14px', borderRadius: '7px', border: '1px solid #E2E8F0', background: '#fff', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#374151', fontFamily: 'inherit', opacity: isUp ? 0.5 : 1 }}
                      >
                        {isUp ? 'Uploading…' : doc ? 'Replace' : 'Upload'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
