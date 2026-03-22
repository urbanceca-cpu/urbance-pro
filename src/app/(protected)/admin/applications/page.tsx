'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import type { ProviderApplication } from '@/lib/types';

const STATUS_STYLES: Record<string, { label: string; color: string; bg: string; border: string }> = {
  draft:        { label: 'Draft',        color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB' },
  submitted:    { label: 'Submitted',    color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
  under_review: { label: 'Under Review', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE' },
  approved:     { label: 'Approved',     color: '#059669', bg: '#ECFDF5', border: '#A7F3D0' },
  rejected:     { label: 'Rejected',     color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
};

const FILTERS = ['submitted', 'under_review', 'approved', 'rejected', 'draft', 'all'] as const;

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.draft;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '5px',
      padding: '4px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 600,
      color: s.color, backgroundColor: s.bg, border: `1px solid ${s.border}`,
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: s.color, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 3px' }}>{label}</p>
      <p style={{ fontSize: '13px', fontWeight: 600, color: '#374151', margin: 0 }}>{value}</p>
    </div>
  );
}

function Chip({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      padding: '3px 10px', borderRadius: '100px', fontSize: '12px', fontWeight: 500,
      backgroundColor: color + '15', color, border: `1px solid ${color}30`,
    }}>{label}</span>
  );
}

function ActionBtn({ label, color, bg, loading, onClick }: {
  label: string; color: string; bg: string; loading: boolean; onClick: () => void;
}) {
  return (
    <button onClick={onClick} disabled={loading} style={{
      padding: '7px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
      backgroundColor: bg, color, border: `1.5px solid ${color}40`,
      cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
      fontFamily: 'inherit', transition: 'opacity 0.15s',
    }}>
      {loading ? '…' : label}
    </button>
  );
}

