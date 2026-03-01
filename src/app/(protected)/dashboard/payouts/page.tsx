'use client';

import { DashboardSidebar } from '@/components/DashboardSidebar';

const S: Record<string, React.CSSProperties> = {
  shell:   { display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter',-apple-system,sans-serif" },
  main:    { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topbar:  { background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 },
  content: { flex: 1, padding: '32px', maxWidth: '900px', width: '100%' },
  card:    { background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' },
};

const stats = [
  { label: 'Total Earned',  value: '$0.00', accent: '#059669', bg: '#ECFDF5' },
  { label: 'Pending',       value: '$0.00', accent: '#D97706', bg: '#FFFBEB' },
  { label: 'This Month',    value: '$0.00', accent: '#3B82F6', bg: '#EFF6FF' },
];

export default function PayoutsPage() {
  return (
    <div style={S.shell}>
      <DashboardSidebar />
      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>Payouts</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>Earnings & payment history</div>
          </div>
        </div>
        <div style={S.content}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
            {stats.map(s => (
              <div key={s.label} style={{ ...S.card, padding: '22px 24px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>{s.label}</div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#0F172A', letterSpacing: '-0.03em' }}>{s.value}</div>
              </div>
            ))}
          </div>

          <div style={S.card}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Payout History</div>
            </div>
            <div style={{ padding: '56px 32px', textAlign: 'center' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', border: '1px solid #E2E8F0' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
                </svg>
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>No Payouts Yet</div>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>Completed jobs will appear here once processed.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
