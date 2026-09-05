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

function Skeleton({ w, h = 14 }: { w: string; h?: number }) {
  return (
    <div style={{ width: w, height: `${h}px`, borderRadius: '6px', background: '#E2E8F0', animation: 'shimmer 1.6s infinite', display: 'inline-block' }} />
  );
}

const APP_STATUS: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  approved:     { label: 'Approved',     color: '#10B981', bg: 'rgba(16,185,129,0.1)',  dot: '#10B981' },
  submitted:    { label: 'Under Review', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  dot: '#F59E0B' },
  under_review: { label: 'Under Review', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',  dot: '#F59E0B' },
  draft:        { label: 'Draft',        color: '#64748B', bg: 'rgba(100,116,139,0.1)', dot: '#64748B' },
  rejected:     { label: 'Rejected',     color: '#EF4444', bg: 'rgba(239,68,68,0.1)',   dot: '#EF4444' },
};

const JOB_STATUS: Record<string, { label: string; color: string; dot: string }> = {
  assigned:  { label: 'Assigned',    color: '#3B82F6', dot: '#3B82F6' },
  enroute:   { label: 'In Progress', color: '#8B5CF6', dot: '#8B5CF6' },
  completed: { label: 'Completed',   color: '#10B981', dot: '#10B981' },
  accepted:  { label: 'Available',   color: '#F59E0B', dot: '#F59E0B' },
};

