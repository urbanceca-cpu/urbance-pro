'use client';
import { useState, useEffect, useCallback } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import {
  fetchAvailableJobs,
  fetchMyJobs,
  acceptJob,
  startJob,
  completeJob,
  getCurrentUser,
  type ProviderJob,
  netAmount,
} from '@/lib/jobs-api';

function Sk({ w, h = 14 }: { w: string; h?: number }) {
  return <div style={{ width: w, height: `${h}px`, borderRadius: '7px', background: '#F1F5F9', animation: 'sk 1.4s infinite', display: 'inline-block' }} />;
}

const STATUS_CFG: Record<string, { label: string; color: string; bg: string; dot: string }> = {
  assigned:  { label: 'Assigned',    color: '#2F80ED', bg: '#EBF3FD', dot: '#2F80ED' },
  enroute:   { label: 'In Progress', color: '#7C3AED', bg: '#F5F3FF', dot: '#7C3AED' },
  completed: { label: 'Completed',   color: '#059669', bg: '#ECFDF5', dot: '#059669' },
  accepted:  { label: 'Available',   color: '#D97706', bg: '#FFFBEB', dot: '#F59E0B' },
  cancelled: { label: 'Cancelled',   color: '#6B7280', bg: '#F3F4F6', dot: '#9CA3AF' },
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
    <div style={{ background: '#FFF', borderRadius: '14px', border: '1px solid #F3F4F6', padding: '20px', boxShadow: '0 1px 4px rgba(17,17,17,0.04)', transition: 'box-shadow 0.15s' }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(17,17,17,0.08)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 4px rgba(17,17,17,0.04)'; }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '12px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: '14.5px', fontWeight: 700, color: '#111', marginBottom: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.service_name}</div>
          <div style={{ fontSize: '12px', color: '#9CA3AF' }}>{job.service_city}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
          <span style={{ fontSize: '16px', fontWeight: 800, color: '#111' }}>${earn.toFixed(0)}</span>
          <span style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 500 }}>after fees</span>
          {!isAvailable && (
            <span style={{ fontSize: '10.5px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: cfg.bg, color: cfg.color }}>
              <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', background: cfg.dot, marginRight: '4px', verticalAlign: 'middle' }} />{cfg.label}
            </span>
          )}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
        {[
          { icon: '📍', val: job.service_address },
          { icon: '📅', val: `${job.scheduled_date}${job.scheduled_time ? ' - ' + job.scheduled_time : ''}` },
          { icon: '👤', val: isAvailable ? 'Customer details on accept' : job.customer_name },
          { icon: '💵', val: `$${job.payout_amount.toFixed(0)} gross - $${earn.toFixed(0)} net` },
        ].map(({ icon, val }) => (
          <div key={icon} style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', flexShrink: 0 }}>{icon}</span>
            <span style={{ fontSize: '12px', color: '#4B5563', lineHeight: 1.4 }}>{val}</span>
          </div>
        ))}
      </div>
      {job.service_details && (
        <div style={{ fontSize: '12px', color: '#6B7280', background: '#F8FAFC', borderRadius: '8px', padding: '9px 12px', marginBottom: '14px', lineHeight: 1.5 }}>
          {job.service_details}
        </div>
      )}
      {isAvailable && (
        <button disabled={busy} onClick={() => onAccept(job)} style={{ width: '100%', padding: '10px', borderRadius: '9px', border: 'none', cursor: busy ? 'not-allowed' : 'pointer', background: busy ? '#E5E7EB' : '#111', color: '#FFF', fontSize: '13px', fontWeight: 700, transition: 'background 0.15s', fontFamily: 'inherit' }}>
          {busy ? 'Accepting...' : 'Accept Job'}
        </button>
      )}
      {!isAvailable && job.status === 'assigned' && (
        <button disabled={busy} onClick={() => onStart(job)} style={{ width: '100%', padding: '10px', borderRadius: '9px', border: 'none', cursor: busy ? 'not-allowed' : 'pointer', background: busy ? '#E5E7EB' : '#2F80ED', color: '#FFF', fontSize: '13px', fontWeight: 700, transition: 'background 0.15s', fontFamily: 'inherit' }}>
          {busy ? 'Starting...' : 'Start Job'}
        </button>
      )}
      {!isAvailable && job.status === 'enroute' && (
        <button disabled={busy} onClick={() => onComplete(job)} style={{ width: '100%', padding: '10px', borderRadius: '9px', border: 'none', cursor: busy ? 'not-allowed' : 'pointer', background: busy ? '#E5E7EB' : '#059669', color: '#FFF', fontSize: '13px', fontWeight: 700, transition: 'background 0.15s', fontFamily: 'inherit' }}>
          {busy ? 'Completing...' : 'Mark Complete'}
        </button>
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
    addToast('Job started - you are en route!', true);
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <DashboardSidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header style={{ background: '#FFF', borderBottom: '1px solid #F3F4F6', padding: '0 40px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Jobs</div>
          <button onClick={async () => { if (userId) { setError(null); await load(userId); } }} style={{ padding: '7px 14px', borderRadius: '8px', border: '1px solid #E5E7EB', background: '#FFF', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: '#374151', fontFamily: 'inherit' }}>
            Refresh
          </button>
        </header>

        <main style={{ flex: 1, padding: '32px 40px', maxWidth: '960px', width: '100%' }}>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {[
              { label: 'Available Now', v: available.length, col: '#D97706', bg: '#FFFBEB' },
              { label: 'Active Jobs',   v: activeCount,       col: '#2F80ED', bg: '#EBF3FD' },
              { label: 'Completed',     v: completedCount,    col: '#059669', bg: '#ECFDF5' },
            ].map(s => (
              <div key={s.label} style={{ padding: '10px 18px', borderRadius: '10px', background: s.bg, display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '18px', fontWeight: 800, color: s.col }}>{s.v}</span>
                <span style={{ fontSize: '12px', color: s.col, fontWeight: 600 }}>{s.label}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', borderRadius: '11px', background: '#F1F5F9', padding: '3px', marginBottom: '20px', width: 'fit-content' }}>
            {(['available', 'mine'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, transition: 'all 0.15s', fontFamily: 'inherit', background: tab === t ? '#FFF' : 'transparent', color: tab === t ? '#111' : '#9CA3AF', boxShadow: tab === t ? '0 1px 4px rgba(17,17,17,0.08)' : 'none' }}>
                {t === 'available' ? `Available (${available.length})` : `My Jobs (${myJobs.length})`}
              </button>
            ))}
          </div>

          {tab === 'mine' && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
              {MY_FILTERS.map(f => (
                <button key={f} onClick={() => setMyFilter(f)} style={{ padding: '5px 14px', borderRadius: '20px', border: myFilter === f ? 'none' : '1px solid #E5E7EB', cursor: 'pointer', fontSize: '12px', fontWeight: 600, fontFamily: 'inherit', background: myFilter === f ? '#111' : '#FFF', color: myFilter === f ? '#FFF' : '#6B7280' }}>
                  {f}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div style={{ padding: '14px 18px', borderRadius: '10px', background: '#FEF2F2', border: '1px solid #FECACA', marginBottom: '20px', fontSize: '13px', color: '#DC2626', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {error}
              <button onClick={async () => { if (userId) await load(userId); }} style={{ border: 'none', background: 'none', cursor: 'pointer', fontWeight: 600, color: '#DC2626', fontSize: '12px', fontFamily: 'inherit' }}>Retry</button>
            </div>
          )}

          {loadingInit ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
              {[1, 2, 3].map(i => (
                <div key={i} style={{ background: '#FFF', borderRadius: '14px', border: '1px solid #F3F4F6', padding: '20px' }}>
                  <Sk w="60%" h={16} /><br /><br /><Sk w="40%" /><br /><br /><Sk w="80%" /><br /><Sk w="70%" /><br /><br /><Sk w="100%" h={38} />
                </div>
              ))}
            </div>
          ) : shown.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{ fontSize: '38px', marginBottom: '14px' }}>{tab === 'available' ? '🔍' : '📋'}</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '6px' }}>
                {tab === 'available' ? 'No available jobs right now' : myFilter !== 'All' ? `No ${myFilter.toLowerCase()} jobs` : 'No jobs yet'}
              </div>
              <div style={{ fontSize: '13px', color: '#9CA3AF' }}>
                {tab === 'available' ? 'Check back soon - new jobs are added regularly.' : 'Accept your first job from the Available tab.'}
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '16px' }}>
              {shown.map(j => (
                <JobCard key={j.id} job={j} isAvailable={tab === 'available'} loadingId={loadingId} onAccept={handleAccept} onStart={handleStart} onComplete={handleComplete} />
              ))}
            </div>
          )}
        </main>
      </div>

      <div style={{ position: 'fixed', bottom: '24px', right: '24px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 9999 }}>
        {toasts.map(t => (
          <div key={t.id} style={{ padding: '12px 18px', borderRadius: '10px', background: t.ok ? '#111' : '#DC2626', color: '#FFF', fontSize: '13px', fontWeight: 500, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', maxWidth: '320px' }}>
            {t.msg}
          </div>
        ))}
      </div>
      <style>{`@keyframes sk{0%{opacity:1}50%{opacity:.4}100%{opacity:1}}`}</style>
    </div>
  );
}
