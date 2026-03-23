'use client';
import { useState, useEffect, useCallback } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import {
  fetchAvailableJobs, fetchMyJobs, acceptJob, startJob, completeJob,
  getCurrentUser, type ProviderJob, netAmount,
} from '@/lib/jobs-api';

function Skeleton({ w, h = 14 }: { w: string; h?: number }) {
  return <div style={{ width: w, height: `${h}px`, borderRadius: '6px', background: '#E2E8F0', animation: 'shimmer 1.6s infinite', display: 'inline-block' }} />;
}

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  assigned:  { label: 'Assigned',    color: '#3B82F6', bg: 'rgba(59,130,246,0.08)',  dot: '#3B82F6' },
  enroute:   { label: 'In Progress', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)',  dot: '#8B5CF6' },
  completed: { label: 'Completed',   color: '#10B981', bg: 'rgba(16,185,129,0.08)',  dot: '#10B981' },
  accepted:  { label: 'Available',   color: '#F59E0B', bg: 'rgba(245,158,11,0.08)',  dot: '#F59E0B' },
  cancelled: { label: 'Cancelled',   color: '#64748B', bg: 'rgba(100,116,139,0.08)', dot: '#94A3B8' },
};

type Toast = { id: number; msg: string; ok: boolean };
let _tid = 0;

const MY_FILTERS = ['All', 'Assigned', 'In Progress', 'Completed'] as const;
type MyFilter = (typeof MY_FILTERS)[number];

function filterMyJobs(jobs: ProviderJob[], f: MyFilter) {
  if (f === 'All') return jobs;
  if (f === 'Assigned') return jobs.filter(j => j.status === 'assigned');
  if (f === 'In Progress') return jobs.filter(j => j.status === 'enroute');
  return jobs.filter(j => j.status === 'completed');
}

