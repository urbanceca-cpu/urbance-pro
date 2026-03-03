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

const DEMO_HISTORY = [
  { id: 'p1', period: 'Feb 24 – Feb 28, 2026', jobs: 3, gross: 550, fee: 55,  net: 495,  status: 'paid',    paid_on: 'Mar 1, 2026' },
  { id: 'p2', period: 'Feb 17 – Feb 21, 2026', jobs: 2, gross: 320, fee: 32,  net: 288,  status: 'paid',    paid_on: 'Feb 22, 2026' },
  { id: 'p3', period: 'Feb 10 – Feb 14, 2026', jobs: 4, gross: 710, fee: 71,  net: 639,  status: 'paid',    paid_on: 'Feb 15, 2026' },
];

export default function EarningsPage() {
  const [method, setMethod]   = useState('etransfer');
  const [email,  setEmail]    = useState('');
  const [transit, setTransit] = useState('');
  const [institution, setInst]= useState('');
  const [account, setAcct]    = useState('');
  const [saved,  setSaved]    = useState(false);

  const handleSave = () => {
    if (method === 'etransfer' && !email) { toast.error('Enter an e-Transfer email'); return; }
    if (method === 'direct' && (!transit || !institution || !account)) { toast.error('Fill in all banking fields'); return; }
    setSaved(true);
    toast.success('Payout method saved!');
  };

  const totalEarned = DEMO_HISTORY.reduce((a,b) => a + b.net, 0);

  return (
    <div style={S.shell}>
      <DashboardSidebar />
      <div style={S.main}>
        <div style={S.topbar}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#111' }}>Earnings</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '1px' }}>Earnings, history & payment setup</div>
          </div>
        </div>

        <div style={S.content}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '24px' }}>
            {[
              { label: 'Total Earned',  value: `$${totalEarned.toLocaleString()}.00`, sub: 'All time',        color: '#059669', bg: '#ECFDF5' },
              { label: 'This Month',    value: '$0.00',                                sub: 'March 2026',     color: '#3B82F6', bg: '#EFF6FF' },
              { label: 'Pending',       value: '$0.00',                                sub: 'Awaiting payout',color: '#D97706', bg: '#FFFBEB' },
            ].map(s => (
              <div key={s.label} style={{ ...S.card, padding: '20px 24px' }}>
                <div style={{ fontSize: '11px', fontWeight: 600, color: '#94A3B8', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '10px' }}>{s.label}</div>
                <div style={{ fontSize: '26px', fontWeight: 700, color: '#111', letterSpacing: '-0.03em' }}>{s.value}</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '5px' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', alignItems: 'start' }}>
            {/* History */}
            <div style={S.card}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>Payout History</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Weekly payouts every Friday</div>
              </div>
              {DEMO_HISTORY.map((p, i) => (
                <div key={p.id} style={{ padding: '16px 24px', borderBottom: i < DEMO_HISTORY.length - 1 ? '1px solid #F8FAFC' : 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '9px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#111' }}>{p.period}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>{p.jobs} jobs · Paid {p.paid_on}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#059669' }}>${p.net}.00</div>
                    <div style={{ fontSize: '11px', color: '#CBD5E1', marginTop: '1px' }}>after 10% fee</div>
                  </div>
                </div>
              ))}
              <div style={{ padding: '14px 24px', background: '#F8FAFC', borderTop: '1px solid #F1F5F9', borderRadius: '0 0 12px 12px', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#374151' }}>Total</span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>${totalEarned.toLocaleString()}.00</span>
              </div>
            </div>

            {/* Payout setup */}
            <div style={S.card}>
              <div style={{ padding: '18px 20px', borderBottom: '1px solid #F1F5F9' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#111' }}>Payout Method</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>How you receive your earnings</div>
              </div>
              <div style={{ padding: '20px' }}>
                {/* Method selector */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
                  {[
                    { key: 'etransfer', label: '📧 e-Transfer', sub: 'Interac' },
                    { key: 'direct',    label: '🏦 Direct Deposit', sub: 'Bank account' },
                  ].map(m => (
                    <button key={m.key} onClick={() => setMethod(m.key)} style={{
                      padding: '10px', borderRadius: '9px', border: `1.5px solid ${method === m.key ? '#3B82F6' : '#E5E7EB'}`,
                      background: method === m.key ? '#EFF6FF' : '#fff', cursor: 'pointer', textAlign: 'center', fontFamily: 'inherit',
                    }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: method === m.key ? '#2F80ED' : '#111' }}>{m.label}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{m.sub}</div>
                    </button>
                  ))}
                </div>

                {method === 'etransfer' ? (
                  <div>
                    <label style={S.label}>e-Transfer Email</label>
                    <input style={S.input} type="email" placeholder="payments@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={S.label}>Transit #</label>
                        <input style={S.input} placeholder="12345" value={transit} onChange={e => setTransit(e.target.value)} maxLength={5} />
                      </div>
                      <div>
                        <label style={S.label}>Institution #</label>
                        <input style={S.input} placeholder="001" value={institution} onChange={e => setInst(e.target.value)} maxLength={3} />
                      </div>
                    </div>
                    <div>
                      <label style={S.label}>Account Number</label>
                      <input style={S.input} placeholder="1234567890" value={account} onChange={e => setAcct(e.target.value)} />
                    </div>
                  </div>
                )}

                <button style={{ ...S.btn, width: '100%', marginTop: '16px' }} onClick={handleSave}>
                  {saved ? '✓ Saved' : 'Save Payout Method'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
