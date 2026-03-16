'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface NavbarProps {
  variant?: 'light' | 'dark';
}

export function Navbar({ variant: _variant }: NavbarProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ email?: string } | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <>
      {/* Floating wrapper */}
      <div className="nav-pill-wrapper" style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'calc(100% - 48px)',
        maxWidth: '1160px',
        zIndex: 1000,
      }}>
        {/* Nav pill */}
        <nav className="nav-pill" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: scrolled ? 'rgba(255,255,255,0.94)' : 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(0,0,0,0.07)',
          borderRadius: '14px',
          boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.10)' : '0 2px 16px rgba(0,0,0,0.06)',
          padding: scrolled ? '11px 24px' : '14px 24px',
          transition: 'all 0.3s ease',
          fontFamily: "'Inter', -apple-system, sans-serif",
        }}>

          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <span className="nav-logo-text" style={{ fontSize: '22px', fontWeight: 700, color: '#111111', letterSpacing: '-0.03em' }}>
              Urbance <span style={{ color: '#2F80ED' }}>Pros</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {[
              { label: 'How It Works', href: '/how-it-works' },
              { label: 'Earnings', href: '/earnings' },
              { label: 'Requirements', href: '/requirements' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                style={{ padding: '8px 13px', fontSize: '14px', fontWeight: 500, color: '#374151', textDecoration: 'none', borderRadius: '8px', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F5F7FA')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {item.label}
              </a>
            ))}

            <a
              href="https://urbance.ca"
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: '8px 13px', fontSize: '14px', fontWeight: 500, color: '#2F80ED', textDecoration: 'none', borderRadius: '8px', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F5F7FA')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              Urbance Home
            </a>

            <div style={{ width: '1px', height: '18px', backgroundColor: '#E5E7EB', margin: '0 8px' }} />

            {user ? (
              <div ref={dropdownRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '7px 14px',
                    backgroundColor: '#F5F7FA',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: '#111111',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{
                    width: '22px',
                    height: '22px',
                    backgroundColor: '#2F80ED',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}>
                    {(user.email || 'P')[0].toUpperCase()}
                  </div>
                  <svg
                    style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                    width="11" height="11" viewBox="0 0 11 11" fill="none"
                  >
                    <path d="M2 4l3.5 3.5L9 4" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 8px)',
                    width: '220px',
                    backgroundColor: '#ffffff',
                    border: '1px solid #E5E7EB',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    padding: '8px',
                    zIndex: 200,
                  }}>
                    <div style={{ padding: '8px 12px 12px', borderBottom: '1px solid #F5F7FA', marginBottom: '4px' }}>
                      <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '2px', fontWeight: 500 }}>Signed in as</div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#111111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                    </div>
                    {[
                      { label: 'Dashboard', href: '/dashboard' },
                      { label: 'Jobs', href: '/dashboard/jobs' },
                      { label: 'Payouts', href: '/dashboard/payouts' },
                      { label: 'Settings', href: '/dashboard/profile' },
                    ].map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                        style={{ display: 'block', padding: '9px 12px', fontSize: '14px', color: '#374151', textDecoration: 'none', borderRadius: '8px', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F5F7FA')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: '1px solid #F5F7FA', marginTop: '4px', paddingTop: '4px' }}>
                      <button
                        onClick={handleLogout}
                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '9px 12px', fontSize: '14px', color: '#EF4444', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '8px', fontFamily: 'inherit', transition: 'background 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  style={{ padding: '8px 14px', fontSize: '14px', fontWeight: 500, color: '#374151', textDecoration: 'none', borderRadius: '8px', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#F5F7FA')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Sign In
                </Link>
                <Link href="/apply" style={{
                  padding: '9px 20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#ffffff',
                  backgroundColor: '#2F80ED',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                  marginLeft: '4px',
                }}>
                  Apply
                </Link>
              </>
            )}
          </div>

          {/* Hamburger (mobile) */}
          <button
            className="hamburger"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#111111' }}
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="nav-mobile-menu" style={{
            marginTop: '8px',
            backgroundColor: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '14px',
            border: '1px solid rgba(0,0,0,0.07)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.10)',
            padding: '12px',
            fontFamily: "'Inter', sans-serif",
          }}>
            {[
              { label: 'How It Works', href: '/how-it-works' },
              { label: 'Earnings', href: '/earnings' },
              { label: 'Requirements', href: '/requirements' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{ display: 'block', padding: '12px 16px', fontSize: '15px', fontWeight: 500, color: '#374151', textDecoration: 'none', borderRadius: '8px' }}
              >
                {item.label}
              </a>
            ))}
            <a
              href="https://urbance.ca"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              style={{ display: 'block', padding: '12px 16px', fontSize: '15px', fontWeight: 500, color: '#374151', textDecoration: 'none', borderRadius: '8px' }}
            >
              Urbance Home
            </a>
            <div style={{ height: '1px', backgroundColor: '#F0F0F0', margin: '8px 0' }} />
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '12px 16px', fontSize: '15px', color: '#374151', textDecoration: 'none', borderRadius: '8px' }}>Dashboard</Link>
                <button onClick={() => { setMobileOpen(false); handleLogout(); }} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', fontSize: '15px', color: '#EF4444', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '8px', fontFamily: 'inherit' }}>Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '12px 16px', fontSize: '15px', color: '#374151', textDecoration: 'none', borderRadius: '8px' }}>Sign In</Link>
                <Link href="/apply" onClick={() => setMobileOpen(false)} style={{ display: 'block', margin: '8px 0 4px', padding: '13px 16px', fontSize: '15px', fontWeight: 600, color: '#ffffff', backgroundColor: '#2F80ED', borderRadius: '9px', textDecoration: 'none', textAlign: 'center' as const }}>Apply Now</Link>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-links  { display: none !important; }
          .hamburger  { display: flex !important; }
        }
        /* Mobile: tighten the floating nav pill */
        @media (max-width: 600px) {
          .nav-pill-wrapper {
            top: 12px !important;
            width: calc(100% - 24px) !important;
          }
          .nav-pill {
            padding: 11px 16px !important;
            border-radius: 12px !important;
          }
          .nav-logo-text {
            font-size: 19px !important;
          }
          .nav-mobile-menu {
            border-radius: 12px !important;
          }
        }
      `}</style>
    </>
  );
}
