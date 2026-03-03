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

const steps = [
  {
    n: '01',
    title: 'Apply Online',
    body: 'Fill out our application in under 10 minutes — trade, experience, service area, and credentials. Free to apply, no commitment required.',
    details: ['Free to apply', 'Takes < 10 minutes', 'Mobile-friendly form', 'Instant confirmation'],
    time: '~10 min',
    color: '#2F80ED',
    light: '#EBF3FD',
  },
  {
    n: '02',
    title: 'Get Verified',
    body: 'We conduct a thorough identity, background, and insurance check. We maintain a high bar so every client interaction reflects the quality of our network.',
    details: ['Identity check', 'Criminal record check', 'Insurance validation', 'Reference review'],
    time: '3–5 days',
    color: '#7C3AED',
    light: '#F5F3FF',
  },
  {
    n: '03',
    title: 'Set Up Your Profile',
    body: 'Once approved, build your professional profile — services, rates, availability, and service radius. Your profile is how clients find and choose you.',
    details: ['Services & pricing', 'Service area radius', 'Portfolio photos', 'Availability settings'],
    time: '30 min',
    color: '#059669',
    light: '#ECFDF5',
  },
  {
    n: '04',
    title: 'Receive Matched Jobs',
    body: 'Pre-qualified job requests matched to your skills and location arrive directly in your dashboard. No bidding, no cold leads — just ready-to-book work.',
    details: ['Pre-qualified clients', 'Job details upfront', 'Accept or decline freely', 'Real-time notifications'],
    time: 'Day 1',
    color: '#D97706',
    light: '#FFFBEB',
  },
  {
    n: '05',
    title: 'Complete Work & Get Paid',
    body: 'Deliver quality work, collect a verified review, and get paid. Earnings are deposited directly to your bank every week — no invoicing required.',
    details: ['Weekly direct deposits', 'Full earnings breakdown', 'Automatic payments', 'No chasing clients'],
    time: 'Weekly',
    color: '#0891B2',
    light: '#ECFEFF',
  },
];

