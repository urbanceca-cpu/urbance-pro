'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export default function Earnings() {
  const heroRef      = useFadeIn();
  const diffRef      = useFadeIn();
  const howRef       = useFadeIn();
  const scheduleRef  = useFadeIn();
  const ctaRef       = useFadeIn();

  return (
    <>
      <Navbar />

      <main style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#111111',
        backgroundColor: '#ffffff',
      }}>

        {/* ── HERO ────────────────────────────────────────────────────── */}
        <section className="earn-hero-section" style={{
          padding: '160px 24px 120px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#0F172A',
        }}>
          {/* Background image */}
          <img
            src="/images/ChatGPT Image Feb 27, 2026, 01_04_44 PM.png"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              zIndex: 0, pointerEvents: 'none',
            }}
          />
          {/* Dark overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 1, pointerEvents: 'none' }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div ref={heroRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
              <div className="earn-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>

                {/* Left */}
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#60A5FA', letterSpacing: '0.16em', textTransform: 'uppercase' as const, margin: '0 0 24px' }}>Compensation</p>
                  <h1 style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 24px', lineHeight: 1.08 }}>
                    More of your work.<br />More in your pocket.
                  </h1>
                  <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.60)', lineHeight: 1.8, margin: '0 0 48px', maxWidth: '420px' }}>
                    Other platforms take 20–30% off every job. We built a different model — one that actually rewards the professional doing the work.
                  </p>
                  <div className="earn-hero-cta" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' as const }}>
                    <Link href="/apply" style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      backgroundColor: '#2F80ED', color: '#ffffff',
                      fontSize: '15px', fontWeight: 600, padding: '15px 32px',
                      borderRadius: '10px', textDecoration: 'none',
                      boxShadow: '0 8px 28px rgba(47,128,237,0.4)',
                    }}>
                      Apply Now
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7h10M8 3l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </Link>
                    <Link href="/how-it-works" style={{
                      display: 'inline-block', color: 'rgba(255,255,255,0.75)',
                      fontSize: '15px', fontWeight: 500, padding: '15px 32px',
                      borderRadius: '10px', textDecoration: 'none',
                      border: '1px solid rgba(255,255,255,0.18)',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                    }}>
                      How It Works
                    </Link>
                  </div>
                </div>

                {/* Right — stat cards */}
                <div className="earn-hero-stats" style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
                  {[
                    { label: 'Industry average platform cut', value: '20–30%', sub: 'What most platforms take off every job', color: '#EF4444', light: '#FEF2F2' },
                    { label: 'Urbance commission', value: '12%', sub: 'Our rate — industry\'s lowest for full-service networks', color: '#059669', light: '#ECFDF5' },
                    { label: 'No monthly fees', value: '$0', sub: 'No subscriptions, no pay-per-lead, no hidden charges', color: '#2F80ED', light: '#EBF3FD' },
                    { label: 'Payout schedule', value: 'Weekly', sub: 'Direct to your bank every Friday', color: '#D97706', light: '#FFFBEB' },
                  ].map((item) => (
                    <div key={item.label} style={{
                      display: 'flex', alignItems: 'center', gap: '20px',
                      backgroundColor: 'rgba(255,255,255,0.055)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: '14px', padding: '18px 22px',
                      backdropFilter: 'blur(8px)',
                    }}>
                      <div style={{
                        minWidth: '72px', height: '52px', borderRadius: '12px',
                        backgroundColor: item.light,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '17px', fontWeight: 800, color: item.color,
                        letterSpacing: '-0.03em', flexShrink: 0,
                      }}>{item.value}</div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', marginBottom: '3px' }}>{item.label}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>{item.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── THE DIFFERENCE ──────────────────────────────────────────── */}
        <section className="earn-diff-section" style={{ padding: '140px 24px', backgroundColor: '#ffffff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div ref={diffRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>

              <div style={{ textAlign: 'center' as const, marginBottom: '72px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#2F80ED', letterSpacing: '0.16em', textTransform: 'uppercase' as const, margin: '0 0 16px' }}>The Difference</p>
                <h2 style={{ fontSize: 'clamp(30px, 3vw, 46px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111111', margin: '0 0 20px', lineHeight: 1.12 }}>
                  Built for the professional, not the platform.
                </h2>
                <p style={{ fontSize: '17px', color: '#6B7280', lineHeight: 1.75, maxWidth: '560px', margin: '0 auto' }}>
                  We exist to grow alongside you — so our model is designed to give you the most competitive share in the industry.
                </p>
              </div>

              {/* Comparison table */}
              <div style={{ borderRadius: '20px', overflow: 'hidden', border: '1px solid #EEEFF1', boxShadow: '0 4px 40px rgba(0,0,0,0.05)' }}>
                {/* Header */}
                <div className="earn-compare-grid-header" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', backgroundColor: '#0F172A' }}>
                  <div style={{ padding: '20px 32px', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>Feature</div>
                  <div style={{ padding: '20px 24px', fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' as const, letterSpacing: '0.1em', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>Other Platforms</div>
                  <div style={{ padding: '20px 24px', fontSize: '12px', fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase' as const, letterSpacing: '0.1em', borderLeft: '1px solid rgba(255,255,255,0.06)' }}>Urbance</div>
                </div>
                {[
                  { feature: 'Commission rate',         others: '20–30% per job',         urbance: '12% — industry low',        good: true },
                  { feature: 'Monthly platform fee',    others: '$30–$100 / month',        urbance: 'None — ever',               good: true },
                  { feature: 'Lead purchasing',         others: 'Pay per lead, no guarantee', urbance: 'Pre-matched, no buying', good: true },
                  { feature: 'Payment guarantee',       others: 'Not always',              urbance: 'Every job, guaranteed',     good: true },
                  { feature: 'Payout speed',            others: 'Up to 30 days',           urbance: 'Every Friday',              good: true },
                  { feature: 'Client vetting',          others: 'Open to all',             urbance: 'Verified clients only',     good: true },
                  { feature: 'Background on providers', others: 'Varies',                  urbance: 'Required — all pros',       good: true },
                ].map((row, i) => (
                  <div key={row.feature} className="earn-compare-grid" style={
                    {
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr',
                    borderTop: '1px solid #F0F0F0',
                    backgroundColor: i % 2 === 0 ? '#ffffff' : '#FAFBFC',
                  }}>
                    <div className="earn-compare-feature" style={{ padding: '20px 32px', fontSize: '15px', fontWeight: 600, color: '#111111' }}>{row.feature}</div>
                    <div style={{ padding: '20px 24px', fontSize: '14px', color: '#9CA3AF', borderLeft: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#EF4444', fontSize: '16px', lineHeight: 1 }}>✕</span>
                      {row.others}
                    </div>
                    <div style={{ padding: '20px 24px', fontSize: '14px', color: '#059669', fontWeight: 600, borderLeft: '1px solid #F0F0F0', display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#F0FDF4' }}>
                      <span style={{ fontSize: '16px', lineHeight: 1 }}>✓</span>
                      {row.urbance}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── HOW EARNINGS FLOW ──────────────────────────────────────── */}
        <section className="earn-flow-section" style={{ padding: '120px 24px', backgroundColor: '#F8F9FC', borderTop: '1px solid #F0F0F0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div ref={howRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>

              <div className="earn-flow-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#2F80ED', letterSpacing: '0.16em', textTransform: 'uppercase' as const, margin: '0 0 20px' }}>How It Works</p>
                  <h2 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111111', margin: '0 0 20px', lineHeight: 1.15 }}>
                    Your earnings,<br />completely transparent.
                  </h2>
                  <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.8, margin: '0 0 40px' }}>
                    Every job comes with a clear breakdown before you accept it. No surprises after completion — what you see is what you earn. A single, low commission is deducted automatically. Everything else goes directly to you.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
                    {[
                      { icon: '📋', title: 'Clear job value upfront', body: 'See the full job amount before you accept or decline.' },
                      { icon: '⚡', title: 'Instant confirmation', body: 'Accept a job and it\'s secured — no undercutting or rebidding.' },
                      { icon: '🏦', title: 'Automatic weekly deposit', body: 'No invoicing, no chasing. Earnings hit your bank every Friday.' },
                    ].map((item) => (
                      <div key={item.title} style={{
                        display: 'flex', gap: '16px', alignItems: 'flex-start',
                        backgroundColor: '#ffffff', borderRadius: '14px',
                        border: '1px solid #EEEFF1', padding: '20px 22px',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
                      }}>
                        <div style={{ fontSize: '22px', flexShrink: 0, marginTop: '2px' }}>{item.icon}</div>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#111111', marginBottom: '4px' }}>{item.title}</div>
                          <div style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.6 }}>{item.body}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual — payout flow */}
                <div>
                  <div style={{
                    backgroundColor: '#ffffff', borderRadius: '20px',
                    border: '1px solid #EEEFF1', overflow: 'hidden',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
                  }}>
                    {/* Header */}
                    <div style={{ padding: '24px 28px', borderBottom: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#111111' }}>Earnings Breakdown</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: '#059669', backgroundColor: '#ECFDF5', padding: '4px 10px', borderRadius: '100px' }}>Example only</span>
                    </div>
                    {/* Rows */}
                    {[
                      { label: 'Job total (client pays)', value: '—', note: 'Full service amount', highlight: false, bold: false },
                      { label: 'Urbance commission', value: '12%', note: 'Industry lowest', highlight: false, bold: false, red: true },
                      { label: 'No monthly fee', value: '$0', note: 'Never charged', highlight: false, bold: false },
                      { label: 'No lead fee', value: '$0', note: 'Jobs matched to you free', highlight: false, bold: false },
                      { label: 'Your earnings', value: '88%+', note: 'Of every completed job', highlight: true, bold: true },
                    ].map((row, i) => (
                      <div key={row.label} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '18px 28px',
                        borderTop: i === 0 ? 'none' : '1px solid #F5F7FA',
                        backgroundColor: row.highlight ? '#F0FDF4' : 'transparent',
                      }}>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: row.bold ? 700 : 500, color: row.highlight ? '#059669' : '#374151' }}>{row.label}</div>
                          <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '2px' }}>{row.note}</div>
                        </div>
                        <div style={{
                          fontSize: '18px', fontWeight: 800,
                          color: row.highlight ? '#059669' : (row.red ? '#EF4444' : '#111111'),
                          letterSpacing: '-0.03em',
                        }}>{row.value}</div>
                      </div>
                    ))}
                    <div style={{ padding: '16px 28px', backgroundColor: '#F8F9FC', borderTop: '1px solid #F0F0F0' }}>
                      <p style={{ fontSize: '12px', color: '#9CA3AF', margin: 0 }}>Actual amounts vary by job. No other deductions apply.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── PAYMENT SCHEDULE ─────────────────────────────────── */}
        <section style={{ padding: '120px 24px', backgroundColor: '#ffffff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div ref={scheduleRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>

              <div style={{ textAlign: 'center' as const, marginBottom: '72px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#2F80ED', letterSpacing: '0.16em', textTransform: 'uppercase' as const, margin: '0 0 16px' }}>Payouts</p>
                <h2 style={{ fontSize: 'clamp(28px, 3vw, 42px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111111', margin: 0, lineHeight: 1.12 }}>
                  Every Friday, without fail.
                </h2>
              </div>

              <div className="earn-sched-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', backgroundColor: '#EEEFF1', borderRadius: '20px', overflow: 'hidden' }}>
                {[
                  { n: '01', color: '#2F80ED', light: '#EBF3FD', title: 'Job Completed',     body: 'Client confirms the work is done and releases payment from escrow.' },
                  { n: '02', color: '#7C3AED', light: '#F5F3FF', title: 'Funds Cleared',      body: 'Your earnings are verified and show up in your dashboard within hours.' },
                  { n: '03', color: '#059669', light: '#ECFDF5', title: 'Weekly Batch',       body: 'All cleared earnings from the week are bundled into a single transfer.' },
                  { n: '04', color: '#D97706', light: '#FFFBEB', title: 'Bank Deposit',       body: 'Funds land in your account every Friday — no minimums, no delays.' },
                ].map((item) => (
                  <div key={item.n} className="earn-sched-cell" style={{ backgroundColor: '#ffffff', padding: '44px 32px' }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '12px',
                      backgroundColor: item.light,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 800, color: item.color,
                      marginBottom: '20px',
                    }}>{item.n}</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#111111', marginBottom: '10px' }}>{item.title}</div>
                    <div style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.7 }}>{item.body}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ── STAT STRIP ───────────────────────────────────────── */}
        <section style={{ padding: '0 24px 120px', backgroundColor: '#ffffff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div className="earn-stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {[
                { stat: '12%',    label: 'Flat commission',         sub: 'The lowest in the industry for full-service networks', color: '#2F80ED', light: '#EBF3FD' },
                { stat: 'Weekly', label: 'Direct bank payouts',     sub: 'Every Friday, automatically — no action needed',       color: '#059669', light: '#ECFDF5' },
                { stat: '$0',     label: 'Platform or monthly fees', sub: 'No subscriptions, no lead buying, no hidden costs',   color: '#7C3AED', light: '#F5F3FF' },
              ].map((item) => (
                <div key={item.label} className="earn-stat-card" style={{
                  backgroundColor: item.light, borderRadius: '20px',
                  padding: '44px 36px',
                  border: `1px solid ${item.color}22`,
                }}>
                  <div style={{ fontSize: '40px', fontWeight: 800, color: item.color, letterSpacing: '-0.04em', marginBottom: '10px' }}>{item.stat}</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#111111', marginBottom: '8px' }}>{item.label}</div>
                  <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.65 }}>{item.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────── */}
        <section className="earn-cta-section" style={{
          padding: '140px 24px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          position: 'relative' as const,
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(47,128,237,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' as const, position: 'relative' as const, zIndex: 1 }}>
            <div ref={ctaRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#60A5FA', letterSpacing: '0.16em', textTransform: 'uppercase' as const, margin: '0 0 24px' }}>Ready?</p>
              <h2 style={{ fontSize: 'clamp(34px, 4vw, 54px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 20px', lineHeight: 1.1 }}>
                Earn more.<br />Keep more.
              </h2>
              <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', margin: '0 0 52px', lineHeight: 1.75 }}>
                Join a network that works for you. Apply in under 10 minutes.
              </p>
              <Link href="/apply" className="earn-cta-btn" style={
                {
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                backgroundColor: '#2F80ED', color: '#ffffff',
                fontSize: '16px', fontWeight: 600, padding: '18px 44px',
                borderRadius: '12px', textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(47,128,237,0.45)',
              }}>
                Apply Now
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', margin: '20px 0 0' }}>
                Takes less than 10 minutes · No commitment required
              </p>
            </div>
          </div>
        </section>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
          *, *::before, *::after { box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          body { -webkit-font-smoothing: antialiased; overflow-x: hidden; }
          h1, h2, h3, p { margin: 0; }
          @media (max-width: 900px) {
            [data-two-col]   { grid-template-columns: 1fr !important; gap: 40px !important; }
            [data-four-col]  { grid-template-columns: 1fr 1fr !important; }
            [data-three-col] { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 640px) {
            /* Hero */
            .earn-hero-section { padding: 110px 16px 72px !important; }
            .earn-hero-grid    { grid-template-columns: 1fr !important; gap: 32px !important; }
            .earn-hero-stats   { display: none !important; }
            .earn-hero-cta     { flex-direction: column !important; gap: 10px !important; }
            .earn-hero-cta a   { width: 100% !important; text-align: center !important; justify-content: center !important; }

            /* Comparison table */
            .earn-diff-section { padding: 64px 16px !important; }
            .earn-compare-grid { grid-template-columns: 1fr 1fr !important; }
            .earn-compare-feature { display: none !important; }
            .earn-compare-grid-header { grid-template-columns: 1fr 1fr !important; }

            /* Earnings flow */
            .earn-flow-section { padding: 64px 16px !important; }
            .earn-flow-grid    { grid-template-columns: 1fr !important; gap: 32px !important; }

            /* Payment schedule */
            .earn-sched-section { padding: 64px 16px !important; }
            .earn-sched-grid    { grid-template-columns: 1fr 1fr !important; border-radius: 14px !important; }
            .earn-sched-cell    { padding: 28px 20px !important; }

            /* Stat strip */
            .earn-stat-strip  { padding: 0 16px 64px !important; }
            .earn-stat-grid   { grid-template-columns: 1fr !important; gap: 16px !important; }
            .earn-stat-card   { padding: 32px 24px !important; border-radius: 16px !important; }

            /* CTA */
            .earn-cta-section { padding: 72px 16px !important; }
            .earn-cta-btn     { width: 100% !important; justify-content: center !important; }
          }
          @media (max-width: 400px) {
            .earn-compare-grid        { grid-template-columns: 1fr !important; }
            .earn-compare-grid-header { grid-template-columns: 1fr !important; }
            .earn-sched-grid          { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}