const KPIS = [
  { key: 'completedCount', label: 'Jobs Completed', sub: 'All time',         icon: '✓', accent: '#10B981', accentBg: 'rgba(16,185,129,0.08)', format: (v: number) => String(v) },
  { key: 'activeCount',    label: 'Active Jobs',    sub: 'In progress',      icon: '↗', accent: '#3B82F6', accentBg: 'rgba(59,130,246,0.08)', format: (v: number) => String(v) },
  { key: 'totalEarned',    label: 'Total Earnings', sub: 'After 7% fee',    icon: '$', accent: '#8B5CF6', accentBg: 'rgba(139,92,246,0.08)', format: (v: number) => `$${v.toFixed(2)}` },
  { key: 'availableCount', label: 'Available Jobs', sub: 'Ready to accept',  icon: '◈', accent: '#F59E0B', accentBg: 'rgba(245,158,11,0.08)', format: (v: number) => String(v) },
] as const;

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

      const [sumRes, myJobsRes] = await Promise.all([fetchDashboardSummary(user.id), fetchMyJobs(user.id)]);
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

  const appSt = APP_STATUS[appStatus] ?? APP_STATUS.draft;
  const kpiValues: Record<string, number> = {
    completedCount: summary?.completedCount ?? 0,
    activeCount: summary?.activeCount ?? 0,
    totalEarned: summary?.totalEarned ?? 0,
    availableCount: summary?.availableCount ?? 0,
  };
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F1F5F9', fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <DashboardSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Topbar */}
        <header style={{
          background: '#FFFFFF', borderBottom: '1px solid #E2E8F0',
          padding: '0 36px', height: '64px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'sticky', top: 0, zIndex: 10, flexShrink: 0,
        }}>
          <div>
            {loading
              ? <Skeleton w="180px" h={17} />
              : <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{greeting}, {profileName}</div>
            }
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
              {profileCity ? `${profileCity} · Provider Dashboard` : 'Provider Dashboard'}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', background: appSt.bg }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: appSt.dot }} />
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: appSt.color }}>{appSt.label}</span>
              </div>
            )}
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: 700, color: '#FFF', flexShrink: 0,
              boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
            }}>
              {profileName[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '32px 36px', maxWidth: '1100px', width: '100%' }}>

          {/* App status banner */}
          {!loading && appStatus !== 'approved' && (
            <div style={{
              marginBottom: '28px', background: '#FFFFFF',
              borderRadius: '14px', border: `1px solid ${appSt.dot}30`,
              padding: '20px 24px', boxShadow: '0 1px 4px rgba(15,23,42,0.06)',
              display: 'flex', gap: '16px', alignItems: 'flex-start',
            }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: appSt.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '18px' }}>
                {appStatus === 'submitted' || appStatus === 'under_review' ? '⏳' : appStatus === 'rejected' ? '✗' : '📝'}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                  {appStatus === 'submitted' || appStatus === 'under_review' ? 'Application under review' : appStatus === 'rejected' ? 'Application not approved' : 'Complete your application'}
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>
                  {appStatus === 'submitted' || appStatus === 'under_review' ? "Our team reviews within 3–5 business days. You'll be notified by email once approved." : appStatus === 'rejected' ? 'Please contact support@urbance.ca to discuss next steps.' : 'Finish your application to unlock full dashboard access.'}
                </div>
              </div>
            </div>
          )}

          {/* Availability toggle */}
          {!loading && appStatus === 'approved' && (
            <div style={{
              marginBottom: '28px', background: '#FFFFFF',
              borderRadius: '14px', border: '1px solid #E2E8F0',
              padding: '18px 24px', boxShadow: '0 1px 4px rgba(15,23,42,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: available ? 'rgba(16,185,129,0.1)' : 'rgba(100,116,139,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={available ? '#10B981' : '#94A3B8'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#0F172A' }}>Availability</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                    {available ? 'Active — you will receive new job requests' : 'Paused — hidden from new job assignments'}
                  </div>
                </div>
              </div>
              <button onClick={toggleAvail} aria-label="Toggle availability" style={{ width: '48px', height: '26px', borderRadius: '100px', border: 'none', cursor: 'pointer', background: available ? '#10B981' : '#CBD5E1', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ position: 'absolute', top: '3px', left: available ? '25px' : '3px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.2s' }} />
              </button>
            </div>
          )}

          {/* KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }}>
            {KPIS.map(kpi => (
              <div key={kpi.key} style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '22px', boxShadow: '0 1px 3px rgba(15,23,42,0.05)', transition: 'transform 0.15s, box-shadow 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(15,23,42,0.10)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(15,23,42,0.05)'; }}
              >
                <div style={{ width: '34px', height: '34px', borderRadius: '9px', background: kpi.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontSize: '15px', fontWeight: 700, color: kpi.accent }}>
                  {kpi.icon}
                </div>
                {loading ? <Skeleton w="60px" h={28} /> : <div style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.04em', lineHeight: 1 }}>{kpi.format(kpiValues[kpi.key])}</div>}
                <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#334155', marginTop: '8px' }}>{kpi.label}</div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* Bottom grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>

            {/* Recent jobs */}
            <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(15,23,42,0.05)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Recent Jobs</div>
                <a href="/dashboard/jobs" style={{ fontSize: '12px', color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>View all →</a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 90px', padding: '9px 24px', gap: '8px', background: '#F8FAFC', borderBottom: '1px solid #F1F5F9' }}>
                {['Job', 'Status', 'Payout'].map((h, i) => (
                  <div key={h} style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: i === 2 ? 'right' : 'left' }}>{h}</div>
                ))}
              </div>
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 90px', padding: '14px 24px', borderBottom: '1px solid #F8FAFC', gap: '8px', alignItems: 'center' }}>
                    <div><Skeleton w="130px" h={13} /><br /><Skeleton w="80px" h={10} /></div>
                    <Skeleton w="70px" /><Skeleton w="50px" />
                  </div>
                ))
              ) : recentJobs.length === 0 ? (
                <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>📋</div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>No jobs yet</div>
                  <a href="/dashboard/jobs" style={{ fontSize: '13px', color: '#3B82F6', fontWeight: 600, textDecoration: 'none' }}>Browse available jobs →</a>
                </div>
              ) : (
                recentJobs.map((j, i) => {
                  const cfg = JOB_STATUS[j.status] ?? JOB_STATUS.assigned;
                  return (
                    <div key={j.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 90px', padding: '14px 24px', borderBottom: i < recentJobs.length - 1 ? '1px solid #F8FAFC' : 'none', alignItems: 'center', gap: '8px' }}>
                      <div>
                        <div style={{ fontSize: '13px', color: '#0F172A', fontWeight: 600 }}>{j.service_name}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '3px' }}>{j.service_city} · {j.scheduled_date}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
                        <span style={{ fontSize: '11.5px', fontWeight: 600, color: cfg.color }}>{cfg.label}</span>
                      </div>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', textAlign: 'right' }}>${Math.round(j.payout_amount * 0.88)}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '20px', boxShadow: '0 1px 3px rgba(15,23,42,0.05)' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '14px' }}>Quick Actions</div>
                {[
                  { href: '/dashboard/jobs',    label: 'Browse Available Jobs', icon: '💼' },
                  { href: '/dashboard/payouts', label: 'View Earnings',          icon: '💰' },
                  { href: '/dashboard/profile', label: 'Edit Profile',           icon: '✏️' },
                  { href: '/dashboard/support', label: 'Get Help',               icon: '💬' },
                ].map((link, i, arr) => (
                  <a key={link.href} href={link.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid #F8FAFC' : 'none', textDecoration: 'none', color: '#334155', fontSize: '13px', fontWeight: 500, transition: 'color 0.12s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#3B82F6'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = '#334155'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '14px' }}>{link.icon}</span>{link.label}
                    </div>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                  </a>
                ))}
              </div>

              {!loading && summary && summary.availableCount > 0 && (
                <div style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)', borderRadius: '14px', padding: '22px', color: '#FFF', boxShadow: '0 4px 20px rgba(59,130,246,0.3)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>Available Now</div>
                  <div style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '6px' }}>{summary.availableCount}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>{summary.availableCount === 1 ? 'Job' : 'Jobs'} waiting for you</div>
                  <div style={{ fontSize: '11.5px', color: 'rgba(255,255,255,0.65)', marginBottom: '18px', lineHeight: 1.5 }}>New work is ready to be accepted in your area.</div>
                  <a href="/dashboard/jobs" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', color: '#FFF', fontSize: '12.5px', fontWeight: 700, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
                    Accept Jobs
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                  </a>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
      <style>{`@keyframes shimmer{0%{opacity:1}50%{opacity:.45}100%{opacity:1}}`}</style>
    </div>
  );
}