export default function HowItWorks() {
  const heroRef   = useFadeIn();
  const stepsRef  = useFadeIn();
  const stripRef  = useFadeIn();
  const ctaRef    = useFadeIn();

  return (
    <>
      <Navbar />

      <main style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        color: '#111111',
        backgroundColor: '#ffffff',
      }}>

        {/* HERO */}
        <section className="hiw-hero-section" style={{
          padding: '160px 24px 120px',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#0F172A',
        }}>
          {/* Background image */}
          <img
            src="/images/ChatGPT Image Feb 27, 2026, 12_38_33 PM.png"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute', inset: 0, width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              zIndex: 0, pointerEvents: 'none',
            }}
          />
          {/* Dark overlay so text stays legible */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.52)', zIndex: 1, pointerEvents: 'none' }} />

          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <div ref={heroRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
              <div className="hiw-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>

                {/* Left */}
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#60A5FA', letterSpacing: '0.16em', textTransform: 'uppercase' as const, margin: '0 0 24px' }}>Process</p>
                  <h1 style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 24px', lineHeight: 1.08 }}>
                    From application<br />to your first payout.
                  </h1>
                  <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.60)', lineHeight: 1.8, margin: '0 0 48px', maxWidth: '400px' }}>
                    Five steps. Under a week. Most pros are earning on day one after approval.
                  </p>
                  <div className="hiw-hero-cta" style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' as const }}>
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
                    <Link href="/earnings" style={{
                      display: 'inline-block', color: 'rgba(255,255,255,0.75)',
                      fontSize: '15px', fontWeight: 500, padding: '15px 32px',
                      borderRadius: '10px', textDecoration: 'none',
                      border: '1px solid rgba(255,255,255,0.18)',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                    }}>
                      View Earnings
                    </Link>
                  </div>
                </div>

                {/* Right — step chips */}
                <div className="hiw-hero-chips" style={{ display: 'flex', flexDirection: 'column' as const, gap: '10px' }}>
                  {steps.map((s) => (
                    <div key={s.n} style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      backgroundColor: 'rgba(255,255,255,0.055)',
                      border: '1px solid rgba(255,255,255,0.09)',
                      borderRadius: '12px', padding: '14px 18px',
                      backdropFilter: 'blur(8px)',
                    }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px',
                        backgroundColor: s.light, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 800, color: s.color, flexShrink: 0,
                      }}>{s.n}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: 600, color: '#ffffff', marginBottom: '2px' }}>{s.title}</div>
                        <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>{s.body.split('.')[0]}.</div>
                      </div>
                      <div style={{
                        backgroundColor: s.light, color: s.color,
                        fontSize: '11px', fontWeight: 700, padding: '4px 10px',
                        borderRadius: '100px', whiteSpace: 'nowrap' as const, flexShrink: 0,
                      }}>{s.time}</div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* STEPS — alternating two-column */}
        <section className="hiw-steps-section" style={{ padding: '140px 24px', backgroundColor: '#ffffff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div ref={stepsRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>

              <div style={{ textAlign: 'center' as const, marginBottom: '80px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#2F80ED', letterSpacing: '0.16em', textTransform: 'uppercase' as const, margin: '0 0 16px' }}>Step by Step</p>
                <h2 style={{ fontSize: 'clamp(30px, 3vw, 46px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111111', margin: 0, lineHeight: 1.12 }}>
                  Every step, explained.
                </h2>
              </div>

              {steps.map((s, i) => (
                <div key={s.n} className="hiw-step-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '80px',
                  alignItems: 'center',
                  padding: '80px 0',
                  borderBottom: i < steps.length - 1 ? '1px solid #F0F0F0' : 'none',
                }}>
                  {/* Text side */}
                  <div className="hiw-step-text" style={{ order: i % 2 === 0 ? 0 : 1 }}>
                    <div style={{
                      display: 'inline-flex', alignItems: 'center', gap: '10px',
                      backgroundColor: s.light, borderRadius: '10px',
                      padding: '8px 16px', marginBottom: '28px',
                    }}>
                      <span style={{ fontSize: '12px', fontWeight: 800, color: s.color, letterSpacing: '0.06em' }}>{s.n}</span>
                      <span style={{ width: '1px', height: '14px', backgroundColor: s.color, opacity: 0.25, display: 'inline-block' }} />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: s.color }}>{s.time}</span>
                    </div>
                    <h3 style={{ fontSize: 'clamp(24px, 2.4vw, 34px)', fontWeight: 700, color: '#111111', margin: '0 0 18px', letterSpacing: '-0.025em', lineHeight: 1.2 }}>{s.title}</h3>
                    <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.8, margin: '0 0 32px' }}>{s.body}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      {s.details.map((d) => (
                        <div key={d} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '20px', height: '20px', borderRadius: '50%',
                            backgroundColor: s.light, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                              <path d="M1.5 4.5l2 2L7.5 2" stroke={s.color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Visual side */}
                  <div className="hiw-step-visual" style={{ order: i % 2 === 0 ? 1 : 0 }}>
                    <div style={{
                      borderRadius: '20px',
                      overflow: 'hidden',
                      aspectRatio: '4/3',
                      backgroundColor: s.light,
                      boxShadow: `0 20px 56px ${s.color}22`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative' as const,
                    }}>
                      <img
                        src={`/images/step-0${i + 1}.jpg`}
                        alt={s.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TIMELINE STRIP */}
        <section className="hiw-strip-section" style={{ padding: '100px 24px', backgroundColor: '#F8F9FC', borderTop: '1px solid #F0F0F0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div ref={stripRef} style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
              <div className="hiw-strip-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', backgroundColor: '#EEEFF1', borderRadius: '20px', overflow: 'hidden' }}>
                {[
                  { stat: '< 10 min', label: 'Application',  sub: 'Fill out the form, upload credentials' },
                  { stat: '3–5 days', label: 'Verification', sub: 'Background & insurance check' },
                  { stat: 'Day 1',    label: 'First Job',    sub: 'Start earning from approval day' },
                ].map((item) => (
                  <div key={item.label} className="hiw-strip-cell" style={{ backgroundColor: '#ffffff', padding: '48px 40px' }}>
                    <div style={{ fontSize: '36px', fontWeight: 800, color: '#111111', letterSpacing: '-0.035em', marginBottom: '8px' }}>{item.stat}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#111111', marginBottom: '6px' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: 1.6 }}>{item.sub}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="hiw-cta-section" style={{
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
                Start your application<br />today.
              </h2>
              <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', margin: '0 0 52px', lineHeight: 1.75 }}>
                Takes less than 10 minutes. No fees, no commitment.
              </p>
              <Link href="/apply" className="hiw-cta-btn" style={{
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
            [data-grid] { grid-template-columns: 1fr !important; gap: 40px !important; }
          }
          @media (max-width: 640px) {
            /* Hero */
            .hiw-hero-section { padding: 110px 16px 72px !important; }
            .hiw-hero-grid    { grid-template-columns: 1fr !important; gap: 32px !important; }
            .hiw-hero-chips   { display: none !important; }
            .hiw-hero-cta     { flex-direction: column !important; gap: 10px !important; }
            .hiw-hero-cta a   { width: 100% !important; text-align: center !important; justify-content: center !important; }

            /* Steps section */
            .hiw-steps-section { padding: 64px 16px !important; }
            .hiw-step-grid     { grid-template-columns: 1fr !important; gap: 0 !important; }
            .hiw-step-visual   { display: none !important; }
            .hiw-step-text     { order: 0 !important; padding: 40px 0 !important; }
            .hiw-step-details  { grid-template-columns: 1fr !important; }

            /* Timeline strip */
            .hiw-strip-section { padding: 56px 16px !important; }
            .hiw-strip-grid    { grid-template-columns: 1fr !important; gap: 1px !important; }
            .hiw-strip-cell    { padding: 32px 24px !important; }

            /* CTA */
            .hiw-cta-section { padding: 72px 16px !important; }
            .hiw-cta-btn     { width: 100% !important; justify-content: center !important; }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}
