'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { DashboardSidebar } from '@/components/DashboardSidebar';

const S: Record<string, React.CSSProperties> = {
  shell:   { display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter',-apple-system,sans-serif" },
  main:    { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topbar:  { background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 },
  content: { flex: 1, padding: '32px', maxWidth: '1100px', width: '100%' },
  card:    { background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' },
};

export default function DashboardOverview() {
  const [user, setUser]       = useState<{ id: string; email?: string } | null>(null);
  const [app, setApp]         = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router  = useRouter();
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push('/login'); return; }
      setUser(u);
      const { data } = await supabase.from('provider_applications').select('*').eq('user_id', u.id).maybeSingle();
      setApp(data);
      setIsLoading(false);
    })();
  }, []);

  if (isLoading) return (
    <div style={S.shell}>
      <DashboardSidebar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #E2E8F0', borderTopColor: '#3B82F6', animation: 'spin 0.7s linear infinite' }} />
      </div>
    </div>
  );

  const bi = (app?.basic_info as Record<string, string>) || {};
  const name = bi.full_legal_name || user?.email?.split('@')[0] || 'Provider';
  const initials = name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
  const status = (app?.status as string) || 'draft';
  const city = bi.city || 'Your City';

  const statusMeta: Record<string, { label: string; color: string; bg: string }> = {
    approved:     { label: 'Approved',     color: '#059669', bg: '#ECFDF5' },
    submitted:    { label: 'Under Review', color: '#D97706', bg: '#FFFBEB' },
    under_review: { label: 'Under Review', color: '#D97706', bg: '#FFFBEB' },
    draft:        { label: 'Draft',        color: '#6B7280', bg: '#F9FAFB' },
    rejected:     { label: 'Rejected',     color: '#DC2626', bg: '#FEF2F2' },
  };
  const sm = statusMeta[status] || statusMeta.draft;

  const stats = [
    { label: 'Account Status', value: sm.label, sub: 'Current standing', accent: sm.color, bg: sm.bg },
    { label: 'Active Jobs',    value: '0',       sub: 'In progress',      accent: '#3B82F6', bg: '#EFF6FF' },
    { label: 'This Month',     value: '$0.00',   sub: 'Earnings',         accent: '#8B5CF6', bg: '#F5F3FF' },
    { label: 'Rating',         value: '—',       sub: 'Not yet rated',    accent: '#F59E0B', bg: '#FFFBEB' },
  ];

  const quickLinks = [
    { href: '/dashboard/jobs',      label: 'Browse Jobs',      sub: 'View available work',   color: '#3B82F6', bg: '#EFF6FF' },
    { href: '/dashboard/documents', label: 'Documents',        sub: 'Upload & manage files', color: '#8B5CF6', bg: '#F5F3FF' },
    { href: '/dashboard/payouts',   label: 'Payouts',          sub: 'Earnings & history',    color: '#059669', bg: '#ECFDF5' },
    { href: '/dashboard/profile',   label: 'Edit Profile',     sub: 'Update your info',      color: '#F59E0B', bg: '#FFFBEB' },
  ];

  return (
    <div style={S.shell}>
      <DashboardSidebar />
      <div style={S.main}>
        {/* Topbar */}
        <div style={S.topbar}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>Good day, {name.split(' ')[0]} 👋</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>{city}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', background: sm.bg, color: sm.color, fontWeight: 600 }}>{sm.label}</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#3B82F6,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px' }}>{initials}</div>
          </div>
        </div>

        {/* Content */}
        <div style={S.content}>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '28px' }}>
            {stats.map(s => (
              <div key={s.label} style={{ ...S.card, padding: '20px 22px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>{s.label}</div>
                <div style={{ fontSize: '26px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Body columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>

            {/* Quick links */}
            <div style={S.card}>
              <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Quick Actions</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Jump to common tasks</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#F1F5F9' }}>
                {quickLinks.map(q => (
                  <Link key={q.href} href={q.href} style={{ background: '#fff', textDecoration: 'none', padding: '20px 22px', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = '#F8FAFC'}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = '#fff'}
                  >
                    <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: q.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: q.color, opacity: 0.8 }} />
                    </div>
                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A' }}>{q.label}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{q.sub}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Onboarding checklist */}
            <div style={S.card}>
              <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Onboarding</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Your progress</div>
              </div>
              <div style={{ padding: '16px 24px 20px' }}>
                {[
                  { label: 'Account created',       done: true },
                  { label: 'Application submitted',  done: status !== 'draft' },
                  { label: 'Identity verified',      done: status === 'approved' },
                  { label: 'Ready to accept jobs',   done: status === 'approved' },
                ].map((step, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '9px 0', borderBottom: i < 3 ? '1px solid #F1F5F9' : 'none' }}>
                    <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: step.done ? '#ECFDF5' : '#F1F5F9', border: `1.5px solid ${step.done ? '#059669' : '#E2E8F0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {step.done
                        ? <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        : <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#CBD5E1' }} />}
                    </div>
                    <span style={{ fontSize: '13px', color: step.done ? '#0F172A' : '#94A3B8', fontWeight: step.done ? 500 : 400 }}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
