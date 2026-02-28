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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

export function HomePage() {
  const heroRef = useFadeIn();
  const valuesRef = useFadeIn();
  const howRef = useFadeIn();
  const earningsRef = useFadeIn();
  const partnersRef = useFadeIn();
  const applyRef = useFadeIn();

  return (
    <>
      <Navbar />

      <main style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        color: '#111111',
        backgroundColor: '#ffffff',
      }}>

        {/* HERO */}
        <section style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}>
          {/* Full-bleed background image */}
          <img
            src="/images/ChatGPT Image Feb 27, 2026, 11_34_58 AM.png"
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center top',
              zIndex: 0,
            }}
          />
          {/* Dark overlay for text legibility */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.28) 60%, rgba(0,0,0,0.10) 100%)',
            zIndex: 1,
          }} />
          {/* White gradient fade behind text */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '70%',
            height: '100%',
            background: 'linear-gradient(to right, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.55) 40%, rgba(255,255,255,0.15) 70%, transparent 100%)',
            zIndex: 1,
            pointerEvents: 'none',
          }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, width: '100%', padding: '160px 24px 100px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%' }}>

              <div
                ref={heroRef}
                style={{
                  opacity: 0,
                  transform: 'translateY(24px)',
                  transition: 'opacity 0.8s ease, transform 0.8s ease',
                  maxWidth: '620px',
                }}
              >
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#EBF3FD',
                  color: '#2F80ED',
                  fontSize: '12px',
                  fontWeight: 600,
                  letterSpacing: '0.07em',
                  padding: '6px 14px',
                  borderRadius: '100px',
                  marginBottom: '40px',
                  textTransform: 'uppercase' as const,
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2F80ED', display: 'inline-block' }} />
                  Now Accepting Applications &nbsp;·&nbsp; British Columbia
                </div>

                <h1 style={{
                  fontSize: 'clamp(38px, 4.8vw, 60px)',
                  fontWeight: 700,
                  lineHeight: 1.1,
                  letterSpacing: '-0.03em',
                  color: '#111111',
                  margin: '0 0 28px 0',
                  maxWidth: '560px',
                }}>
                  Build a stronger service business with Urbance.
                </h1>

                <p style={{
                  fontSize: '18px',
                  lineHeight: 1.75,
                  color: '#6B7280',
                  margin: '0 0 52px 0',
                  maxWidth: '440px',
                }}>
                  We connect trusted professionals with high-quality clients across British Columbia.
                </p>

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' as const }}>
                  <Link href="/apply" style={{
                    display: 'inline-block',
                    backgroundColor: '#2F80ED',
                    color: '#ffffff',
                    fontSize: '15px',
                    fontWeight: 600,
                    padding: '15px 32px',
                    borderRadius: '9px',
                    textDecoration: 'none',
                    letterSpacing: '-0.01em',
                  }}>
                    Apply to Join
                  </Link>
                  <a href="#how-it-works" style={{
                    display: 'inline-block',
                    color: '#374151',
                    fontSize: '15px',
                    fontWeight: 500,
                    padding: '15px 32px',
                    borderRadius: '9px',
                    textDecoration: 'none',
                    border: '1px solid #E5E7EB',
                    backgroundColor: 'rgba(255,255,255,0.7)',
                  }}>
                    See How It Works
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SOCIAL PROOF STRIP */}
        <section style={{ backgroundColor: '#F5F7FA', padding: '22px 24px', borderTop: '1px solid #EEEFF1', borderBottom: '1px solid #EEEFF1' }}>
          <p style={{
            fontSize: '12px',
            fontWeight: 600,
            color: '#9CA3AF',
            letterSpacing: '0.09em',
            margin: 0,
            textAlign: 'center' as const,
            textTransform: 'uppercase' as const,
          }}>
            Serving&nbsp;&nbsp;
            <span style={{ color: '#6B7280', fontWeight: 500, textTransform: 'none' as const }}>
              Vancouver &nbsp;·&nbsp; Burnaby &nbsp;·&nbsp; Surrey &nbsp;·&nbsp; Richmond &nbsp;·&nbsp; Coquitlam &nbsp;·&nbsp; North Vancouver &nbsp;·&nbsp; Delta
            </span>
          </p>
        </section>

        {/* WHY URBANCE */}
        <section style={{ padding: '0', backgroundColor: '#ffffff', borderTop: '1px solid #F0F0F0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div
              ref={valuesRef}
              style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #F0F0F0' }}>

                {/* Left sticky panel */}
                <div style={{
                  padding: '96px 72px 96px 0',
                  borderRight: '1px solid #F0F0F0',
                  position: 'sticky' as const,
                  top: '100px',
                  alignSelf: 'start' as const,
                }}>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#2F80ED', letterSpacing: '0.14em', textTransform: 'uppercase' as const, margin: '0 0 20px' }}>Why Urbance</p>
                  <h2 style={{
                    fontSize: 'clamp(32px, 3.2vw, 48px)',
                    fontWeight: 700,
                    letterSpacing: '-0.03em',
                    color: '#111111',
                    margin: '0 0 24px',
                    lineHeight: 1.12,
                  }}>
                    The platform built<br />around your success.
                  </h2>
                  <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.8, margin: '0 0 52px', maxWidth: '360px' }}>
                    Every feature of Urbance was designed with one goal — giving skilled tradespeople a reliable, dignified way to grow.
                  </p>
                  {/* Coloured stat pills */}
                  <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '16px' }}>
                    {[
                      { stat: '2–3×', label: 'avg. earnings vs. self-sourced work', bg: '#EBF3FD', statColor: '#2F80ED' },
                      { stat: '98%',   label: 'pro retention after year one',        bg: '#FFF7ED', statColor: '#EA580C' },
                    ].map(s => (
                      <div key={s.stat} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        backgroundColor: s.bg,
                        borderRadius: '12px',
                        padding: '16px 20px',
                      }}>
                        <span style={{ fontSize: '24px', fontWeight: 800, color: s.statColor, letterSpacing: '-0.03em', minWidth: '68px' }}>{s.stat}</span>
                        <span style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.5 }}>{s.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: feature rows with coloured left borders */}
                <div style={{ paddingLeft: '72px' }}>
                  {[
                    {
                      title: 'Jobs matched to you — no bidding',
                      body: 'We analyze your skills, location, and availability to surface the right jobs at the right time. You never have to fight for work again.',
                      tag: 'Smart Matching',
                      tagBg: '#EBF3FD',
                      tagColor: '#2F80ED',
                      borderColor: '#2F80ED',
                    },
                    {
                      title: 'We handle everything behind the scenes',
                      body: 'Scheduling, client communication, invoicing, and dispute resolution are all managed by Urbance. You show up, do the work, and get paid.',
                      tag: 'Full Operations',
                      tagBg: '#F0FDF4',
                      tagColor: '#16A34A',
                      borderColor: '#16A34A',
                    },
                    {
                      title: 'Transparent, weekly payments',
                      body: 'A flat commission with no hidden fees or subscriptions. Earnings hit your account every week — tracked live in your dashboard.',
                      tag: 'Financial Clarity',
                      tagBg: '#FFF7ED',
                      tagColor: '#EA580C',
                      borderColor: '#EA580C',
                    },
                    {
                      title: 'Build a reputation that compounds',
                      body: 'Verified reviews from every Urbance job stack into a professional profile that makes clients choose you first — even outside the platform.',
                      tag: 'Reputation Engine',
                      tagBg: '#F5F3FF',
                      tagColor: '#7C3AED',
                      borderColor: '#7C3AED',
                    },
                  ].map((f, i, arr) => (
                    <div key={f.title} style={{
                      padding: '44px 0 44px 28px',
                      borderLeft: `3px solid ${f.borderColor}`,
                      marginBottom: i < arr.length - 1 ? '8px' : 0,
                      borderBottom: i < arr.length - 1 ? '1px solid #F5F5F5' : 'none',
                    }}>
                      <div style={{
                        display: 'inline-block',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: f.tagColor,
                        backgroundColor: f.tagBg,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        letterSpacing: '0.04em',
                        marginBottom: '14px',
                      }}>{f.tag}</div>
                      <h3 style={{ fontSize: '19px', fontWeight: 700, color: '#111111', margin: '0 0 10px', letterSpacing: '-0.02em', lineHeight: 1.35 }}>{f.title}</h3>
                      <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: 1.8, margin: 0 }}>{f.body}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" style={{
          padding: '140px 24px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #F0F0F0',
          position: 'relative' as const,
          overflow: 'hidden',
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' as const, zIndex: 1 }}>
            <div
              ref={howRef}
              style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.8s ease, transform 0.8s ease' }}
            >
              {/* Header */}
              <div style={{ marginBottom: '72px' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, color: '#2F80ED', letterSpacing: '0.16em', textTransform: 'uppercase' as const, margin: '0 0 20px' }}>Process</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
                  <h2 style={{ fontSize: 'clamp(32px, 3.4vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111111', margin: 0, lineHeight: 1.1 }}>
                    From application<br />to payday.
                  </h2>
                  <p style={{ fontSize: '16px', color: '#6B7280', margin: 0, lineHeight: 1.75, maxWidth: '340px' }}>
                    The whole process takes under a week. Every step is designed to be effortless on your end.
                  </p>
                </div>
              </div>

              {/* Process banner image */}
              <div style={{
                borderRadius: '20px',
                overflow: 'hidden',
                marginBottom: '28px',
                boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
                backgroundColor: '#F5F7FA',
              }}>
                <img
                  src="/images/ChatGPT Image Feb 27, 2026, 12_24_44 PM.png"
                  alt="Process visual"
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </div>

              {/* Steps — 5 equal columns */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', alignItems: 'stretch' }}>
                {[
                  {
                    n: '01',
                    title: 'Apply Online',
                    desc: 'Trade, location, credentials. No fees, no commitment.',
                    time: '~10 min',
                    color: '#2F80ED',
                    light: '#EBF3FD',
                  },
                  {
                    n: '02',
                    title: 'Get Verified',
                    desc: 'We review your licence, insurance, and background.',
                    time: '3–5 days',
                    color: '#7C3AED',
                    light: '#F5F3FF',
                  },
                  {
                    n: '03',
                    title: 'Receive Jobs',
                    desc: 'Matched jobs land in your dashboard. No bidding.',
                    time: 'Day 1',
                    color: '#059669',
                    light: '#ECFDF5',
                  },
                  {
                    n: '04',
                    title: 'Do the Work',
                    desc: 'Show up, deliver quality, collect a verified review.',
                    time: 'Ongoing',
                    color: '#D97706',
                    light: '#FFFBEB',
                  },
                  {
                    n: '05',
                    title: 'Get Paid',
                    desc: 'Automatic weekly deposits. No invoices. No chasing.',
                    time: 'Weekly',
                    color: '#0891B2',
                    light: '#ECFEFF',
                  },
                ].map((s) => (
                  <div key={s.n} style={{
                    backgroundColor: '#FAFAFA',
                    border: `1.5px solid ${s.light}`,
                    borderTop: `4px solid ${s.color}`,
                    borderRadius: '16px',
                    padding: '32px 24px 28px',
                    display: 'flex',
                    flexDirection: 'column' as const,
                    gap: '16px',
                    boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                  }}>
                    {/* Step number circle */}
                    <div style={{
                      width: '40px', height: '40px',
                      borderRadius: '50%',
                      backgroundColor: s.light,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: s.color,
                    }}>{s.n}</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111111', margin: '0 0 8px', letterSpacing: '-0.02em', lineHeight: 1.3 }}>{s.title}</h3>
                      <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: 1.75, margin: 0 }}>{s.desc}</p>
                    </div>
                    {/* Time badge */}
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: s.light,
                      color: s.color,
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '5px 12px',
                      borderRadius: '100px',
                      width: 'fit-content',
                    }}>{s.time}</div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* EARNINGS */}
        <section id="earnings" style={{ padding: '140px 24px', backgroundColor: '#F8F9FC', borderTop: '1px solid #F0F0F0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div
              ref={earningsRef}
              style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.8s ease, transform 0.8s ease' }}
            >
              {/* Two-column layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>

                {/* Left — image */}
                <div style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  aspectRatio: '4/3',
                  backgroundColor: '#E9EBF0',
                  position: 'relative' as const,
                  boxShadow: '0 24px 64px rgba(0,0,0,0.10)',
                }}>
                  {/* IMAGE SLOT — replace src with your image path e.g. src="/images/earnings.jpg" */}
                  <img
                    src="/images/ChatGPT Image Feb 27, 2026, 12_17_24 PM.png"
                    alt="Earnings visual"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
                  />
                </div>

                {/* Right — content */}
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700, color: '#2F80ED', letterSpacing: '0.16em', textTransform: 'uppercase' as const, margin: '0 0 20px' }}>Compensation</p>
                  <h2 style={{ fontSize: 'clamp(30px, 3vw, 46px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#111111', margin: '0 0 20px', lineHeight: 1.12 }}>
                    Transparent<br />by design.
                  </h2>
                  <p style={{ fontSize: '16px', color: '#6B7280', lineHeight: 1.8, margin: '0 0 48px' }}>
                    No hidden fees. No subscriptions. No pay-per-lead traps. Just a simple commission on jobs you complete.
                  </p>

                  {/* Earnings table */}
                  <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '16px',
                    border: '1px solid #E5E7EB',
                    overflow: 'hidden',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.05)',
                  }}>
                    {[
                      { label: 'Commission Rate', value: '5–7%', note: 'Scales with volume', highlight: true },
                      { label: 'Monthly Subscription', value: '$0', note: 'No monthly charges', highlight: false },
                      { label: 'Lead Buying', value: 'None', note: 'Jobs come to you', highlight: false },
                      { label: 'Payment Security', value: '100%', note: 'All transactions secured', highlight: false },
                      { label: 'Payout Schedule', value: 'Weekly', note: 'Direct bank deposit', highlight: false },
                    ].map((row, i) => (
                      <div key={row.label} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '18px 28px',
                        borderTop: i === 0 ? 'none' : '1px solid #F5F7FA',
                        backgroundColor: row.highlight ? '#EBF3FD' : 'transparent',
                      }}>
                        <span style={{ fontSize: '14px', color: '#374151', fontWeight: 500 }}>{row.label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '17px', fontWeight: 800, color: row.highlight ? '#2F80ED' : '#111111', letterSpacing: '-0.02em' }}>{row.value}</span>
                          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>{row.note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* SELECTIVE PARTNERS */}
        <section id="requirements" style={{ padding: '120px 24px', backgroundColor: '#ffffff', borderTop: '1px solid #F0F0F0' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div
              ref={partnersRef}
              className="partners-grid"
              style={{
                display: 'grid',
                gap: '100px',
                alignItems: 'center',
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'opacity 0.8s ease, transform 0.8s ease',
              }}
            >
              <div>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#2F80ED', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: '20px' }}>Standards</p>
                <h2 style={{ fontSize: 'clamp(30px, 3.2vw, 44px)', fontWeight: 700, letterSpacing: '-0.025em', color: '#111111', margin: '0 0 24px', lineHeight: 1.15 }}>
                  We partner with serious professionals.
                </h2>
                <p style={{ fontSize: '17px', color: '#6B7280', lineHeight: 1.75, margin: 0 }}>
                  Urbance is selective by design. We maintain a high bar so every client experience reflects the quality of our network.
                </p>
              </div>

              <div>
                {[
                  'Licensed where required by law',
                  'Insured with valid liability coverage',
                  '2+ years of professional experience',
                  'Clear, professional communication',
                  'Consistent commitment to quality',
                ].map((req) => (
                  <div key={req} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '18px 0',
                    borderBottom: '1px solid #F5F7FA',
                  }}>
                    <div style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: '#EBF3FD',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2.5 2.5L8 3" stroke="#2F80ED" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span style={{ fontSize: '16px', color: '#374151', fontWeight: 500 }}>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* APPLICATION CTA */}
        <section style={{
          padding: '140px 24px',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          position: 'relative' as const,
          overflow: 'hidden',
        }}>
          {/* Ambient glow */}
          <div style={{ position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)', width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(47,128,237,0.25) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' as const, position: 'relative' as const, zIndex: 1 }}>
            <div
              ref={applyRef}
              style={{ opacity: 0, transform: 'translateY(24px)', transition: 'opacity 0.8s ease, transform 0.8s ease' }}
            >
              <p style={{ fontSize: '11px', fontWeight: 700, color: '#60A5FA', letterSpacing: '0.16em', textTransform: 'uppercase' as const, margin: '0 0 24px' }}>Join Urbance</p>
              <h2 style={{ fontSize: 'clamp(36px, 4vw, 58px)', fontWeight: 700, letterSpacing: '-0.03em', color: '#ffffff', margin: '0 0 20px', lineHeight: 1.08 }}>
                Ready to grow<br />your business?
              </h2>
              <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.65)', margin: '0 0 52px', lineHeight: 1.75 }}>
                Apply in under 5 minutes. No fees, no commitment — just more work, better clients, and weekly pay.
              </p>
              <Link href="/apply" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#2F80ED',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: 600,
                padding: '18px 44px',
                borderRadius: '12px',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                boxShadow: '0 8px 32px rgba(47,128,237,0.45)',
              }}>
                Apply Now
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', margin: '20px 0 0' }}>
                Takes less than 5 minutes · No commitment required
              </p>
            </div>
          </div>
        </section>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          *, *::before, *::after { box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          body { -webkit-font-smoothing: antialiased; }

          .hero-grid     { grid-template-columns: 1fr 1fr; }
          .value-grid    { grid-template-columns: repeat(3, 1fr); }
          .steps-grid    { grid-template-columns: repeat(5, 1fr); }
          .partners-grid { grid-template-columns: 1fr 1fr; }

          @media (max-width: 960px) {
            .hero-grid     { grid-template-columns: 1fr !important; }
            .hero-image    { display: none !important; }
            .value-grid    { grid-template-columns: 1fr !important; }
            .steps-grid    { grid-template-columns: 1fr !important; }
            .step-item     { border-left: none !important; padding-left: 0 !important; border-top: 1px solid #F0F0F0; padding-top: 28px; }
            .partners-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}
