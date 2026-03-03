'use client';
import { useState, useEffect } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { createClient } from '@/lib/supabase/client';

interface AppData {
  status: string;
  basic_info?: Record<string, string>;
  services_coverage?: { sub_services?: string[]; service_areas?: string[] };
  experience_standards?: { professional_bio?: string };
  pricing_availability?: { available?: boolean; availability?: string[] };
}

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  approved:     { label: 'Approved',     color: '#059669', bg: '#ECFDF5', dot: '#059669' },
  submitted:    { label: 'Under Review', color: '#D97706', bg: '#FFFBEB', dot: '#F59E0B' },
  under_review: { label: 'Under Review', color: '#D97706', bg: '#FFFBEB', dot: '#F59E0B' },
  draft:        { label: 'Draft',        color: '#6B7280', bg: '#F9FAFB', dot: '#9CA3AF' },
  rejected:     { label: 'Rejected',     color: '#DC2626', bg: '#FEF2F2', dot: '#DC2626' },
};

function Sk({ w, h }: { w: string; h: number }) {
  return <div style={{ width: w, height: `${h}px`, borderRadius: '8px', background: '#F1F5F9', animation: 'sk 1.4s infinite' }} />;
}

export default function OverviewPage() {
  const [app, setApp] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from('provider_applications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (data) {
        setApp(data);
        setAvailable(data.pricing_availability?.available ?? false);
      }
      setLoading(false);
    })();
  }, []); // eslint-disable-line

  const toggleAvail = async () => {
    const next = !available;
    setAvailable(next);
    if (!app) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const pa = { ...(app.pricing_availability || {}), available: next };
    await supabase.from('provider_applications').update({ pricing_availability: pa }).eq('user_id', user.id);
  };

  const st    = STATUS_MAP[app?.status ?? 'draft'] ?? STATUS_MAP.draft;
  const name  = app?.basic_info?.full_legal_name?.split(' ')[0] ?? 'there';
  const city  = app?.basic_info?.city ?? '';
  const svcs  = app?.services_coverage?.sub_services ?? [];
  const areas = app?.services_coverage?.service_areas ?? [];
  const bio   = app?.experience_standards?.professional_bio ?? '';
  const avw   = app?.pricing_availability?.availability ?? [];
  const pct   = Math.round(
    [name !== 'there', city, svcs.length > 0, areas.length > 0, bio.length > 40, avw.length > 0]
      .filter(Boolean).length / 6 * 100
  );

  const kpis = [
    { label: 'Jobs Completed', v: '—',  sub: 'All time',       col: '#2F80ED', bg: '#EBF3FD' },
    { label: 'Upcoming Jobs',  v: '—',  sub: 'Scheduled',      col: '#7C3AED', bg: '#F5F3FF' },
    { label: 'Total Earnings', v: '$0', sub: 'Net payout',     col: '#059669', bg: '#ECFDF5' },
    { label: 'Avg. Rating',    v: '—',  sub: 'From customers', col: '#D97706', bg: '#FFFBEB' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <DashboardSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }} className="dash-main-col">

        {/* Sticky header */}
        <header className="dash-header" style={{ background: '#FFF', borderBottom: '1px solid #F3F4F6', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10, flexShrink: 0 }}>
          <div>
            {loading
              ? <Sk w="160px" h={16} />
              : <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Welcome back, {name} &#x1F44B;</div>
            }
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{city || 'Metro Vancouver'}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '20px', background: st.bg }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: st.dot }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: st.color }}>{st.label}</span>
              </div>
            )}
            <button style={{ width: '36px', height: '36px', borderRadius: '9px', border: '1px solid #F3F4F6', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
            </button>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#EBF3FD', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#2F80ED', flexShrink: 0 }}>
              {name[0]?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        <main className="dash-content" style={{ flex: 1, padding: '40px', maxWidth: '1040px', width: '100%' }}>

          {/* Status banner */}
          {!loading && app && app.status !== 'approved' && (
            <div style={{ marginBottom: '24px', background: '#FFF', borderRadius: '16px', border: '1px solid #F3F4F6', padding: '22px 26px', boxShadow: '0 1px 4px rgba(17,17,17,0.04)', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '20px' }}>
                {app.status === 'submitted' || app.status === 'under_review' ? '\u23F3' : app.status === 'rejected' ? '\u274C' : '\u{1F4DD}'}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>
                  {app.status === 'submitted' || app.status === 'under_review'
                    ? 'Your application is under review'
                    : app.status === 'rejected'
                      ? 'Application not approved'
                      : 'Complete your application'}
                </div>
                <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.6 }}>
                  {app.status === 'submitted' || app.status === 'under_review'
                    ? 'Our team reviews within 3\u20135 business days. You\u2019ll receive an email once approved.'
                    : app.status === 'rejected'
                      ? 'Please contact support@urbance.ca to learn next steps.'
                      : 'Finish your application to unlock full dashboard access.'}
                </div>
              </div>
            </div>
          )}

          {/* Availability toggle */}
          {!loading && app?.status === 'approved' && (
            <div style={{ marginBottom: '24px', background: '#FFF', borderRadius: '16px', border: '1px solid #F3F4F6', padding: '16px 24px', boxShadow: '0 1px 4px rgba(17,17,17,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111' }}>Availability</div>
                <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>
                  {available ? 'Visible to customers \u2014 you can receive new jobs' : 'Hidden from new job requests'}
                </div>
              </div>
              <button
                onClick={toggleAvail}
                style={{ width: '46px', height: '25px', borderRadius: '100px', border: 'none', cursor: 'pointer', background: available ? '#2F80ED' : '#E5E7EB', position: 'relative', transition: 'background 0.18s', flexShrink: 0 }}
              >
                <div style={{ position: 'absolute', top: '3px', left: available ? '24px' : '3px', width: '19px', height: '19px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.18)', transition: 'left 0.18s' }} />
              </button>
            </div>
          )}

          {/* KPI cards */}
          <div className="dash-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }}>
            {kpis.map(k => (
              <div
                key={k.label}
                style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #F3F4F6', padding: '20px 22px', boxShadow: '0 1px 4px rgba(17,17,17,0.04)', transition: 'transform 0.14s,box-shadow 0.14s', cursor: 'default' }}
                onMouseEnter={e => { const d = e.currentTarget; d.style.transform = 'translateY(-2px)'; d.style.boxShadow = '0 6px 20px rgba(17,17,17,0.07)'; }}
                onMouseLeave={e => { const d = e.currentTarget; d.style.transform = 'translateY(0)'; d.style.boxShadow = '0 1px 4px rgba(17,17,17,0.04)'; }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: k.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '4px', background: k.col, opacity: 0.7 }} />
                </div>
                {loading
                  ? <Sk w="56px" h={22} />
                  : <div style={{ fontSize: '24px', fontWeight: 800, color: '#111', letterSpacing: '-0.03em', lineHeight: 1 }}>{k.v}</div>
                }
                <div style={{ fontSize: '11.5px', color: '#9CA3AF', marginTop: '5px' }}>{k.sub}</div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#374151', marginTop: '8px' }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Bottom 2-col */}
          <div className="dash-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 296px', gap: '20px', alignItems: 'start' }}>

            {/* Activity table */}
            <div className="dash-activity-card" style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #F3F4F6', boxShadow: '0 1px 4px rgba(17,17,17,0.04)', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>Recent Activity</div>
                <span style={{ fontSize: '11px', color: '#C4C9D4' }}>Last 30 days</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 90px 70px', padding: '9px 24px', background: '#FAFAFA', borderBottom: '1px solid #F3F4F6' }}>
                {['Date', 'Activity', 'Status', 'Amount'].map(h => (
                  <span key={h} style={{ fontSize: '10px', fontWeight: 700, color: '#C4C9D4', letterSpacing: '0.07em', textTransform: 'uppercase' }}>{h}</span>
                ))}
              </div>
              {loading
                ? [1, 2, 3].map(i => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 90px 70px', padding: '13px 24px', borderBottom: '1px solid #F8FAFC', gap: '8px', alignItems: 'center' }}>
                    <Sk w="80px" h={12} /><Sk w="140px" h={12} /><Sk w="60px" h={12} /><Sk w="36px" h={12} />
                  </div>
                ))
                : [
                  { date: 'Mar 2, 2026', event: 'Application submitted', s: 'submitted', amt: '' },
                  { date: 'Mar 2, 2026', event: 'Account created',       s: 'complete',  amt: '' },
                ].map((r, i, a) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 90px 70px', padding: '13px 24px', borderBottom: i < a.length - 1 ? '1px solid #F8FAFC' : 'none', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{r.date}</span>
                    <span style={{ fontSize: '13px', color: '#111', fontWeight: 500 }}>{r.event}</span>
                    <span style={{ fontSize: '10.5px', fontWeight: 600, padding: '3px 8px', borderRadius: '20px', background: '#ECFDF5', color: '#059669', width: 'fit-content' }}>{r.s}</span>
                    <span style={{ fontSize: '12.5px', color: '#9CA3AF' }}>{r.amt || '\u2014'}</span>
                  </div>
                ))
              }
            </div>

            {/* Right panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #F3F4F6', padding: '20px 22px', boxShadow: '0 1px 4px rgba(17,17,17,0.04)' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>Profile Strength</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ flex: 1, height: '6px', background: '#F3F4F6', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct >= 80 ? '#059669' : pct >= 50 ? '#2F80ED' : '#F59E0B', borderRadius: '100px', transition: 'width 0.6s ease' }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#111', minWidth: '30px' }}>{pct}%</span>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#9CA3AF' }}>
                  {pct < 80 ? 'Complete your profile to attract more jobs.' : 'Great \u2014 you\'re ready to receive jobs.'}
                </p>
                <a href="/dashboard/profile" style={{ display: 'block', textAlign: 'center', padding: '8px', borderRadius: '9px', background: '#EBF3FD', color: '#2F80ED', fontSize: '12.5px', fontWeight: 600, textDecoration: 'none' }}>
                  Edit Profile \u2192
                </a>
              </div>
              <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #F3F4F6', padding: '20px 22px', boxShadow: '0 1px 4px rgba(17,17,17,0.04)' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: '#111', marginBottom: '10px' }}>Quick Actions</div>
                {[
                  { href: '/dashboard/documents', label: 'Upload Documents' },
                  { href: '/dashboard/jobs',      label: 'Browse Jobs' },
                  { href: '/dashboard/payouts',   label: 'View Earnings' },
                  { href: '/dashboard/support',   label: 'Get Help' },
                ].map(link => (
                  <a key={link.href} href={link.href} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid #F8FAFC', textDecoration: 'none', color: '#374151', fontSize: '13px', fontWeight: 500 }}>
                    {link.label}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#C4C9D4" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" /><path d="M12 5l7 7-7 7" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
      <style>{`@keyframes sk{0%{opacity:1}50%{opacity:0.4}100%{opacity:1}}
        @media (max-width: 768px) {
          /* Header padding: leave room for hamburger on left */
          .dash-header { padding: 0 16px 0 56px !important; }
          /* Main content padding */
          .dash-content { padding: 20px 16px !important; }
          /* KPI cards: 2x2 grid */
          .dash-kpi-grid { grid-template-columns: repeat(2,1fr) !important; gap: 12px !important; }
          /* Bottom section: stack */
          .dash-bottom-grid { grid-template-columns: 1fr !important; }
          /* Activity table: scrollable */
          .dash-activity-card { overflow-x: auto !important; }
        }
      `}</style>
    </div>
  );
}
