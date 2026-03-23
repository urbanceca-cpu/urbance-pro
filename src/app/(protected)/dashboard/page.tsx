'use client';
import { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { createClient } from '@/lib/supabase/client';
import {
  fetchDashboardSummary,
  fetchMyJobs,
  type DashboardSummary,
  type ProviderJob,
} from '@/lib/jobs-api';

function Sk({ w, h = 14 }: { w: string; h?: number }) {
  return (
    <div style={{ width: w, height: `${h}px`, borderRadius: '8px', background: '#F1F5F9', animation: 'sk 1.4s infinite', display: 'inline-block' }} />
  );
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  approved:     { label: 'Approved',     color: '#059669', bg: '#ECFDF5', dot: '#059669' },
  submitted:    { label: 'Under Review', color: '#D97706', bg: '#FFFBEB', dot: '#F59E0B' },
  under_review: { label: 'Under Review', color: '#D97706', bg: '#FFFBEB', dot: '#F59E0B' },
  draft:        { label: 'Draft',        color: '#6B7280', bg: '#F9FAFB', dot: '#9CA3AF' },
  rejected:     { label: 'Rejected',     color: '#DC2626', bg: '#FEF2F2', dot: '#DC2626' },
};

const JOB_STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  assigned:  { label: 'Assigned',    color: '#2F80ED', bg: '#EBF3FD' },
  enroute:   { label: 'In Progress', color: '#7C3AED', bg: '#F5F3FF' },
  completed: { label: 'Completed',   color: '#6B7280', bg: '#F3F4F6' },
  accepted:  { label: 'Available',   color: '#059669', bg: '#ECFDF5' },
};