export default function AdminApplications() {
  const [applications, setApplications] = useState<ProviderApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('submitted');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadApplications();
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadApplications() {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      if (!profile || profile.role !== 'admin' && profile.role !== 'super_admin') { router.push('/dashboard'); return; }

      let query = supabase.from('provider_applications').select('*');
      if (filter !== 'all') query = query.eq('status', filter);
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setApplications((data ?? []) as ProviderApplication[]);
    } catch (err) {
      console.error('Error loading applications:', err);
      toast.error('Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: 'approved' | 'rejected' | 'under_review') {
    setActionLoading(id + newStatus);
    try {
      const { error } = await supabase.from('provider_applications').update({ status: newStatus }).eq('id', id);
      if (error) throw error;
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
      toast.success(`Application ${newStatus.replace('_', ' ')}`);
    } catch (err) {
      console.error(err);
      toast.error('Action failed');
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111111', margin: '0 0 6px', letterSpacing: '-0.03em' }}>
            Applications
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
            Review and manage provider applications
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {FILTERS.map(f => {
            const active = filter === f;
            const s = STATUS_STYLES[f] ?? { color: '#6B7280', bg: '#F9FAFB', border: '#E5E7EB' };
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '7px 16px', borderRadius: '100px', fontSize: '13px', fontWeight: 600,
                border: `1.5px solid ${active ? s.color : '#E5E7EB'}`,
                backgroundColor: active ? s.bg : '#FFFFFF',
                color: active ? s.color : '#6B7280',
                cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
              }}>
                {f === 'all' ? 'All' : (STATUS_STYLES[f]?.label ?? f)}{' '}
                <span style={{ opacity: 0.7 }}>
                  {f === 'all'
                    ? applications.length
                    : applications.filter(a => a.status === f).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Loading */}
        {isLoading ? (
          <div style={{ padding: '60px 0', textAlign: 'center', color: '#9CA3AF', fontSize: '14px' }}>
            Loading applications…
          </div>
        ) : applications.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
            <p style={{ fontSize: '15px', color: '#6B7280', margin: 0 }}>No applications found</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {applications.map(app => {
              const name    = app.basic_info?.full_legal_name || '—';
              const biz     = app.basic_info?.business_name;
              const email   = app.basic_info?.email || '—';
              const phone   = app.basic_info?.phone || '—';
              const city    = app.basic_info?.city || '—';
              const cat     = app.services_coverage?.primary_category || '—';
              const svcs    = app.services_coverage?.sub_services ?? [];
              const areas   = app.services_coverage?.service_areas ?? [];
              const yrs     = app.experience_standards?.years_experience || '—';
              const insured = app.experience_standards?.is_insured;
              const licensed = app.experience_standards?.is_licensed;
              const bgCheck  = app.experience_standards?.background_check;
              const pricing  = app.pricing_availability?.pricing_model || '—';
              const minJob   = app.pricing_availability?.min_job_price;
              const avail    = app.pricing_availability?.availability ?? [];
              const submitted = new Date(app.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'short', day: 'numeric' });

              return (
                <div key={app.id} style={{
                  background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EEEFF1',
                  overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                }}>
                  {/* Card header */}
                  <div style={{ padding: '20px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <span style={{ fontSize: '17px', fontWeight: 700, color: '#111111' }}>{name}</span>
                        {biz && <span style={{ fontSize: '13px', color: '#6B7280', background: '#F3F4F6', padding: '2px 8px', borderRadius: '6px' }}>{biz}</span>}
                      </div>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#6B7280', flexWrap: 'wrap' }}>
                        <span>✉️ {email}</span>
                        <span>📞 {phone}</span>
                        <span>📍 {city}</span>
                        <span style={{ color: '#9CA3AF' }}>Applied {submitted}</span>
                      </div>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>

                  {/* Details grid */}
                  <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
                    <Detail label="Category" value={cat} />
                    <Detail label="Experience" value={`${yrs} yrs`} />
                    <Detail label="Pricing Model" value={pricing} />
                    {minJob && <Detail label="Min Job Price" value={`$${minJob}`} />}
                    <Detail label="Insured" value={insured === 'yes' ? '✅ Yes' : insured === 'no' ? '❌ No' : '—'} />
                    <Detail label="Licensed" value={licensed === 'yes' ? '✅ Yes' : licensed === 'no' ? '❌ No' : '—'} />
                    <Detail label="Background Check" value={bgCheck === 'yes' ? '✅ Consented' : bgCheck === 'no' ? '❌ No' : '—'} />
                  </div>

                  {/* Services + areas chips */}
                  {(svcs.length > 0 || areas.length > 0 || avail.length > 0) && (
                    <div style={{ padding: '0 24px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {svcs.length > 0 && (
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Services</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                            {svcs.map(s => <Chip key={s} label={s} color="#2F80ED" />)}
                          </div>
                        </div>
                      )}
                      {areas.length > 0 && (
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Service Areas</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                            {areas.map(a => <Chip key={a} label={a} color="#7C3AED" />)}
                          </div>
                        </div>
                      )}
                      {avail.length > 0 && (
                        <div>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Availability</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                            {avail.map(a => <Chip key={a} label={a} color="#059669" />)}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ padding: '14px 24px', background: '#F9FAFB', borderTop: '1px solid #F3F4F6', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {app.status === 'submitted' && (
                      <>
                        <ActionBtn label="Mark Under Review" color="#7C3AED" bg="#F5F3FF"
                          loading={actionLoading === app.id + 'under_review'}
                          onClick={() => handleStatusChange(app.id, 'under_review')} />
                        <ActionBtn label="✅ Approve" color="#059669" bg="#ECFDF5"
                          loading={actionLoading === app.id + 'approved'}
                          onClick={() => handleStatusChange(app.id, 'approved')} />
                        <ActionBtn label="❌ Reject" color="#DC2626" bg="#FEF2F2"
                          loading={actionLoading === app.id + 'rejected'}
                          onClick={() => handleStatusChange(app.id, 'rejected')} />
                      </>
                    )}
                    {app.status === 'under_review' && (
                      <>
                        <ActionBtn label="✅ Approve" color="#059669" bg="#ECFDF5"
                          loading={actionLoading === app.id + 'approved'}
                          onClick={() => handleStatusChange(app.id, 'approved')} />
                        <ActionBtn label="❌ Reject" color="#DC2626" bg="#FEF2F2"
                          loading={actionLoading === app.id + 'rejected'}
                          onClick={() => handleStatusChange(app.id, 'rejected')} />
                      </>
                    )}
                    {(app.status === 'approved' || app.status === 'rejected') && (
                      <ActionBtn label="↩ Revert to Under Review" color="#6B7280" bg="#F9FAFB"
                        loading={actionLoading === app.id + 'under_review'}
                        onClick={() => handleStatusChange(app.id, 'under_review')} />
                    )}
                    <span style={{ fontSize: '12px', color: '#9CA3AF', marginLeft: 'auto' }}>
                      ID: {app.id.slice(0, 8)}…
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
