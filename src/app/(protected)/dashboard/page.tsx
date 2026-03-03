'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { toast } from 'sonner';

const S: Record<string, React.CSSProperties> = {
  shell:   { display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter',-apple-system,sans-serif" },
  main:    { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topbar:  { background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 },
  content: { flex: 1, padding: '32px' },
  card:    { background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' },
};

export default function DashboardOverview() {
  const [user, setUser]           = useState<{ id: string; email?: string } | null>(null);
  const [app, setApp]             = useState<Record<string, unknown> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [available, setAvailable] = useState(true);
  const [togglingAvail, setTogglingAvail] = useState(false);
  const router   = useRouter();
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { router.push('/login'); return; }
      setUser(u);
      const { data } = await supabase.from('provider_applications').select('*').eq('user_id', u.id).maybeSingle();
      setApp(data);
      const pa = (data?.pricing_availability as Record<string, unknown>) || {};
      setAvailable(pa.available !== false);
      setIsLoading(false);
    })();
  }, []);

  const toggleAvailability = async () => {
    if (!user) return;
    setTogglingAvail(true);
    const newVal = !available;
    const cur = (app?.pricing_availability as Record<string, unknown>) || {};
    const { error } = await supabase.from('provider_applications')
      .update({ pricing_availability: { ...cur, available: newVal } })
      .eq('user_id', user.id);
    if (!error) {
      setAvailable(newVal);
      setApp(prev => prev ? { ...prev, pricing_availability: { ...cur, available: newVal } } : prev);
      toast.success(newVal ? 'You are now available for jobs' : 'You are now set to unavailable');
    }
    setTogglingAvail(false);
  };

  if (isLoading) return (
    <div style={S.shell}><DashboardSidebar />
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '3px solid #E2E8F0', borderTopColor: '#3B82F6', animation: 'spin 0.7s linear infinite' }} />
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const bi     = (app?.basic_info as Record<string, string>) || {};
  const sc     = (app?.services_coverage as Record<string, unknown>) || {};
  const exp    = (app?.experience_standards as Record<string, unknown>) || {};
  const name   = bi.full_legal_name || user?.email?.split('@')[0] || 'Provider';
  const initials = name.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase();
  const status = (app?.status as string) || 'draft';
  const city   = bi.city || '—';
  const services: string[] = (sc.sub_services as string[]) || [];
  const areas: string[]    = (sc.service_areas as string[]) || [];
  const expYears = exp.years_experience as number || 0;

  const statusMeta: Record<string, { label: string; color: string; bg: string }> = {
    approved:     { label: 'Approved',     color: '#059669', bg: '#ECFDF5' },
    submitted:    { label: 'Under Review', color: '#D97706', bg: '#FFFBEB' },
    under_review: { label: 'Under Review', color: '#D97706', bg: '#FFFBEB' },
    draft:        { label: 'Draft',        color: '#6B7280', bg: '#F9FAFB' },
    rejected:     { label: 'Rejected',     color: '#DC2626', bg: '#FEF2F2' },
  };
  const sm = statusMeta[status] || statusMeta.draft;

  return (
    <div style={S.shell}>
      <DashboardSidebar />
      <div style={S.main}>

        {/* Topbar */}
        <div style={S.topbar}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>Welcome back, {name.split(' ')[0]} 👋</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>{city}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Availability toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Available for jobs</span>
              <button
                onClick={toggleAvailability}
                disabled={togglingAvail}
                style={{
                  width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                  background: available ? '#059669' : '#CBD5E1', position: 'relative', transition: 'background 0.2s', opacity: togglingAvail ? 0.6 : 1,
                }}
              >
                <span style={{
                  position: 'absolute', top: '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                  transition: 'left 0.2s', left: available ? '23px' : '3px', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </button>
            </div>
            <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', background: sm.bg, color: sm.color, fontWeight: 600 }}>{sm.label}</span>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg,#3B82F6,#6366F1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '13px' }}>{initials}</div>
          </div>
        </div>

        {/* Content */}
        <div style={S.content}>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Account Status', value: sm.label,                       sub: 'Current standing',     accent: sm.color },
              { label: 'Services',       value: services.length || '—',         sub: 'Registered services',  accent: '#3B82F6' },
              { label: 'Service Areas',  value: areas.length || '—',            sub: 'Coverage zones',       accent: '#8B5CF6' },
              { label: 'Experience',     value: expYears ? `${expYears}y` : '—', sub: 'Years in trade',      accent: '#F59E0B' },
            ].map(s => (
              <div key={s.label} style={{ ...S.card, padding: '20px 22px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>{s.label}</div>
                <div style={{ fontSize: '26px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1 }}>{String(s.value)}</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 320px', gap: '20px', alignItems: 'start' }}>

            {/* Services & areas */}
            <div style={S.card}>
              <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Your Services</div>
                <Link href="/dashboard/profile" style={{ fontSize: '12px', color: '#3B82F6', textDecoration: 'none', fontWeight: 600 }}>Edit →</Link>
              </div>
              <div style={{ padding: '16px 20px' }}>
                {services.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                    {services.map((s: string) => (
                      <span key={s} style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '20px', background: '#EFF6FF', color: '#1D4ED8', fontWeight: 600 }}>
                        {s.replace(/_/g,' ')}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: '#94A3B8' }}>No services added yet. <Link href="/dashboard/profile" style={{ color: '#3B82F6' }}>Add services →</Link></p>
                )}
                {areas.length > 0 && (
                  <>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '16px 0 8px' }}>Coverage Areas</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {areas.map((a: string) => (
                        <span key={a} style={{ fontSize: '12px', padding: '3px 9px', borderRadius: '20px', background: '#F5F3FF', color: '#6D28D9', fontWeight: 500 }}>{a}</span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Quick actions */}
            <div style={S.card}>
              <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Quick Actions</div>
              </div>
              <div style={{ padding: '8px 10px' }}>
                {[
                  { href: '/dashboard/profile',   label: 'Update Profile & Services', icon: '👤', sub: 'Edit contact, services, areas' },
                  { href: '/dashboard/documents',  label: 'Manage Documents',          icon: '📄', sub: 'Upload ID, insurance, certs' },
                  { href: '/dashboard/jobs',       label: 'Browse Jobs',               icon: '💼', sub: 'View available work' },
                  { href: '/dashboard/payouts',    label: 'Payout Settings',           icon: '💳', sub: 'Manage bank & earnings' },
                  { href: '/dashboard/support',    label: 'Get Support',               icon: '💬', sub: 'Open a ticket' },
                ].map(q => (
                  <Link key={q.href} href={q.href} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '8px', textDecoration: 'none', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = '#F8FAFC'}
                    onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'}>
                    <div style={{ fontSize: '18px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', borderRadius: '8px', flexShrink: 0 }}>{q.icon}</div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{q.label}</div>
                      <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>{q.sub}</div>
                    </div>
                    <svg style={{ marginLeft: 'auto', flexShrink: 0 }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </Link>
                ))}
              </div>
            </div>

            {/* Onboarding + profile strength */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Onboarding */}
              <div style={S.card}>
                <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Onboarding</div>
                </div>
                <div style={{ padding: '12px 20px 16px' }}>
                  {[
                    { label: 'Account created',       done: true },
                    { label: 'Application submitted',  done: status !== 'draft' },
                    { label: 'Documents uploaded',     done: false },
                    { label: 'Identity verified',      done: status === 'approved' },
                    { label: 'Ready to earn',          done: status === 'approved' },
                  ].map((step, i, arr) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: i < arr.length - 1 ? '1px solid #F8FAFC' : 'none' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: step.done ? '#ECFDF5' : '#F1F5F9', border: `1.5px solid ${step.done ? '#059669' : '#E2E8F0'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {step.done
                          ? <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          : <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#CBD5E1' }} />}
                      </div>
                      <span style={{ fontSize: '12.5px', color: step.done ? '#0F172A' : '#94A3B8', fontWeight: step.done ? 500 : 400 }}>{step.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profile strength */}
              <div style={S.card}>
                <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Profile Strength</div>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  {(() => {
                    const checks = [!!bi.full_legal_name, !!bi.phone, !!bi.city, services.length > 0, areas.length > 0, expYears > 0];
                    const pct = Math.round((checks.filter(Boolean).length / checks.length) * 100);
                    const color = pct >= 80 ? '#059669' : pct >= 50 ? '#D97706' : '#DC2626';
                    return (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontSize: '13px', color: '#64748B' }}>{pct}% complete</span>
                          <span style={{ fontSize: '13px', fontWeight: 700, color }}>{pct >= 80 ? 'Strong' : pct >= 50 ? 'Good' : 'Needs work'}</span>
                        </div>
                        <div style={{ height: '6px', background: '#F1F5F9', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '3px', transition: 'width 0.5s' }} />
                        </div>
                        {pct < 100 && (
                          <Link href="/dashboard/profile" style={{ display: 'block', marginTop: '10px', fontSize: '12px', color: '#3B82F6', textDecoration: 'none', fontWeight: 600 }}>
                            Complete your profile →
                          </Link>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