function JobCard({ job, isAvailable, loadingId, onAccept, onStart, onComplete }: {
  job: ProviderJob; isAvailable: boolean; loadingId: string | null;
  onAccept: (j: ProviderJob) => void; onStart: (j: ProviderJob) => void; onComplete: (j: ProviderJob) => void;
}) {
  const cfg = STATUS_CFG[job.status] ?? STATUS_CFG.cancelled;
  const busy = loadingId === job.id;
  const earn = netAmount(job.payout_amount);

  return (
    <div style={{
      background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0',
      padding: '22px', boxShadow: '0 1px 3px rgba(15,23,42,0.05)',
      transition: 'box-shadow 0.15s, transform 0.15s', display: 'flex', flexDirection: 'column', gap: '16px',
    }}
      onMouseEnter={e => { const d = e.currentTarget as HTMLDivElement; d.style.boxShadow = '0 6px 20px rgba(15,23,42,0.10)'; d.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { const d = e.currentTarget as HTMLDivElement; d.style.boxShadow = '0 1px 3px rgba(15,23,42,0.05)'; d.style.transform = 'translateY(0)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#0F172A', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.service_name}</div>
          <div style={{ fontSize: '12px', color: '#64748B' }}>{job.service_city}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px', flexShrink: 0 }}>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em' }}>${earn.toFixed(0)}</div>
          <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>you earn</div>
          {!isAvailable && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '20px', background: cfg.bg }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.dot }} />
              <span style={{ fontSize: '10.5px', fontWeight: 700, color: cfg.color }}>{cfg.label}</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ height: '1px', background: '#F1F5F9' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {[
          { label: job.scheduled_date + (job.scheduled_time ? ' · ' + job.scheduled_time : ''), sub: 'Date & Time' },
          { label: job.service_address, sub: 'Address' },
          { label: isAvailable ? 'Revealed on accept' : job.customer_name, sub: 'Customer' },
          { label: '$' + job.payout_amount.toFixed(0) + ' gross · $' + earn.toFixed(0) + ' net', sub: 'Payout' },
        ].map(({ label, sub }) => (
          <div key={sub}>
            <div style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>{sub}</div>
            <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.4 }}>{label}</div>
          </div>
        ))}
      </div>

      {job.service_details && (
        <div style={{ fontSize: '12px', color: '#64748B', background: '#F8FAFC', borderRadius: '8px', padding: '10px 12px', lineHeight: 1.6, borderLeft: '3px solid #CBD5E1' }}>
          {job.service_details}
        </div>
      )}

      {isAvailable && (
        <button disabled={busy} onClick={() => onAccept(job)} style={{ width: '100%', padding: '11px', borderRadius: '9px', border: 'none', cursor: busy ? 'not-allowed' : 'pointer', background: busy ? '#E2E8F0' : '#0F172A', color: busy ? '#94A3B8' : '#FFF', fontSize: '13px', fontWeight: 700, transition: 'all 0.15s', fontFamily: 'inherit' }}>
          {busy ? 'Accepting...' : 'Accept Job →'}
        </button>
      )}
      {!isAvailable && job.status === 'assigned' && (
        <button disabled={busy} onClick={() => onStart(job)} style={{ width: '100%', padding: '11px', borderRadius: '9px', border: 'none', cursor: busy ? 'not-allowed' : 'pointer', background: busy ? '#E2E8F0' : '#3B82F6', color: busy ? '#94A3B8' : '#FFF', fontSize: '13px', fontWeight: 700, transition: 'all 0.15s', fontFamily: 'inherit' }}>
          {busy ? 'Starting...' : 'Start Job — En Route'}
        </button>
      )}
      {!isAvailable && job.status === 'enroute' && (
        <button disabled={busy} onClick={() => onComplete(job)} style={{ width: '100%', padding: '11px', borderRadius: '9px', border: 'none', cursor: busy ? 'not-allowed' : 'pointer', background: busy ? '#E2E8F0' : '#10B981', color: busy ? '#94A3B8' : '#FFF', fontSize: '13px', fontWeight: 700, transition: 'all 0.15s', fontFamily: 'inherit' }}>
          {busy ? 'Completing...' : 'Mark as Complete ✓'}
        </button>
      )}
      {!isAvailable && job.status === 'completed' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '11px', borderRadius: '9px', background: 'rgba(16,185,129,0.08)' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#10B981' }}>✓ Completed · Paid ${earn.toFixed(0)}</span>
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [tab, setTab] = useState<'available' | 'mine'>('available');
  const [myFilter, setMyFilter] = useState<MyFilter>('All');
  const [available, setAvailable] = useState<ProviderJob[]>([]);
  const [myJobs, setMyJobs] = useState<ProviderJob[]>([]);
  const [loadingInit, setLoadingInit] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  function addToast(msg: string, ok: boolean) {
    const id = ++_tid;
    setToasts(t => [...t, { id, msg, ok }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800);
  }

  const load = useCallback(async (uid: string) => {
    setError(null);
    const [av, my] = await Promise.all([fetchAvailableJobs(), fetchMyJobs(uid)]);
    if (av.error) { setError(av.error); return; }
    if (my.error) { setError(my.error); return; }
    setAvailable(av.data ?? []);
    setMyJobs(my.data ?? []);
  }, []);

  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (!user) return;
      setUserId(user.id);
      await load(user.id);
      setLoadingInit(false);
    })();
  }, [load]);

  async function handleAccept(job: ProviderJob) {
    if (!userId) return;
    setLoadingId(job.id);
    const { data, error: err } = await acceptJob(job.id, userId);
    setLoadingId(null);
    if (err || !data) { addToast(err ?? 'Failed to accept job.', false); return; }
    addToast(`"${job.service_name}" accepted!`, true);
    setAvailable(prev => prev.filter(j => j.id !== job.id));
    setMyJobs(prev => [data, ...prev]);
    setTab('mine');
    setMyFilter('Assigned');
  }

  async function handleStart(job: ProviderJob) {
    if (!userId) return;
    setLoadingId(job.id);
    const { data, error: err } = await startJob(job.id, userId);
    setLoadingId(null);
    if (err || !data) { addToast(err ?? 'Failed to start job.', false); return; }
    addToast('Job started — en route!', true);
    setMyJobs(prev => prev.map(j => j.id === job.id ? data : j));
  }

  async function handleComplete(job: ProviderJob) {
    if (!userId) return;
    setLoadingId(job.id);
    const { data, error: err } = await completeJob(job.id, userId);
    setLoadingId(null);
    if (err || !data) { addToast(err ?? 'Failed to complete job.', false); return; }
    addToast('Job completed! Earnings updated.', true);
    setMyJobs(prev => prev.map(j => j.id === job.id ? data : j));
  }

  const shown = tab === 'available' ? available : filterMyJobs(myJobs, myFilter);
  const activeCount = myJobs.filter(j => j.status === 'assigned' || j.status === 'enroute').length;
  const completedCount = myJobs.filter(j => j.status === 'completed').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F1F5F9', fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <DashboardSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        <header style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 36px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>Jobs</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Browse and manage your work</div>
          </div>
          <button onClick={async () => { if (userId) { setError(null); await load(userId); } }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#FFF', fontSize: '12.5px', fontWeight: 600, cursor: 'pointer', color: '#475569', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ↻ Refresh
          </button>
        </header>

        <main style={{ flex: 1, padding: '28px 36px', maxWidth: '1060px', width: '100%' }}>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[
              { label: 'Available Now', v: available.length,  accent: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
              { label: 'Active Jobs',   v: activeCount,        accent: '#3B82F6', bg: 'rgba(59,130,246,0.08)' },
              { label: 'Completed',     v: completedCount,     accent: '#10B981', bg: 'rgba(16,185,129,0.08)' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 18px', borderRadius: '10px', background: s.bg }}>
                <span style={{ fontSize: '20px', fontWeight: 800, color: s.accent }}>{s.v}</span>
                <span style={{ fontSize: '12px', color: s.accent, fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', borderRadius: '10px', background: '#E2E8F0', padding: '3px', marginBottom: '20px', width: 'fit-content' }}>
            {(['available', 'mine'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 22px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.15s', fontFamily: 'inherit', background: tab === t ? '#FFFFFF' : 'transparent', color: tab === t ? '#0F172A' : '#64748B', boxShadow: tab === t ? '0 1px 4px rgba(15,23,42,0.10)' : 'none' }}>
                {t === 'available' ? `Available (${available.length})` : `My Jobs (${myJobs.length})`}
              </button>
            ))}
          </div>

          {tab === 'mine' && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {MY_FILTERS.map(f => (
                <button key={f} onClick={() => setMyFilter(f)} style={{ padding: '5px 14px', borderRadius: '20px', border: myFilter === f ? 'none' : '1px solid #E2E8F0', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit', background: myFilter === f ? '#0F172A' : '#FFFFFF', color: myFilter === f ? '#FFFFFF' : '#64748B', transition: 'all 0.12s' }}>
                  {f}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div style={{ padding: '14px 18px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '20px', fontSize: '13px', color: '#DC2626', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {error}
              <button onClick={async () => { if (userId) await load(userId); }} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 700, color: '#DC2626', fontSize: '12px', fontFamily: 'inherit' }}>Retry</button>
            </div>
          )}

          {loadingInit ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '16px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '22px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><Skeleton w="55%" h={16} /><Skeleton w="60px" h={24} /></div>
                  <div style={{ height: '1px', background: '#F1F5F9' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <Skeleton w="90%" h={12} /><Skeleton w="90%" h={12} />
                    <Skeleton w="80%" h={12} /><Skeleton w="80%" h={12} />
                  </div>
                  <Skeleton w="100%" h={40} />
                </div>
              ))}
            </div>
          ) : shown.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '72px 20px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{tab === 'available' ? '🔍' : '📋'}</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                {tab === 'available' ? 'No available jobs right now' : myFilter !== 'All' ? 'No ' + myFilter.toLowerCase() + ' jobs' : 'No jobs yet'}
              </div>
              <div style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6 }}>
                {tab === 'available' ? 'Check back soon — new jobs are added regularly.' : 'Accept your first job from the Available tab.'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '16px' }}>
              {shown.map(j => (
                <JobCard key={j.id} job={j} isAvailable={tab === 'available'} loadingId={loadingId} onAccept={handleAccept} onStart={handleStart} onComplete={handleComplete} />
              ))}
            </div>
          )}
        </main>
      </div>

      <div style={{ position: 'fixed', bottom: '28px', right: '28px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 9999 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ padding: '12px 18px', borderRadius: '10px', background: t.ok ? '#0F172A' : '#DC2626', color: '#FFF', fontSize: '13px', fontWeight: 500, boxShadow: '0 6px 24px rgba(0,0,0,0.18)', maxWidth: '320px' }}>
            {t.msg}
          </div>
        ))}
      </div>
      <style>{`@keyframes shimmer{0%{opacity:1}50%{opacity:.45}100%{opacity:1}}`}</style>
    </div>
  );
}
