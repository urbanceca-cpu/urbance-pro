'use client';
import { useState, useEffect, useCallback } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { fetchEarnings, getCurrentUser, type ProviderJob, type EarningsSummary, netAmount } from '@/lib/jobs-api';
import { createClient } from '@/lib/supabase/client';

function Skeleton({ w, h = 14 }: { w: string; h?: number }) {
  return <div style={{ width: w, height: `${h}px`, borderRadius: '6px', background: '#E2E8F0', animation: 'shimmer 1.6s infinite', display: 'inline-block' }} />;
}

function StatCard({ label, value, sub, accent, loading }: { label: string; value: string; sub: string; accent: string; loading: boolean }) {
  return (
    <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '22px', boxShadow: '0 1px 3px rgba(15,23,42,0.05)', flex: 1, minWidth: '160px' }}>
      <div style={{ fontSize: '10.5px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '12px' }}>{label}</div>
      {loading ? <Skeleton w="80px" h={26} /> : <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</div>}
      <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '6px' }}>{sub}</div>
    </div>
  );
}

function JobRow({ job, isLast }: { job: ProviderJob; isLast: boolean }) {
  const net = netAmount(job.final_amount ?? job.payout_amount);
  const gross = job.final_amount ?? job.payout_amount;
  const fee = gross - net;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 88px 76px 76px 84px', alignItems: 'center', padding: '14px 22px', gap: '8px', borderBottom: isLast ? 'none' : '1px solid #F8FAFC' }}>
      <div>
        <div style={{ fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>{job.service_name}</div>
        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>{job.service_city} · {job.scheduled_date}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10B981' }} />
        <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#10B981' }}>Paid</span>
      </div>
      <span style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'right' }}>${gross.toFixed(0)}</span>
      <span style={{ fontSize: '12px', color: '#EF4444', textAlign: 'right' }}>-${fee.toFixed(0)}</span>
      <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A', textAlign: 'right' }}>${net.toFixed(0)}</span>
    </div>
  );
}

