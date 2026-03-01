'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { toast } from 'sonner';

const S: Record<string, React.CSSProperties> = {
  shell:   { display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter',-apple-system,sans-serif" },
  main:    { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topbar:  { background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 },
  content: { flex: 1, padding: '32px', maxWidth: '680px', width: '100%' },
  card:    { background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' },
  label:   { fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' },
  field:   { fontSize: '14px', color: '#0F172A', padding: '10px 0', borderBottom: '1px solid #F1F5F9' },
  input:   { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', color: '#0F172A', outline: 'none', boxSizing: 'border-box' as const, fontFamily: "'Inter',-apple-system,sans-serif", background: '#FAFAFA' },
  btnPrimary: { padding: '9px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: '#0F172A', color: '#FFFFFF', fontFamily: 'inherit', transition: 'opacity 0.15s' },
  btnOutline: { padding: '9px 20px', borderRadius: '8px', border: '1px solid #E2E8F0', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: '#fff', color: '#374151', fontFamily: 'inherit' },
};

export default function ProfilePage() {
  const [appData, setAppData] = useState<Record<string, unknown> | null>(null);
  const [user, setUser]       = useState<{ id: string; email?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving]   = useState(false);
  const [form, setForm] = useState({ full_legal_name: '', phone: '', city: '', address: '' });
  const router   = useRouter();
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push('/login'); return; }
      setUser(u);
      const { data } = await supabase.from('provider_applications').select('*').eq('user_id', u.id).maybeSingle();
      setAppData(data);
      const bi = (data?.basic_info as Record<string, string>) || {};
      setForm({ full_legal_name: bi.full_legal_name || '', phone: bi.phone || '', city: bi.city || '', address: bi.address || '' });
      setIsLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await supabase.from('provider_applications')
      .update({ basic_info: { ...((appData?.basic_info as object) || {}), ...form } })
      .eq('user_id', user!.id);
    if (error) { toast.error('Failed to save'); } else { toast.success('Profile saved'); setIsEditing(false); }
    setIsSaving(false);
  };

  if (isLoading) return (
    <div style={S.shell}>
      <DashboardSidebar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #E2E8F0', borderTopColor: '#3B82F6', animation: 'spin 0.7s linear infinite' }} />
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const bi = (appData?.basic_info as Record<string, string>) || {};
  const name = bi.full_legal_name || user?.email?.split('@')[0] || 'Provider';
  const initials = name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();

  const fields = [
    { key: 'full_legal_name', label: 'Full Legal Name',   value: bi.full_legal_name || '—' },
    { key: 'phone',           label: 'Phone Number',      value: bi.phone           || '—' },
    { key: 'city',            label: 'City',               value: bi.city            || '—' },
    { key: 'address',         label: 'Address',            value: bi.address         || '—' },
  ];

  return (
    <div style={S.shell}>
      <DashboardSidebar />
      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>Profile</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>Manage your information</div>
          </div>
          {!isEditing && (
            <button style={S.btnPrimary} onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>

        <div style={S.content}>
          {/* Avatar card */}
          <div style={{ ...S.card, padding: '24px', display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg,#3B82F6,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '18px', flexShrink: 0 }}>{initials}</div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A' }}>{name}</div>
              <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>{user?.email}</div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', background: '#ECFDF5', color: '#059669', fontWeight: 600 }}>
                {(appData?.status as string) || 'draft'}
              </span>
            </div>
          </div>

          {/* Info card */}
          <div style={S.card}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Personal Information</div>
            </div>

            {!isEditing ? (
              <div style={{ padding: '8px 24px 20px' }}>
                {fields.map(f => (
                  <div key={f.key} style={{ padding: '14px 0', borderBottom: '1px solid #F8FAFC', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ width: '140px', fontSize: '12px', fontWeight: 600, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', paddingTop: '2px', flexShrink: 0 }}>{f.label}</div>
                    <div style={{ fontSize: '14px', color: '#0F172A' }}>{f.value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '20px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  {fields.map(f => (
                    <div key={f.key}>
                      <label style={S.label}>{f.label}</label>
                      <input style={S.input} value={form[f.key as keyof typeof form]}
                        onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                  <button style={S.btnPrimary} onClick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                  <button style={S.btnOutline} onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
