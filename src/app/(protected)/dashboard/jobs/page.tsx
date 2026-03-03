'use client';

import { useState } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';

const S: Record<string, React.CSSProperties> = {
  shell:   { display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter',-apple-system,sans-serif" },
  main:    { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topbar:  { background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 },
  content: { flex: 1, padding: '32px', maxWidth: '940px', width: '100%' },
  card:    { background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' },
  badge:   { fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '20px' },
};

const FILTERS = ['All', 'Available', 'Assigned', 'Completed', 'Cancelled'];

const DEMO_JOBS = [
  { id: 'j1', service: 'Deep Cleaning', address: '1234 Robson St, Vancouver', scheduled_at: '2026-03-10T10:00', status: 'available', subtotal: 180, customer: 'Sarah M.' },
  { id: 'j2', service: 'Move-in Cleaning', address: '56 Granville Ave, Burnaby', scheduled_at: '2026-03-12T14:00', status: 'available', subtotal: 250, customer: 'Tom K.' },
  { id: 'j3', service: 'Window Cleaning', address: '789 Kingsway, Vancouver', scheduled_at: '2026-03-08T09:00', status: 'completed', subtotal: 120, customer: 'Diana R.' },
  { id: 'j4', service: 'Carpet Cleaning', address: '22 Cambie St, Vancouver', scheduled_at: '2026-03-06T11:00', status: 'completed', subtotal: 200, customer: 'Mike L.' },
];

const statusBadge: Record<string, React.CSSProperties> = {
  available:  { background: '#ECFDF5', color: '#059669' },
  assigned:   { background: '#EFF6FF', color: '#1D4ED8' },
  in_progress:{ background: '#FFFBEB', color: '#D97706' },
  completed:  { background: '#F1F5F9', color: '#475569' },
  cancelled:  { background: '#FEF2F2', color: '#DC2626' },
};

export default function JobsPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = DEMO_JOBS.filter(j => {
    const matchFilter = filter === 'All' || j.status.toLowerCase().includes(filter.toLowerCase());
    const matchSearch = !search || j.service.toLowerCase().includes(search.toLowerCase()) || j.address.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = [
    { label: 'Available',  value: DEMO_JOBS.filter(j => j.status === 'available').length,  bg: '#ECFDF5', color: '#059669' },
    { label: 'Completed',  value: DEMO_JOBS.filter(j => j.status === 'completed').length,  bg: '#F1F5F9', color: '#475569' },
    { label: 'This Month', value: `$${DEMO_JOBS.filter(j => j.status === 'completed').reduce((a,b) => a + b.subtotal, 0)}`, bg: '#EFF6FF', color: '#1D4ED8' },
  ];

  return (
    <div style={S.shell}>
      <DashboardSidebar />
      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>Jobs</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>Browse and manage your work</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              placeholder="Search jobs…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13px', outline: 'none', fontFamily: 'inherit', width: '200px', background: '#F8FAFC' }}
            />
          </div>
        </div>

        <div style={S.content}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '22px' }}>
            {stats.map(s => (
              <div key={s.label} style={{ ...S.card, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: s.color }}>{s.value}</span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 500, color: '#374151' }}>{s.label} jobs</span>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
            {FILTERS.map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: '7px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12.5px', fontWeight: filter === f ? 700 : 500,
                background: filter === f ? '#0F172A' : '#F1F5F9', color: filter === f ? '#fff' : '#475569', fontFamily: 'inherit', transition: 'all 0.12s',
              }}>{f}</button>
            ))}
          </div>

          {/* Job cards */}
          {filtered.length === 0 ? (
            <div style={{ ...S.card, padding: '56px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📭</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>No jobs match this filter</div>
              <div style={{ fontSize: '13px', color: '#94A3B8' }}>Try adjusting your search or filter.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered.map(job => (
                <div key={job.id} style={{ ...S.card, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{job.service}</span>
                      <span style={{ ...S.badge, ...(statusBadge[job.status] || {}) }}>{job.status.replace('_',' ')}</span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#64748B' }}>📍 {job.address}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>
                      🗓 {new Date(job.scheduled_at).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} · 👤 {job.customer}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>${job.subtotal}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>est. payout</div>
                    {job.status === 'available' && (
                      <button style={{ marginTop: '8px', padding: '6px 14px', borderRadius: '7px', border: 'none', background: '#0F172A', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Accept Job
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Info note */}
          <div style={{ marginTop: '20px', padding: '14px 18px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', fontSize: '12.5px', color: '#92400E' }}>
            ⚡ Job listings shown above are demo data. Live jobs will appear once your account is approved and matched with customers in your service areas.
          </div>
        </div>
      </div>
    </div>
  );
}
