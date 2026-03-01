'use client';

import { useState } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';

const S: Record<string, React.CSSProperties> = {
  shell:   { display: 'flex', minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Inter',-apple-system,sans-serif" },
  main:    { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  topbar:  { background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 32px', height: '64px', display: 'flex', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 },
  content: { flex: 1, padding: '32px', maxWidth: '680px', width: '100%' },
  card:    { background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 1px 4px rgba(15,23,42,0.04)' },
  label:   { fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', display: 'block' },
  input:   { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '14px', color: '#0F172A', outline: 'none', boxSizing: 'border-box' as const, fontFamily: "'Inter',-apple-system,sans-serif" },
  btn:     { padding: '10px 22px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13.5px', fontWeight: 600, background: '#0F172A', color: '#FFFFFF', fontFamily: "'Inter',-apple-system,sans-serif", transition: 'opacity 0.15s' },
};

export default function SupportPage() {
  const [open, setOpen]       = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent]       = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    setSent(true);
    setOpen(false);
    setSubject(''); setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div style={S.shell}>
      <DashboardSidebar />
      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>Support</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>We're here to help</div>
          </div>
        </div>
        <div style={S.content}>
          {sent && (
            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', padding: '14px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{ fontSize: '13.5px', color: '#065F46', fontWeight: 500 }}>Ticket submitted — we'll be in touch within 24 hours.</span>
            </div>
          )}

          {!open ? (
            <div style={S.card}>
              <div style={{ padding: '36px 32px', textAlign: 'center' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '13px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>How can we help?</div>
                <div style={{ fontSize: '13.5px', color: '#64748B', marginBottom: '24px', lineHeight: 1.6 }}>Have a question or issue? Submit a support ticket and our team will get back to you shortly.</div>
                <button style={S.btn} onClick={() => setOpen(true)}>Open a Ticket</button>
              </div>
            </div>
          ) : (
            <div style={S.card}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>New Support Ticket</div>
                <button onClick={() => setOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '20px', lineHeight: 1 }}>×</button>
              </div>
              <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={S.label}>Subject</label>
                  <input style={S.input} placeholder="Brief description of your issue" value={subject} onChange={e => setSubject(e.target.value)} required />
                </div>
                <div style={{ marginBottom: '22px' }}>
                  <label style={S.label}>Message</label>
                  <textarea style={{ ...S.input, minHeight: '120px', resize: 'vertical' as const }} placeholder="Describe your issue in detail..." value={message} onChange={e => setMessage(e.target.value)} required />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" style={S.btn}>Submit Ticket</button>
                  <button type="button" onClick={() => setOpen(false)} style={{ ...S.btn, background: '#F1F5F9', color: '#374151' }}>Cancel</button>
                </div>
              </form>
            </div>
          )}

          {/* FAQ strip */}
          <div style={{ ...S.card, marginTop: '20px' }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>Common Questions</div>
            </div>
            {[
              ['How long does approval take?',      'Most applications are reviewed within 3–5 business days.'],
              ['How do I get paid?',                'Payouts are processed every Friday via Interac e-Transfer or direct deposit.'],
              ['Can I update my service areas?',    'Yes — go to Profile and edit your coverage area at any time.'],
            ].map(([q, a]) => (
              <div key={q} style={{ padding: '16px 24px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>{q}</div>
                <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>{a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
