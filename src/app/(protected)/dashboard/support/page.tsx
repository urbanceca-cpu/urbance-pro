'use client';

import { useState } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { toast } from 'sonner';

const S: Record<string, React.CSSProperties> = {
  shell:   { display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter',-apple-system,sans-serif" },
  main:    { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topbar:  { background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 },
  content: { flex: 1, padding: '32px', maxWidth: '860px', width: '100%' },
  card:    { background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' },
  label:   { fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: '6px', display: 'block' },
  input:   { width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '13.5px', color: '#111', outline: 'none', boxSizing: 'border-box' as const, fontFamily: "'Inter',-apple-system,sans-serif", background: '#FAFAFA' },
  btn:     { padding: '9px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: '#111', color: '#FFFFFF', fontFamily: 'inherit' },
};

const CATEGORIES = ['Account & Billing', 'Job Issues', 'App Bug', 'Payments', 'Documents', 'Other'];

interface Ticket { id: string; subject: string; category: string; status: string; created: string; }

const statusStyle: Record<string, { color: string; bg: string }> = {
  open:        { color: '#1D4ED8', bg: '#EFF6FF' },
  in_progress: { color: '#D97706', bg: '#FFFBEB' },
  resolved:    { color: '#059669', bg: '#ECFDF5' },
  closed:      { color: '#6B7280', bg: '#F1F5F9' },
};

export default function SupportPage() {
  const [view, setView]         = useState<'list'|'new'>('list');
  const [subject, setSubject]   = useState('');
  const [category, setCategory] = useState('');
  const [message, setMessage]   = useState('');
  const [priority, setPriority] = useState('normal');
  const [submitting, setSubmitting] = useState(false);
  const [tickets, setTickets]   = useState<Ticket[]>([
    { id: 't1', subject: 'Document verification delay', category: 'Documents',       status: 'in_progress', created: 'Feb 28, 2026' },
    { id: 't2', subject: 'How does payout schedule work?', category: 'Payments',     status: 'resolved',    created: 'Feb 20, 2026' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !category || !message) { toast.error('Please fill in all fields'); return; }
    setSubmitting(true);
    setTimeout(() => {
      const newTicket: Ticket = { id: `t${Date.now()}`, subject, category, status: 'open', created: new Date().toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }) };
      setTickets(prev => [newTicket, ...prev]);
      toast.success('Ticket submitted! We\'ll respond within 24 hours.');
      setSubject(''); setCategory(''); setMessage(''); setPriority('normal');
      setView('list');
      setSubmitting(false);
    }, 800);
  };

  return (
    <div style={S.shell}>
      <DashboardSidebar />
      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Support</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>Get help from our team</div>
          </div>
          {view === 'list' ? (
            <button style={S.btn} onClick={() => setView('new')}>+ New Ticket</button>
          ) : (
            <button onClick={() => setView('list')} style={{ ...S.btn, background: '#F1F5F9', color: '#374151' }}>← Back</button>
          )}
        </div>

        <div style={S.content}>
          {view === 'list' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px', alignItems: 'start' }}>
              {/* Ticket list */}
              <div style={S.card}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>Your Tickets</div>
                  <span style={{ fontSize: '12px', padding: '3px 9px', borderRadius: '20px', background: '#F1F5F9', color: '#64748B', fontWeight: 600 }}>{tickets.length} total</span>
                </div>
                {tickets.length === 0 ? (
                  <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <div style={{ fontSize: '28px', marginBottom: '10px' }}>✉️</div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#111' }}>No tickets yet</div>
                    <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px' }}>Submit a ticket if you need help.</div>
                  </div>
                ) : (
                  tickets.map((t, i) => {
                    const ss = statusStyle[t.status] || statusStyle.closed;
                    return (
                      <div key={t.id} style={{ padding: '16px 24px', borderBottom: i < tickets.length - 1 ? '1px solid #F8FAFC' : 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '9px', background: ss.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={ss.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                          </svg>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.subject}</div>
                          <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{t.category} · {t.created}</div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 600, padding: '3px 9px', borderRadius: '20px', background: ss.bg, color: ss.color, flexShrink: 0 }}>
                          {t.status.replace('_',' ')}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* FAQ */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={S.card}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#111' }}>Quick Answers</div>
                  </div>
                  {[
                    ['How long does approval take?',   '3–5 business days after all documents are verified.'],
                    ['When do I get paid?',            'Every Friday for the prior week\'s completed jobs.'],
                    ['Can I change my service areas?', 'Yes — go to Profile → Services & Areas.'],
                    ['How do I report a no-show?',     'Open a ticket under "Job Issues" with the job ID.'],
                  ].map(([q, a]) => (
                    <div key={q} style={{ padding: '13px 20px', borderBottom: '1px solid #F8FAFC' }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 600, color: '#111', marginBottom: '3px' }}>{q}</div>
                      <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5 }}>{a}</div>
                    </div>
                  ))}
                </div>
                <div style={{ ...S.card, padding: '16px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', marginBottom: '8px' }}>��</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#111', marginBottom: '4px' }}>Need urgent help?</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Email us at<br /><strong>support@urbance.ca</strong></div>
                </div>
              </div>
            </div>
          ) : (
            /* New ticket form */
            <div style={{ maxWidth: '620px' }}>
              <div style={S.card}>
                <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>New Support Ticket</div>
                  <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>We typically respond within a few hours</div>
                </div>
                <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div>
                    <label style={S.label}>Category</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px' }}>
                      {CATEGORIES.map(c => (
                        <button key={c} type="button" onClick={() => setCategory(c)} style={{
                          padding: '6px 12px', borderRadius: '20px', border: `1.5px solid ${category === c ? '#3B82F6' : '#E5E7EB'}`,
                          background: category === c ? '#EFF6FF' : '#fff', color: category === c ? '#1D4ED8' : '#374151',
                          fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                        }}>{c}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={S.label}>Priority</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[['normal','Normal','#64748B','#F1F5F9'], ['high','High','#D97706','#FFFBEB'], ['urgent','Urgent','#DC2626','#FEF2F2']].map(([k,l,c,b]) => (
                        <button key={k} type="button" onClick={() => setPriority(k)} style={{ padding: '6px 14px', borderRadius: '8px', border: `1.5px solid ${priority === k ? c : '#E5E7EB'}`, background: priority === k ? b : '#fff', color: priority === k ? c : '#374151', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>{l}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={S.label}>Subject</label>
                    <input style={S.input} placeholder="Brief description of your issue" value={subject} onChange={e => setSubject(e.target.value)} required />
                  </div>
                  <div>
                    <label style={S.label}>Message</label>
                    <textarea style={{ ...S.input, minHeight: '120px', resize: 'vertical' as const, lineHeight: 1.6 }} placeholder="Describe your issue in as much detail as possible…" value={message} onChange={e => setMessage(e.target.value)} required />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" disabled={submitting} style={{ ...S.btn, opacity: submitting ? 0.7 : 1 }}>
                      {submitting ? 'Submitting…' : 'Submit Ticket'}
                    </button>
                    <button type="button" onClick={() => setView('list')} style={{ ...S.btn, background: '#F1F5F9', color: '#374151' }}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