export default function OverviewPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [appStatus, setAppStatus] = useState<string>('draft');
  const [profileName, setProfileName] = useState('there');
  const [profileCity, setProfileCity] = useState('');
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [recentJobs, setRecentJobs] = useState<ProviderJob[]>([]);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);

      const { data: profile } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).maybeSingle();
      if (profile?.full_name) setProfileName(profile.full_name.split(' ')[0]);

      const { data: app } = await supabase.from('provider_applications').select('status, basic_info, pricing_availability').eq('user_id', user.id).maybeSingle();
      if (app) {
        setAppStatus(app.status ?? 'draft');
        const bi = app.basic_info as Record<string, string> | null;
        if (bi?.city) setProfileCity(bi.city);
        const pa = app.pricing_availability as Record<string, unknown> | null;
        setAvailable((pa?.available as boolean) ?? false);
      }

      const [sumRes, myJobsRes] = await Promise.all([
        fetchDashboardSummary(user.id),
        fetchMyJobs(user.id),
      ]);
      if (sumRes.data) setSummary(sumRes.data);
      if (myJobsRes.data) setRecentJobs(myJobsRes.data.slice(0, 5));
      setLoading(false);
    })();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleAvail = async () => {
    const next = !available;
    setAvailable(next);
    if (!userId) return;
    const { data: app } = await supabase.from('provider_applications').select('pricing_availability').eq('user_id', userId).maybeSingle();
    const pa = { ...((app?.pricing_availability as Record<string, unknown>) || {}), available: next };
    await supabase.from('provider_applications').update({ pricing_availability: pa }).eq('user_id', userId);
  };

  const st = STATUS_MAP[appStatus] ?? STATUS_MAP.draft;

  const kpis = [
    { label: 'Jobs Completed', v: loading ? null : String(summary?.completedCount ?? 0), sub: 'All time',           col: '#2F80ED', bg: '#EBF3FD' },
    { label: 'Active Jobs',    v: loading ? null : String(summary?.activeCount ?? 0),    sub: 'Assigned / en route', col: '#7C3AED', bg: '#F5F3FF' },
    { label: 'Total Earnings', v: loading ? null : `$${(summary?.totalEarned ?? 0).toFixed(2)}`, sub: 'After 12% fee', col: '#059669', bg: '#ECFDF5' },
    { label: 'Available Jobs', v: loading ? null : String(summary?.availableCount ?? 0), sub: 'Ready to accept',    col: '#D97706', bg: '#FFFBEB' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <DashboardSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ background: '#FFF', borderBottom: '1px solid #F3F4F6', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, flexShrink: 0 }}>
          <div>
            {loading ? <Sk w="160px" h={16} /> : <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Welcome back, {profileName} {String.fromCodePoint(0x1F44B)}</div>}
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{profileCity || 'Provider Dashboard'}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', background: st.bg }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: st.dot }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: st.color }}>{st.label}</span>
              </div>
            )}
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EBF3FD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#2F80ED', flexShrink: 0 }}>
              {profileName[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '40px', maxWidth: '1040px', width: '100%' }}>
          {!loading && appStatus !== 'approved' && (
            <div style={{ marginBottom: '24px', background: '#FFF', borderRadius: '16px', border: '1px solid #F3F4F6', padding: '22px 26px', boxShadow: '0 1px 4px rgba(17,17,17,0.04)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '20px' }}>
                {appStatus === 'submitted' || appStatus === 'under_review' ? String.fromCodePoint(0x23F3) : appStatus === 'rejected' ? String.fromCodePoint(0x274C) : String.fromCodePoint(0x1F4DD)}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>
                  {appStatus === 'submitted' || appStatus === 'under_review' ? 'Your application is under review' : appStatus === 'rejected' ? 'Application not approved' : 'Complete your application'}
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6 }}>
                  {appStatus === 'submitted' || appStatus === 'under_review' ? "Our team reviews within 3-5 business days. You'll receive an email once approved." : appStatus === 'rejected' ? 'Please contact support@urbance.ca to learn next steps.' : 'Finish your application to unlock full dashboard access.'}
                </div>
              </div>
            </div>
          )}

          {!loading && appStatus === 'approved' && (
            <div style={{ marginBottom: '24px', background: '#FFF', borderRadius: '16px', border: '1px solid #F3F4F6', padding: '16px 24px', boxShadow: '0 1px 4px rgba(17,17,17,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111' }}>Availability</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                  {available ? 'Visible - you can receive new jobs' : 'Hidden from new job requests'}
                </div>
              </div>
              <button onClick={toggleAvail} style={{ width: '46px', height: '25px', borderRadius: '100px', border: 'none', cursor: 'pointer', background: available ? '#2F80ED' : '#E5E7EB', position: 'relative', transition: 'background 0.18s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: '3px', left: available ? '24px' : '3px', width: '19px', height: '19px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.18)', transition: 'left 0.18s' }} />
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }}>
            {kpis.map(k => (
              <div key={k.label}
                style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #F3F4F6', padding: '20px 22px', boxShadow: '0 1px 4px rgba(17,17,17,0.04)', cursor: 'default', transition: 'transform 0.14s,box-shadow 0.14s' }}
                onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'translateY(-2px)'; d.style.boxShadow = '0 6px 20px rgba(17,17,17,0.07)'; }}
                onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.transform = 'translateY(0)'; d.style.boxShadow = '0 1px 4px rgba(17,17,17,0.04)'; }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: k.col, opacity: 0.7 }} />
                </div>
                {k.v === null ? <Sk w="56px" h={22} /> : <div style={{ fontSize: '24px', fontWeight: 800, color: '#111', letterSpacing: '-0.03em', lineHeight: 1 }}>{k.v}</div>}
                <div style={{ fontSize: '11.5px', color: '#9CA3AF', marginTop: '5px' }}>{k.sub}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginTop: '8px' }}>{k.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 296px', gap: '20px', alignItems: 'start' }}>
            <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #F3F4F6', boxShadow: '0 1px 4px rgba(17,17,17,0.04)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>Recent Jobs</div>
                <a href="/dashboard/jobs" style={{ fontSize: '12px', color: '#2F80ED', fontWeight: 600, textDecoration: 'none' }}>View all</a>
              </div>
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 90px 80px', padding: '13px 24px', borderBottom: '1px solid #F8FAFC', gap: '8px', alignItems: 'center' }}>
                    <Sk w="140px" /><Sk w="60px" /><Sk w="50px" />
                  </div>
                ))
              ) : recentJobs.length === 0 ? (
                <div style={{ padding: '32px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', color: '#9CA3AF', marginBottom: '12px' }}>No jobs yet</div>
                  <a href="/dashboard/jobs" style={{ fontSize: '13px', color: '#2F80ED', fontWeight: 600, textDecoration: 'none' }}>Browse available jobs</a>
                </div>
              ) : (
                recentJobs.map((j, i) => {
                  const cfg = JOB_STATUS_CFG[j.status] ?? JOB_STATUS_CFG.completed;
                  return (
                    <div key={j.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px', padding: '13px 24px', borderBottom: i < recentJobs.length - 1 ? '1px solid #F8FAFC' : 'none', alignItems: 'center', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '13px', color: '#111', fontWeight: 500 }}>{j.service_name}</div>
                        <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>{j.service_city} - {j.scheduled_date}</div>
                      </div>
                      <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '20px', background: cfg.bg, color: cfg.color, width: 'fit-content' }}>{cfg.label}</span>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#111', textAlign: 'right' }}>${Math.round(j.payout_amount * 0.88)}</span>
                    </div>
                  );
                })
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #F3F4F6', padding: '20px 22px', boxShadow: '0 1px 4px rgba(17,17,17,0.04)' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111', marginBottom: '10px' }}>Quick Actions</div>
                {[
                  { href: '/dashboard/jobs',    label: 'Browse Available Jobs' },
                  { href: '/dashboard/payouts', label: 'View Earnings' },
                  { href: '/dashboard/profile', label: 'Edit Profile' },
                  { href: '/dashboard/support', label: 'Get Help' },
                ].map(link => (
                  <a key={link.href} href={link.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F8FAFC', textDecoration: 'none', color: '#374151', fontSize: '13px', fontWeight: 500 }}>
                    {link.label}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C4C9D4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5l7 7-7 7" /></svg>
                  </a>
                ))}
              </div>

              {!loading && summary && summary.availableCount > 0 && (
                <div style={{ background: 'linear-gradient(135deg,#2F80ED,#1A6ED4)', borderRadius: '16px', padding: '20px 22px', color: '#FFF' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '4px' }}>{summary.availableCount}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px' }}>Jobs Available Now</div>
                  <div style={{ fontSize: '11.5px', opacity: 0.85, marginBottom: '14px' }}>New work is waiting to be accepted.</div>
                  <a href="/dashboard/jobs" style={{ display: 'inline-block', padding: '8px 16px', borderRadius: '9px', background: 'rgba(255,255,255,0.2)', color: '#FFF', fontSize: '12.5px', fontWeight: 700, textDecoration: 'none' }}>
                    Accept Jobs
                  </a>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <style>{`@keyframes sk{0%{opacity:1}50%{opacity:.4}100%{opacity:1}}`}</style>
    </div>
  );
}
