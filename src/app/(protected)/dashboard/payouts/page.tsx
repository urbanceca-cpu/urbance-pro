'use client';
import { useState, useEffect, useCallback } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { fetchEarnings, getCurrentUser, type ProviderJob, type EarningsSummary, netAmount } from '@/lib/jobs-api';
import { createClient } from '@/lib/supabase/client';

function Sk({ w, h = 14 }: { w: string; h?: number }) {
  return <div style={{ width: w, height: `${h}px`, borderRadius: '7px', background: '#F1F5F9', animation: 'sk 1.4s infinite', display: 'inline-block' }} />;
}

function StatCard({ label, value, sub, loading }: { label: string; value: string; sub: string; loading: boolean }) {
  return (
    <div style={{ background: '#FFF', borderRadius: '14px', border: '1px solid #F3F4F6', padding: '20px 22px', boxShadow: '0 1px 4px rgba(17,17,17,0.04)', flex: '1', minWidth: '140px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</div>
      {loading ? <Sk w="80px" h={24} /> : <div style={{ fontSize: '26px', fontWeight: 800, color: '#111', letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>}
      <div style={{ fontSize: '11.5px', color: '#9CA3AF', marginTop: '5px' }}>{sub}</div>
    </div>
  );
}

function JobRow({ job }: { job: ProviderJob }) {
  const net = netAmount(job.final_amount ?? job.payout_amount);
  const gross = job.final_amount ?? job.payout_amount;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 80px 80px', alignItems: 'center', padding: '13px 20px', gap: '8px', borderBottom: '1px solid #F8FAFC' }}>
      <div>
        <div style={{ fontSize: '13px', color: '#111', fontWeight: 500 }}>{job.service_name}</div>
        <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{job.service_city} - {job.scheduled_date}</div>
      </div>
      <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: '#ECFDF5', color: '#059669', width: 'fit-content' }}>Completed</span>
      <span style={{ fontSize: '12.5px', color: '#9CA3AF', textDecoration: 'line-through', textAlign: 'right' }}>${gross.toFixed(0)}</span>
      <span style={{ fontSize: '13px', fontWeight: 700, color: '#111', textAlign: 'right' }}>${net.toFixed(0)}</span>
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

  const fmt = (n: number) => `$${n.toFixed(2)}`;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <DashboardSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ background: '#FFF', borderBottom: '1px solid #F3F4F6', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Earnings &amp; Payouts</div>
        </header>

        <main style={{ flex: 1, padding: '32px 40px', maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {error && <div style={{ padding: '14px 18px', borderRadius: '10px', background: '#FEF2F2', border: '1px solid #FECACA', fontSize: '13px', color: '#DC2626' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <StatCard label="Total Earned" value={loading ? '-' : fmt(summary?.totalNet ?? 0)} sub="After 12% platform fee" loading={loading} />
            <StatCard label="This Month" value={loading ? '-' : fmt(summary?.thisMonthNet ?? 0)} sub="Current calendar month" loading={loading} />
            <StatCard label="In Progress" value={loading ? '-' : fmt(summary?.inProgressNet ?? 0)} sub="Assigned + en route" loading={loading} />
          </div>

          <div style={{ background: '#FFF', borderRadius: '14px', border: '1px solid #F3F4F6', boxShadow: '0 1px 4px rgba(17,17,17,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111' }}>Completed Jobs</div>
              <div style={{ fontSize: '11.5px', color: '#9CA3AF' }}>12% platform fee applied</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 90px 80px 80px', padding: '8px 20px', gap: '8px', background: '#F8FAFC' }}>
              {['Job', 'Status', 'Gross', 'Your Pay'].map(h => (
                <div key={h} style={{ fontSize: '10.5px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: h === 'Gross' || h === 'Your Pay' ? 'right' : 'left' }}>{h}</div>
              ))}
            </div>
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 80px 80px', padding: '13px 20px', gap: '8px', borderBottom: '1px solid #F8FAFC', alignItems: 'center' }}>
                  <Sk w="120px" /><Sk w="55px" /><Sk w="40px" /><Sk w="40px" />
                </div>
              ))
            ) : (summary?.completedJobs ?? []).length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>💰</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>No completed jobs yet</div>
                <a href="/dashboard/jobs" style={{ fontSize: '13px', color: '#2F80ED', fontWeight: 600, textDecoration: 'none' }}>Browse available jobs</a>
              </div>
            ) : (
              (summary?.completedJobs ?? []).map(j => <JobRow key={j.id} job={j} />)
            )}
          </div>

          <div style={{ background: '#FFF', borderRadius: '14px', border: '1px solid #F3F4F6', boxShadow: '0 1px 4px rgba(17,17,17,0.04)', overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #F8FAFC' }}>
              <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111' }}>Payout Method</div>
              <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>Payments issued within 3-5 business days after job completion.</div>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {(['etransfer', 'direct'] as const).map(m => (
                  <button key={m} onClick={() => setMethod(m)} style={{ flex: 1, padding: '10px', borderRadius: '9px', border: method === m ? '2px solid #111' : '1px solid #E5E7EB', cursor: 'pointer', background: method === m ? '#F8FAFC' : '#FFF', fontSize: '13px', fontWeight: method === m ? 700 : 500, color: method === m ? '#111' : '#6B7280', fontFamily: 'inherit' }}>
                    {m === 'etransfer' ? 'e-Transfer' : 'Direct Deposit'}
                  </button>
                ))}
              </div>
              {method === 'etransfer' ? (
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>e-Transfer Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="payments@example.com" style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13.5px', color: '#111', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#FAFAFA' }} />
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  {[{ label: 'Institution #', key: 'institution', ph: '001' }, { label: 'Transit #', key: 'transit', ph: '12345' }, { label: 'Account #', key: 'account', ph: '1234567' }].map(f => (
                    <div key={f.key}>
                      <label style={{ fontSize: '11px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>{f.label}</label>
                      <input value={bank[f.key as keyof typeof bank]} onChange={e => setBank(b => ({ ...b, [f.key]: e.target.value }))} placeholder={f.ph} style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '13.5px', color: '#111', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: '#FAFAFA' }} />
                    </div>
                  ))}
                </div>
              )}
              <button disabled={saving} onClick={handleSave} style={{ marginTop: '16px', padding: '10px 24px', borderRadius: '9px', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', background: saved ? '#059669' : '#111', color: '#FFF', fontSize: '13px', fontWeight: 700, fontFamily: 'inherit', transition: 'background 0.2s' }}>
                {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Payout Method'}
              </button>
            </div>
          </div>
        </main>
      </div>
      <style>{`@keyframes sk{0%{opacity:1}50%{opacity:.4}100%{opacity:1}}`}</style>
    </div>
  );
}
