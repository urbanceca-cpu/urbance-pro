'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

const NAV_SECTIONS = [
  {
    items: [
      {
        href: '/dashboard',
        label: 'Overview',
        exact: true,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Work',
    items: [
      {
        href: '/dashboard/jobs',
        label: 'Jobs',
        exact: false,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
          </svg>
        ),
      },
      {
        href: '/dashboard/payouts',
        label: 'Earnings',
        exact: false,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        href: '/dashboard/documents',
        label: 'Documents',
        exact: false,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        ),
      },
      {
        href: '/dashboard/profile',
        label: 'Profile',
        exact: false,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        ),
      },
      {
        href: '/dashboard/support',
        label: 'Support',
        exact: false,
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        ),
      },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const SidebarContent = () => (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo */}
      <div style={{ padding: '28px 24px 24px', borderBottom: '1px solid #F3F4F6' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: '#2F80ED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#111111', letterSpacing: '-0.02em' }}>Urbance</div>
            <div style={{ fontSize: '10px', color: '#9CA3AF', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Pro Portal</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
        {NAV_SECTIONS.map((section, si) => (
          <div key={si} style={{ marginBottom: '8px' }}>
            {section.label && (
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '12px 12px 6px' }}>
                {section.label}
              </div>
            )}
            {section.items.map(item => {
              const active = isActive(item.href, item.exact ?? false);
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '9px 12px', borderRadius: '10px', marginBottom: '2px',
                    background: active ? '#EBF3FD' : 'transparent',
                    color: active ? '#2F80ED' : '#374151',
                    fontWeight: active ? 600 : 500,
                    fontSize: '13.5px',
                    transition: 'background 0.12s, color 0.12s',
                    cursor: 'pointer',
                  }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = '#F9FAFB'; }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                  >
                    <span style={{ opacity: active ? 1 : 0.6, flexShrink: 0 }}>{item.icon}</span>
                    {item.label}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sign out */}
      <div style={{ padding: '12px', borderTop: '1px solid #F3F4F6' }}>
        <button onClick={handleSignOut} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
          padding: '9px 12px', borderRadius: '10px', border: 'none',
          background: 'transparent', color: '#9CA3AF', fontSize: '13.5px', fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.12s, color 0.12s',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#FEF2F2'; (e.currentTarget as HTMLButtonElement).style.color = '#DC2626'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; (e.currentTarget as HTMLButtonElement).style.color = '#9CA3AF'; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside style={{
        width: '220px', minWidth: '220px', background: '#FFFFFF',
        borderRight: '1px solid #F3F4F6',
        height: '100vh', position: 'sticky', top: 0,
        display: 'flex', flexDirection: 'column',
        fontFamily: "'Inter',-apple-system,sans-serif",
      }} className="dash-sidebar-desktop">
        <SidebarContent />
      </aside>

      {/* Mobile hamburger */}
      <button
        className="dash-hamburger"
        onClick={() => setMobileOpen(v => !v)}
        style={{
          position: 'fixed', top: '16px', left: '16px', zIndex: 200,
          width: '40px', height: '40px', borderRadius: '10px',
          background: '#FFFFFF', border: '1px solid #E5E7EB',
          display: 'none', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2" strokeLinecap="round">
          <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 150, display: 'flex' }}
          className="dash-drawer"
        >
          <div onClick={() => setMobileOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)' }} />
          <aside style={{
            position: 'relative', width: '240px', background: '#FFFFFF',
            height: '100vh', display: 'flex', flexDirection: 'column',
            fontFamily: "'Inter',-apple-system,sans-serif",
          }}>
            <SidebarContent />
          </aside>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .dash-sidebar-desktop { display: none !important; }
          .dash-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
