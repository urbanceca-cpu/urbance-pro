'use client';
import { useState } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';

const FILTERS = ['All', 'Available', 'Assigned', 'Completed'];
const BADGE: Record<string, { c: string; bg: string }> = {
  available: { c: '#059669', bg: '#ECFDF5' },
  assigned:  { c: '#2F80ED', bg: '#EBF3FD' },
  completed: { c: '#6B7280', bg: '#F3F4F6' },
  cancelled: { c: '#DC2626', bg: '#FEF2F2' },
};
const DEMO = [
  { id: 'j1', service: 'Deep Cleaning',    address: '1234 Robson St, Vancouver', date: 'Mar 10, 2026 10:00 AM', status: 'available', pay: 180, customer: 'Sarah M.' },
  { id: 'j2', service: 'Move-in Cleaning', address: '56 Granville Ave, Burnaby', date: 'Mar 12, 2026 2:00 PM',  status: 'available', pay: 250, customer: 'Tom K.'   },
  { id: 'j3', service: 'Window Cleaning',  address: '789 Kingsway, Vancouver',   date: 'Mar 8, 2026 9:00 AM',  status: 'completed', pay: 120, customer: 'Diana R.'  },
  { id: 'j4', service: 'Carpet Cleaning',  address: '22 Cambie St, Vancouver',   date: 'Mar 6, 2026 11:00 AM', status: 'completed', pay: 200, customer: 'Mike L.'   },
];

export default function JobsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const shown = DEMO.filter(j => {
    const mf = filter === 'All' || j.status === filter.toLowerCase();
    const ms = !search || j.service.toLowerCase().includes(search.toLowerCase()) || j.address.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <DashboardSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header className="djobs-header" style={{ background: '#FFF', borderBottom: '1px solid #F3F4F6', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Jobs</div>
            <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>Browse and manage your work</div>
          </div>
          <input
            className="djobs-search"
            placeholder="Search jobs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: '10px', border: '1px solid #E5E7EB', fontSize: '13px', outline: 'none', width: '200px', fontFamily: 'inherit', background: '#F9FAFB' }}
          />
        </header>

        <main className="djobs-content" style={{ flex: 1, padding: '40px', maxWidth: '900px', width: '100%' }}>
          {/* Mini stats */}
          <div className="djobs-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '24px' }}>
            {[
              { l: 'Available', v: DEMO.filter(j => j.status === 'available').length, col: '#059669', bg: '#ECFDF5' },
              { l: 'Completed', v: DEMO.filter(j => j.status === 'completed').length, col: '#6B7280', bg: '#F3F4F6' },
              { l: 'Earned',    v: `$${DEMO.filter(j => j.status === 'completed').reduce((a, b) => a + b.pay, 0)}`, col: '#2F80ED', bg: '#EBF3FD' },
            ].map(s => (
              <div key={s.l} style={{ background: '#FFF', borderRadius: '14px', border: '1px solid #F3F4F6', padding: '16px 20px', boxShadow: '0 1px 3px rgba(17,17,17,0.04)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '15px', fontWeight: 800, color: s.col }}>{s.v}</div>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>{s.l}</span>
              </div>
            ))}
          </div>

          {/* Filter pills */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '18px' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', borderRadius: '9px', border: 'none', cursor: 'pointer', fontSize: '12.5px', fontWeight: filter === f ? 700 : 500, background: filter === f ? '#111' : '#F3F4F6', color: filter === f ? '#FFF' : '#6B7280', fontFamily: 'inherit', transition: 'all 0.12s' }}>{f}</button>
            ))}
          </div>

          {/* Job cards */}
          {shown.length === 0 ? (
            <div style={{ background: '#FFF', borderRadius: '16px', border: '1px solid #F3F4F6', padding: '56px 24px', textAlign: 'center', boxShadow: '0 1px 4px rgba(17,17,17,0.04)' }}>
              <div style={{ fontSize: '28px', marginBottom: '10px' }}>&#x1F4ED;</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#111', marginBottom: '5px' }}>No jobs found</div>
              <div style={{ fontSize: '13px', color: '#9CA3AF' }}>Try a different filter or search term.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {shown.map(j => {
                const bs = BADGE[j.status] || BADGE.cancelled;
                return (
                  <div
                    key={j.id}
                    style={{ background: '#FFF', borderRadius: '14px', border: '1px solid #F3F4F6', padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '16px', boxShadow: '0 1px 3px rgba(17,17,17,0.04)', transition: 'box-shadow 0.14s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(17,17,17,0.07)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(17,17,17,0.04)'; }}
                  >
                    <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: '#F5F7FA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>{j.service}</span>
                        <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '3px 9px', borderRadius: '20px', background: bs.bg, color: bs.c }}>{j.status}</span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#6B7280' }}>&#x1F4CD; {j.address}</div>
                      <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{j.date} &middot; {j.customer}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#111', letterSpacing: '-0.03em' }}>${j.pay}</div>
                      <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '1px' }}>est. payout</div>
                      {j.status === 'available' && (
                        <button style={{ marginTop: '8px', padding: '6px 14px', borderRadius: '8px', border: 'none', background: '#2F80ED', color: '#FFF', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>Accept</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ marginTop: '20px', padding: '14px 18px', background: '#F8FAFC', border: '1px solid #E5E7EB', borderRadius: '12px', fontSize: '12.5px', color: '#9CA3AF' }}>
            &#x26A1; Job listings above are demo data. Live jobs will appear once your account is approved.
          </div>
        </main>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .djobs-header  { padding: 0 16px 0 56px !important; }
          .djobs-search  { width: 140px !important; font-size: 16px !important; }
          .djobs-content { padding: 20px 16px !important; }
          .djobs-stats-grid { grid-template-columns: repeat(3,1fr) !important; gap: 8px !important; }
        }
        @media (max-width: 480px) {
          .djobs-stats-grid { grid-template-columns: 1fr !important; }
          .djobs-search { display: none !important; }
        }
      `}</style>
    </div>
  );
}