export default function PayoutsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [method, setMethod] = useState<'etransfer' | 'direct'>('etransfer');
  const [email, setEmail] = useState('');
  const [bank, setBank] = useState({ institution: '', transit: '', account: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = useCallback(async (uid: string) => {
    setError(null);
    const res = await fetchEarnings(uid);
    if (res.error) { setError(res.error); return; }
    setSummary(res.data);
  }, []);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) return;
      const { data: app } = await supabase.from('provider_applications').select('pricing_availability').eq('user_id', user.id).maybeSingle();
      if (app?.pricing_availability) {
        const pa = app.pricing_availability as Record<string, unknown>;
        if (pa.payout_method === 'direct') {
          setMethod('direct');
          const bd = (pa.bank_details as Record<string, string>) || {};
          setBank({ institution: bd.institution || '', transit: bd.transit || '', account: bd.account || '' });
        } else {
          setEmail((pa.etransfer_email as string) || '');
        }
      }
      await load(user.id);
      setLoading(false);
    })();
  }, [load]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSave() {
    setSaving(true);
    const user = await getCurrentUser();
    if (!user) { setSaving(false); return; }
    const { data: app } = await supabase.from('provider_applications').select('pricing_availability').eq('user_id', user.id).maybeSingle();
    const pa: Record<string, unknown> = { ...((app?.pricing_availability as Record<string, unknown>) || {}), payout_method: method };
    if (method === 'etransfer') pa.etransfer_email = email;
    else pa.bank_details = bank;
    await supabase.from('provider_applications').update({ pricing_availability: pa }).eq('user_id', user.id);
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const fmt = (n: number) => '$' + n.toFixed(2);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F1F5F9', fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <DashboardSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 36px', height: '64px', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>Earnings & Payouts</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Track your income and manage payment details</div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '28px 36px', maxWidth: '960px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {error && (
            <div style={{ padding: '14px 18px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '13px', color: '#DC2626' }}>{error}</div>
          )}

          {/* Stat cards */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <StatCard label="Total Earned"  value={loading ? '-' : fmt(summary?.totalNet ?? 0)}       sub="After 12% platform fee"    accent="#8B5CF6" loading={loading} />
            <StatCard label="This Month"    value={loading ? '-' : fmt(summary?.thisMonthNet ?? 0)}   sub="Current calendar month"    accent="#3B82F6" loading={loading} />
            <StatCard label="In Progress"   value={loading ? '-' : fmt(summary?.inProgressNet ?? 0)} sub="Assigned + en route jobs"  accent="#F59E0B" loading={loading} />
          </div>

          {/* Fee explainer */}
          <div style={{ background: 'rgba(59,130,246,0.05)', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.15)', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <span style={{ fontSize: '12.5px', color: '#334155', lineHeight: 1.5 }}>
              Urbance charges a <strong>12% platform fee</strong> on all jobs. You keep <strong>88%</strong> of each job value. Payments are issued within 3–5 business days after completion.
            </span>
          </div>

          {/* Completed jobs table */}
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(15,23,42,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Completed Jobs</div>
              {!loading && summary && summary.completedJobs.length > 0 && (
                <div style={{ fontSize: '12px', color: '#94A3B8' }}>{summary.completedJobs.length} job{summary.completedJobs.length !== 1 ? 's' : ''}</div>
              )}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 88px 76px 76px 84px', padding: '9px 22px', gap: '8px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
              {[{ h: 'Job', right: false }, { h: 'Status', right: false }, { h: 'Gross', right: true }, { h: 'Fee', right: true }, { h: 'You Earn', right: true }].map(({ h, right }) => (
                <div key={h} style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: right ? 'right' : 'left' }}>{h}</div>
              ))}
            </div>
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 88px 76px 76px 84px', padding: '14px 22px', gap: '8px', borderBottom: '1px solid #F8FAFC', alignItems: 'center' }}>
                  <div><Skeleton w="120px" h={13} /><br /><Skeleton w="80px" h={10} /></div>
                  <Skeleton w="50px" /><Skeleton w="40px" /><Skeleton w="35px" /><Skeleton w="45px" />
                </div>
              ))
            ) : (summary?.completedJobs ?? []).length === 0 ? (
              <div style={{ padding: '56px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '36px', marginBottom: '14px' }}>💰</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>No completed jobs yet</div>
                <a href="/dashboard/jobs" style={{ fontSize: '13px', color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>Browse available jobs →</a>
              </div>
            ) : (
              (summary?.completedJobs ?? []).map((j, i, arr) => <JobRow key={j.id} job={j} isLast={i === arr.length - 1} />)
            )}
          </div>

          {/* Payout method */}
          <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(15,23,42,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 22px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Payout Method</div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Where should we send your earnings?</div>
            </div>
            <div style={{ padding: '22px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                {(['etransfer', 'direct'] as const).map(m => (
                  <button key={m} onClick={() => setMethod(m)} style={{
                    flex: 1, padding: '12px', borderRadius: '10px',
                    border: method === m ? '2px solid #0F172A' : '1px solid #E2E8F0',
                    cursor: 'pointer', background: method === m ? '#F8FAFC' : '#FFFFFF',
                    fontSize: '13px', fontWeight: method === m ? 700 : 500,
                    color: method === m ? '#0F172A' : '#64748B', fontFamily: 'inherit',
                    transition: 'all 0.15s',
                  }}>
                    {m === 'etransfer' ? '📧  e-Transfer' : '🏦  Direct Deposit'}
                  </button>
                ))}
              </div>

              {method === 'etransfer' ? (
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>e-Transfer Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="payments@example.com" style={{ width: '100%', padding: '10px 14px', borderRadius: '9px', border: '1px solid #E2E8F0', fontSize: '13.5px', color: '#0F172A', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#FAFAFA', transition: 'border-color 0.15s' }}
                    onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#3B82F6'; }}
                    onBlur={e => { (e.target as HTMLInputElement).style.borderColor = '#E2E8F0'; }}
                  />
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                  {[{ label: 'Institution #', key: 'institution', ph: '001' }, { label: 'Transit #', key: 'transit', ph: '12345' }, { label: 'Account #', key: 'account', ph: '1234567' }].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>{f.label}</label>
                      <input value={bank[f.key as keyof typeof bank]} onChange={e => setBank(b => ({ ...b, [f.key]: e.target.value }))} placeholder={f.ph} style={{ width: '100%', padding: '10px 14px', borderRadius: '9px', border: '1px solid #E2E8F0', fontSize: '13.5px', color: '#0F172A', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#FAFAFA' }} />
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button disabled={saving} onClick={handleSave} style={{
                  padding: '10px 28px', borderRadius: '9px', border: 'none',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  background: saved ? '#10B981' : '#0F172A',
                  color: '#FFF', fontSize: '13px', fontWeight: 700, fontFamily: 'inherit', transition: 'background 0.2s',
                }}>
                  {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Payout Method'}
                </button>
                {saved && <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 600 }}>Changes saved successfully</span>}
              </div>
            </div>
          </div>
        </main>
      </div>
      <style>{`@keyframes shimmer{0%{opacity:1}50%{opacity:.45}100%{opacity:1}}`}</style>
    </div>
  );
}
