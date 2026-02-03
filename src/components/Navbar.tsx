'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getProviderProfile, type ProviderProfile } from '@/lib/auth';
import { MAIN_SITE_URL } from '@/lib/env';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  variant?: 'dark' | 'light';
}

export function Navbar({ variant = 'dark' }: NavbarProps) {
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const providerProfile = await getProviderProfile();
        setProfile(providerProfile);
      }
      
      setIsLoading(false);
    };

    getUser();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        const providerProfile = await getProviderProfile();
        setProfile(providerProfile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setDropdownOpen(false);
    window.location.href = '/';
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Provider';

  const isDark = variant === 'dark';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-white/10' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl">🏠</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Urbance
              </span>
              <span className="text-xl font-black text-white">Pros</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Main Links */}
            <Link href="/how-it-works" className="px-4 py-2 text-gray-300 hover:text-white font-medium text-sm rounded-lg hover:bg-white/5 transition-all duration-200">
              How It Works
            </Link>
            <Link href="/services" className="px-4 py-2 text-gray-300 hover:text-white font-medium text-sm rounded-lg hover:bg-white/5 transition-all duration-200">
              Services
            </Link>
            <Link href="/earnings" className="px-4 py-2 text-gray-300 hover:text-white font-medium text-sm rounded-lg hover:bg-white/5 transition-all duration-200">
              Earnings
            </Link>
            <Link href="/success-stories" className="px-4 py-2 text-gray-300 hover:text-white font-medium text-sm rounded-lg hover:bg-white/5 transition-all duration-200">
              Success Stories
            </Link>
            <Link href="/faq" className="px-4 py-2 text-gray-300 hover:text-white font-medium text-sm rounded-lg hover:bg-white/5 transition-all duration-200">
              FAQ
            </Link>

            {/* Divider */}
            <div className="w-px h-8 bg-white/10 mx-2"></div>

            {/* Customer Site Link */}
            <a 
              href={MAIN_SITE_URL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 text-gray-400 hover:text-white font-medium text-sm rounded-lg hover:bg-white/5 transition-all duration-200"
            >
              Customer Site →
            </a>

            {/* Auth Section */}
            {!isLoading && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-white font-medium text-sm rounded-lg hover:from-blue-600/30 hover:to-purple-600/30 transition-all duration-200"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <span className="max-w-[120px] truncate">{displayName}</span>
                  <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-gray-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-semibold text-white">{displayName}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      {profile?.status && (
                        <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                          profile.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          profile.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                        </span>
                      )}
                    </div>
                    
                    <Link href="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Dashboard
                    </Link>
                    <Link href="/dashboard/jobs" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Jobs / Leads
                    </Link>
                    <Link href="/dashboard/payouts" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Payouts
                    </Link>
                    <Link href="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-gray-300 hover:text-white hover:bg-white/5 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>
                    
                    <div className="border-t border-white/10 mt-2 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <button className="px-4 py-2 text-gray-300 hover:text-white font-medium text-sm rounded-lg hover:bg-white/5 transition-all duration-200">
                    Sign In
                  </button>
                </Link>
                <Link href="/apply">
                  <button className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm rounded-lg shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105">
                    Apply Now
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-6 border-t border-white/10 mt-2 pt-4">
            <div className="flex flex-col space-y-2">
              <Link href="/how-it-works" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                How It Works
              </Link>
              <Link href="/services" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                Services
              </Link>
              <Link href="/earnings" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                Earnings
              </Link>
              <Link href="/success-stories" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                Success Stories
              </Link>
              <Link href="/faq" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                FAQ
              </Link>
              
              <div className="h-px bg-white/10 my-2"></div>

              <a 
                href={MAIN_SITE_URL} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
              >
                Customer Site →
              </a>
              
              <div className="h-px bg-white/10 my-2"></div>
              
              {!isLoading && user ? (
                <>
                  <div className="px-4 py-3 text-white font-semibold">
                    👋 {displayName}
                  </div>
                  <Link href="/dashboard" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    Dashboard
                  </Link>
                  <Link href="/dashboard/jobs" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    Jobs / Leads
                  </Link>
                  <Link href="/dashboard/payouts" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    Payouts
                  </Link>
                  <Link href="/dashboard/profile" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    Settings
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="px-4 py-3 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                    Sign In
                  </Link>
                  <Link href="/apply" className="mx-4 mt-2">
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-lg shadow-lg">
                      Apply Now
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
