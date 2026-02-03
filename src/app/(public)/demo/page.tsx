'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const globalStyles = `
  @keyframes fadeSlideUp {
    0% { opacity: 0; transform: translateY(20px); }
    20% { opacity: 1; transform: translateY(0); }
    80% { opacity: 1; transform: translateY(0); }
    100% { opacity: 0; transform: translateY(-20px); }
  }
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
`;

export default function DemoDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [jobsSubTab, setJobsSubTab] = useState('available');
  const [greeting, setGreeting] = useState('Good Morning');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [profileSection, setProfileSection] = useState('overview');
  
  const rotatingPhrases = [
    { text: 'Ready to earn', gradient: 'from-blue-600 to-cyan-500' },
    { text: 'Unlock your potential', gradient: 'from-purple-600 to-pink-500' },
    { text: 'Grow your income', gradient: 'from-green-600 to-emerald-500' },
    { text: 'Build your success', gradient: 'from-orange-600 to-amber-500' },
    { text: 'Start your journey', gradient: 'from-indigo-600 to-blue-500' },
    { text: 'Join thousands of pros', gradient: 'from-rose-600 to-pink-500' },
  ];
  
  const [rotatingText, setRotatingText] = useState(rotatingPhrases[0]);

  let rotatingIndex = 0;

  useEffect(() => {
    // Set demo session
    localStorage.setItem('demo_session', 'true');
    localStorage.setItem('demo_user', JSON.stringify({
      id: 'demo-user-id',
      email: 'testprovider@urbance.local',
      full_name: 'Test Provider',
    }));

    // Set greeting based on time
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) {
        setGreeting('Good Morning');
      } else if (hour < 18) {
        setGreeting('Good Afternoon');
      } else {
        setGreeting('Good Evening');
      }
    };
    updateGreeting();

    // Rotating text animation
    const textInterval = setInterval(() => {
      rotatingIndex = (rotatingIndex + 1) % rotatingPhrases.length;
      setRotatingText(rotatingPhrases[rotatingIndex]);
    }, 3000);

    return () => clearInterval(textInterval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('demo_session');
    localStorage.removeItem('demo_user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-white">
      <style dangerouslySetInnerHTML={{ __html: globalStyles }} />
      
      {/* Premium Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-gradient-to-b from-white via-white to-white/95 border-b border-gray-200 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-8">
            {/* Logo Section */}
            <div className="flex items-center gap-3 min-w-fit">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all transform group-hover:scale-105">
                  <span className="text-xl font-black text-white">U</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">Urbance</span>
                  <span className="text-xs font-black px-2 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full">Pro</span>
                </div>
                <span className="text-xs font-bold text-gray-500">Provider Dashboard</span>
              </div>
            </div>

            {/* Center - Quick Stats */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-bold text-gray-600">Live</span>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span className="text-xs font-bold text-gray-700">Approval Pending</span>
              </div>
              <div className="h-6 w-px bg-gray-200"></div>
              <div className="text-xs font-bold text-gray-600">
                Member since <span className="text-blue-600">Jan 31</span>
              </div>
            </div>

            {/* Right Section - User & Actions */}
            <div className="flex items-center gap-3 ml-auto">
              {/* Notifications */}
              <button className="relative group p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <div className="relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
              </button>

              {/* Messages */}
              <button className="relative group p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>

              {/* User Profile Dropdown */}
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-gray-900">Test Provider</p>
                  <p className="text-xs font-semibold text-gray-500">Pending Review</p>
                </div>
                <div className="relative group">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg group-hover:shadow-xl transition-all transform group-hover:scale-105">
                    <span className="text-sm font-black text-white">TP</span>
                  </div>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform group-hover:translate-y-0 translate-y-2">
                    <a href="#" className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 first:rounded-t-2xl">
                      My Profile
                    </a>
                    <a href="#" className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 border-t border-gray-100">
                      Settings
                    </a>
                    <a href="#" className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 border-t border-gray-100">
                      Help & Support
                    </a>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 border-t border-gray-100 last:rounded-b-2xl"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Enhanced */}
        <div className="mt-4 max-w-7xl mx-auto px-6 pb-4">
          <div className="flex items-center justify-center lg:justify-start gap-2 overflow-x-auto pb-2 lg:pb-0">
            {[
              { id: 'overview', label: 'Overview', icon: '📊', badge: null },
              { id: 'jobs', label: 'Jobs', icon: '💼', badge: null },
              { id: 'earnings', label: 'Earnings', icon: '💰', badge: null },
              { id: 'profile', label: 'Profile', icon: '👤', badge: '7' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all transform ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl scale-105'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {tab.badge && (
                  <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs font-black rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-16">
            {/* Hero Welcome Section */}
            <div className="relative overflow-hidden rounded-3xl">
              {/* Multi-layer gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100"></div>
              <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
              <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-1/2 right-1/4 w-60 h-60 bg-gradient-to-br from-cyan-200 to-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }}></div>
              
              <div className="relative z-10 px-10 py-16 md:px-16 md:py-20">
                <div className="max-w-3xl">
                  <div className="inline-block mb-6 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-blue-200/50">
                    <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{greeting}, Test Provider</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">
                    <span className="block relative h-[1.3em] overflow-hidden">
                      <span 
                        key={rotatingText.text}
                        className={`absolute inset-0 bg-gradient-to-r ${rotatingText.gradient} bg-clip-text text-transparent font-black animate-[fadeSlideUp_3s_ease-in-out]`}
                        style={{
                          backgroundSize: '200% 200%',
                          animation: 'fadeSlideUp 3s ease-in-out, gradientShift 4s ease infinite'
                        }}
                      >
                        {rotatingText.text}
                      </span>
                    </span>
                    <span className="text-gray-900">with Urbance Pro</span>
                  </h1>
                  <p className="text-xl text-gray-700 font-semibold mb-8 max-w-xl">Start accepting jobs today, build your reputation, and unlock unlimited earning potential on Urbance Pro.</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setActiveTab('jobs')}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105"
                    >
                      Browse Jobs
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Metrics Section with Beautiful Cards */}
            <div>
              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">Your Performance</h2>
                <p className="text-gray-600 font-semibold">Track your progress and achievements</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
                {/* Account Status */}
                <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-100 to-orange-100 p-6 hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 to-orange-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-yellow-200/50 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-yellow-700" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4"/><path d="M12 14c-5 0-8 2.5-8 5v4h16v-4c0-2.5-3-5-8-5z"/>
                      </svg>
                    </div>
                    <p className="text-yellow-900 text-sm font-bold mb-1 uppercase tracking-wide">Status</p>
                    <div className="text-2xl font-black text-gray-900 mb-3">Pending</div>
                    <div className="inline-block bg-yellow-300/50 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold">Under Review</div>
                  </div>
                </div>

                {/* Active Jobs */}
                <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-cyan-100 p-6 hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-blue-200/50 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-blue-700 animate-spin" style={{ animationDuration: '3s' }} fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8z"/>
                      </svg>
                    </div>
                    <p className="text-blue-900 text-sm font-bold mb-1 uppercase tracking-wide">Active</p>
                    <div className="text-4xl font-black text-gray-900">0</div>
                    <p className="text-blue-700 text-xs font-semibold mt-2">Jobs in progress</p>
                  </div>
                </div>

                {/* This Month */}
                <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 to-emerald-100 p-6 hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-green-200/50 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <p className="text-green-900 text-sm font-bold mb-1 uppercase tracking-wide">This Month</p>
                    <div className="text-3xl font-black text-gray-900">$0.00</div>
                    <p className="text-green-700 text-xs font-semibold mt-2">So far</p>
                  </div>
                </div>

                {/* Total Earned */}
                <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 p-6 hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-purple-200/50 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-purple-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
                      </svg>
                    </div>
                    <p className="text-purple-900 text-sm font-bold mb-1 uppercase tracking-wide">Total Earned</p>
                    <div className="text-3xl font-black text-gray-900">$0.00</div>
                    <p className="text-purple-700 text-xs font-semibold mt-2">All-time</p>
                  </div>
                </div>

                {/* Profile */}
                <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-100 to-blue-100 p-6 hover:shadow-2xl transition-all hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-cyan-200/50 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <svg className="w-6 h-6 text-cyan-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                    </div>
                    <p className="text-cyan-900 text-sm font-bold mb-1 uppercase tracking-wide">Profile</p>
                    <div className="text-4xl font-black text-gray-900">85%</div>
                    <div className="w-full bg-cyan-300/30 rounded-full h-2 mt-3">
                      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 h-2 rounded-full w-[85%] transition-all"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Cards with Beautiful Gradients */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Setup Complete */}
              <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 p-8 hover:shadow-2xl transition-all hover:-translate-y-2 border border-green-200/50">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-green-200/40 rounded-full blur-3xl group-hover:scale-125 transition-transform"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-200/40 rounded-full blur-3xl group-hover:scale-125 transition-transform" style={{ animationDelay: '1s' }}></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-green-200/60 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-green-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <h3 className="text-green-900 font-black text-lg mb-4">✓ Setup Complete</h3>
                  <ul className="space-y-3 text-green-800 text-sm font-semibold">
                    <li className="flex items-center gap-3"><span className="text-lg">✓</span> Profile Created</li>
                    <li className="flex items-center gap-3"><span className="text-lg">✓</span> Application Submitted</li>
                    <li className="flex items-center gap-3"><span className="text-lg">✓</span> Documents Uploaded</li>
                  </ul>
                </div>
              </div>

              {/* Under Review */}
              <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 via-cyan-50 to-blue-100 p-8 hover:shadow-2xl transition-all hover:-translate-y-2 border border-blue-200/50">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-200/40 rounded-full blur-3xl group-hover:scale-125 transition-transform"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-200/40 rounded-full blur-3xl group-hover:scale-125 transition-transform" style={{ animationDelay: '1s' }}></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-blue-200/60 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 animate-pulse">
                    <svg className="w-8 h-8 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                    </svg>
                  </div>
                  <h3 className="text-blue-900 font-black text-lg mb-4">⏳ Under Review</h3>
                  <p className="text-blue-800 text-sm font-semibold leading-relaxed">Your background check and application are being reviewed. This typically takes 3-5 business days.</p>
                </div>
              </div>

              {/* Coming Soon */}
              <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-purple-100 via-pink-50 to-purple-100 p-8 hover:shadow-2xl transition-all hover:-translate-y-2 border border-purple-200/50">
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-200/40 rounded-full blur-3xl group-hover:scale-125 transition-transform"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-200/40 rounded-full blur-3xl group-hover:scale-125 transition-transform" style={{ animationDelay: '1s' }}></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-purple-200/60 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-purple-700 animate-bounce" style={{ animationDuration: '2s' }} fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L7 7h3V14h4V7h3l-5-5zm7 13h-3v3h3v-3zm0-4h-3v2h3v-2z"/>
                    </svg>
                  </div>
                  <h3 className="text-purple-900 font-black text-lg mb-4">🚀 Coming Soon</h3>
                  <p className="text-purple-800 text-sm font-semibold leading-relaxed">Once approved, you'll unlock access to jobs, real-time earnings tracking, and instant payouts.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* JOBS TAB */}
        {activeTab === 'jobs' && (
          <div className="space-y-10">
            {/* Header with Stats */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-8">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h2 className="text-4xl font-black text-white mb-3">Find Your Next Job</h2>
                <p className="text-white/90 text-lg font-semibold mb-6">Browse available opportunities and grow your business</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <div className="text-3xl font-black text-white">0</div>
                    <p className="text-white/80 text-sm font-semibold">Available Jobs</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <div className="text-3xl font-black text-white">0</div>
                    <p className="text-white/80 text-sm font-semibold">Active Jobs</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                    <div className="text-3xl font-black text-white">0</div>
                    <p className="text-white/80 text-sm font-semibold">Completed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Jobs Subtabs - Modern Pill Design */}
            <div className="flex items-center justify-between">
              <div className="bg-white border-2 border-gray-200 rounded-2xl p-2 flex gap-2 shadow-sm">
                {[
                  { id: 'available', label: 'Available', icon: '🔍', count: 0 },
                  { id: 'active', label: 'Active', icon: '⚡', count: 0 },
                  { id: 'completed', label: 'Completed', icon: '✓', count: 0 },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setJobsSubTab(tab.id)}
                    className={`relative px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                      jobsSubTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2 text-lg">{tab.icon}</span>
                    {tab.label}
                    {tab.count > 0 && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                        jobsSubTab === tab.id ? 'bg-white/20' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              
              <button className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
            </div>

            {/* AVAILABLE JOBS SUBTAB */}
            {jobsSubTab === 'available' && (
              <div className="space-y-6">
                {/* Approval Required Notice */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-200 p-6">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/30 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-black text-xl mb-2">🎯 Almost There!</h3>
                      <p className="text-gray-700 font-semibold leading-relaxed mb-4">
                        Your profile is under review. Once approved, you'll see available jobs here and can start earning immediately.
                      </p>
                      <div className="flex gap-3">
                        <button onClick={() => router.push('/demo/application-status')} className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                          View Application Status
                        </button>
                        <button onClick={() => setActiveTab('profile')} className="px-5 py-2 bg-white text-gray-700 font-bold rounded-xl hover:bg-gray-50 border-2 border-gray-200 transition-all">
                          Complete Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview Job Cards */}
                <div>
                  <h3 className="text-xl font-black text-gray-900 mb-4">Preview: What Jobs Look Like</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { title: 'Kitchen Sink Repair', location: 'Downtown Vancouver', budget: '$120-150', service: 'Plumbing', urgent: true },
                      { title: 'Electrical Panel Upgrade', location: 'North York', budget: '$300-400', service: 'Electrical', urgent: false },
                      { title: 'Bathroom Renovation', location: 'Scarborough', budget: '$2,000+', service: 'Renovation', urgent: false },
                    ].map((job, i) => (
                      <div key={i} className="group relative overflow-hidden bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-2xl transition-all opacity-60">
                        {job.urgent && (
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-black rounded-full shadow-lg">
                              URGENT
                            </span>
                          </div>
                        )}
                        <div className="mb-4">
                          <div className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-3">
                            {job.service}
                          </div>
                          <h4 className="text-xl font-black text-gray-900 mb-2">{job.title}</h4>
                          <div className="flex items-center gap-2 text-gray-600 text-sm font-semibold mb-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {job.budget}
                          </div>
                        </div>
                        <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl group-hover:shadow-lg transition-all opacity-50 cursor-not-allowed">
                          View Details
                        </button>
                        <div className="absolute inset-0 bg-gray-900/5 backdrop-blur-[1px] rounded-2xl flex items-center justify-center">
                          <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
                            <span className="text-sm font-black text-gray-700">🔒 Locked</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ACTIVE JOBS SUBTAB */}
            {jobsSubTab === 'active' && (
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-2 border-blue-200 p-12 text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent)]"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3">Ready to Start Working</h3>
                    <p className="text-gray-700 font-semibold text-lg max-w-xl mx-auto leading-relaxed">
                      Once approved, accept jobs from the Available tab and they'll appear here. Track progress, communicate with clients, and manage everything in one place.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* COMPLETED JOBS SUBTAB */}
            {jobsSubTab === 'completed' && (
              <div className="space-y-6">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 border-2 border-green-200 p-12 text-center">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.1),transparent)]"></div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3">Build Your Success Story</h3>
                    <p className="text-gray-700 font-semibold text-lg max-w-xl mx-auto leading-relaxed">
                      Completed jobs will show up here with customer reviews, earnings, and your performance stats. Start building your reputation on Urbance Pro!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* EARNINGS TAB */}
        {activeTab === 'earnings' && (
          <div className="space-y-10">
            {/* Header with CTA */}
            <div className="relative overflow-hidden rounded-3xl">
              <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-500"></div>
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative z-10 p-8">
                <h2 className="text-4xl font-black text-white mb-3">Earnings & Payouts</h2>
                <p className="text-white/90 text-lg font-semibold mb-6">Track your income, manage payments, and watch your business grow</p>
                <button 
                  onClick={() => setShowPayoutModal(true)}
                  className="px-7 py-3 bg-white text-green-600 font-black rounded-xl hover:shadow-xl hover:scale-105 transition-all"
                >
                  💳 Request Payout
                </button>
              </div>
            </div>

            {/* Earnings Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* This Month */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-200/30 rounded-full group-hover:scale-125 transition-transform"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-200/60 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z"/>
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">This Month</span>
                  </div>
                  <div className="text-4xl font-black text-gray-900 mb-2">$0.00</div>
                  <p className="text-green-700 text-sm font-semibold">0 jobs completed</p>
                </div>
              </div>

              {/* Last 30 Days */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-200/30 rounded-full group-hover:scale-125 transition-transform"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-200/60 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">Last 30 Days</span>
                  </div>
                  <div className="text-4xl font-black text-gray-900 mb-2">$0.00</div>
                  <p className="text-blue-700 text-sm font-semibold">0 jobs completed</p>
                </div>
              </div>

              {/* Available Balance */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-200/30 rounded-full group-hover:scale-125 transition-transform"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-200/60 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">Balance</span>
                  </div>
                  <div className="text-4xl font-black text-gray-900 mb-2">$0.00</div>
                  <p className="text-purple-700 text-sm font-semibold">Ready to withdraw</p>
                </div>
              </div>

              {/* Total Earned */}
              <div className="group relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-2xl p-6 hover:shadow-2xl transition-all hover:-translate-y-1">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-200/30 rounded-full group-hover:scale-125 transition-transform"></div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-200/60 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                    </div>
                    <span className="text-xs font-bold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">All-Time</span>
                  </div>
                  <div className="text-4xl font-black text-gray-900 mb-2">$0.00</div>
                  <p className="text-orange-700 text-sm font-semibold">Total earnings</p>
                </div>
              </div>
            </div>

            {/* Earnings Chart */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-gray-900 font-black text-2xl">Earnings Trend</h3>
                  <p className="text-gray-600 text-sm font-semibold mt-1">Last 6 months performance</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-all text-sm">6M</button>
                  <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg transition-all text-sm">1Y</button>
                </div>
              </div>
              <div className="flex items-end justify-around h-48 gap-3">
                {[
                  { month: 'Jan', value: 0 },
                  { month: 'Feb', value: 0 },
                  { month: 'Mar', value: 0 },
                  { month: 'Apr', value: 0 },
                  { month: 'May', value: 0 },
                  { month: 'Jun', value: 0 },
                ].map((item) => (
                  <div key={item.month} className="flex flex-col items-center gap-2 flex-1">
                    <div className="relative w-full flex items-end justify-center h-40">
                      <div className="w-full max-w-[40px] h-12 bg-gradient-to-t from-green-500 to-emerald-400 rounded-t-lg hover:shadow-lg hover:from-green-600 hover:to-emerald-500 transition-all opacity-40 cursor-pointer"></div>
                    </div>
                    <span className="text-xs font-black text-gray-600">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payout Methods & History */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Payout Method */}
              <div className="lg:col-span-1 bg-white border-2 border-gray-200 rounded-2xl p-8">
                <h3 className="text-gray-900 font-black text-xl mb-6">Payout Method</h3>
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-200 flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-700 text-sm font-semibold">Direct Deposit</p>
                      <p className="text-gray-600 text-xs font-semibold">Instant payouts</p>
                    </div>
                  </div>
                  <div className="bg-white/60 rounded-lg p-3 text-gray-600 text-xs font-semibold">
                    ••• ••• •••• 4242
                  </div>
                </div>
                <button className="w-full py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all">
                  Update Method
                </button>
              </div>

              {/* Recent Payouts */}
              <div className="lg:col-span-2 bg-white border-2 border-gray-200 rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-900 font-black text-xl">Recent Payouts</h3>
                  <a href="/demo/payouts" className="text-blue-600 font-bold hover:text-blue-700 text-sm">
                    View All →
                  </a>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-900 font-bold text-sm">No payouts yet</p>
                        <p className="text-gray-600 text-xs">Complete jobs to earn and request payouts</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Payout Modal */}
        {showPayoutModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 p-8 flex items-center justify-between">
                <h2 className="text-white font-black text-3xl">Request Payout</h2>
                <button 
                  onClick={() => setShowPayoutModal(false)}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-8 space-y-6">
                {/* Available Balance Display */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6">
                  <p className="text-green-700 text-sm font-bold mb-2">AVAILABLE BALANCE</p>
                  <div className="text-5xl font-black text-gray-900">$0.00</div>
                  <p className="text-green-700 text-sm font-semibold mt-2">Ready to withdraw</p>
                </div>

                {/* Payout Amount */}
                <div>
                  <label className="block text-gray-900 font-bold text-sm mb-3">Amount to Request</label>
                  <div className="relative">
                    <span className="absolute left-4 top-4 text-gray-600 font-bold text-lg">$</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      disabled
                      className="w-full pl-8 pr-4 py-4 bg-gray-100 text-gray-700 font-bold text-2xl rounded-xl border-2 border-gray-300 focus:border-green-500 focus:outline-none disabled:opacity-60"
                    />
                  </div>
                  <p className="text-gray-600 text-xs font-semibold mt-2">Minimum payout: $10.00</p>
                </div>

                {/* Payout Method Selection */}
                <div>
                  <label className="block text-gray-900 font-bold text-sm mb-3">Select Payout Method</label>
                  <div className="space-y-3">
                    <div className="p-4 border-2 border-green-400 bg-green-50 rounded-xl cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-600"></div>
                        <div>
                          <p className="text-gray-900 font-bold">Direct Deposit</p>
                          <p className="text-gray-600 text-xs font-semibold">••• ••• •••• 4242</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>
                        <div>
                          <p className="text-gray-700 font-bold">Add New Method</p>
                          <p className="text-gray-600 text-xs font-semibold">Connect a new bank account</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                  <p className="text-blue-900 text-sm font-semibold leading-relaxed">
                    💡 <strong>Note:</strong> You'll be able to request payouts once you've completed your first job and earned income. Payouts typically process within 1-2 business days.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowPayoutModal(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => window.location.href = '/demo/payouts'}
                    disabled
                    className="flex-1 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Payouts →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-3 bg-white border-2 border-gray-200 rounded-2xl p-4">
                {[
                  { id: 'overview', label: 'Overview', icon: '👤', color: 'blue' },
                  { id: 'contact', label: 'Contact Info', icon: '📞', color: 'green' },
                  { id: 'services', label: 'Services', icon: '🔧', color: 'purple' },
                  { id: 'documents', label: 'Documents', icon: '📄', color: 'orange' },
                  { id: 'certifications', label: 'Certifications', icon: '🎓', color: 'pink' },
                  { id: 'security', label: 'Security', icon: '🔒', color: 'red' },
                  { id: 'notifications', label: 'Notifications', icon: '🔔', color: 'yellow' },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setProfileSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                      profileSection === section.id
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span className="flex-1 text-left">{section.label}</span>
                    {profileSection === section.id && (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Content Area */}
            <div className="lg:col-span-3 space-y-8">
              {/* OVERVIEW SECTION */}
              {profileSection === 'overview' && (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-3xl p-8">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex items-start gap-6">
                        <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <span className="text-5xl font-black text-white">TP</span>
                        </div>
                        <div>
                          <h2 className="text-3xl font-black text-gray-900 mb-2">Test Provider</h2>
                          <p className="text-gray-600 font-semibold mb-4">testprovider@urbance.local</p>
                          <div className="flex flex-wrap gap-2">
                            <div className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-xs font-bold">⏳ Pending Approval</div>
                            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full text-xs font-bold">✓ Verified Email</div>
                            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-xs font-bold">📍 Vancouver, BC</div>
                          </div>
                        </div>
                      </div>
                      <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                      <p className="text-gray-600 text-sm font-semibold mb-2">Profile Completion</p>
                      <div className="text-3xl font-black text-gray-900 mb-3">85%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full w-[85%]"></div>
                      </div>
                    </div>
                    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                      <p className="text-gray-600 text-sm font-semibold mb-2">Member Since</p>
                      <div className="text-3xl font-black text-gray-900">Jan 31</div>
                      <p className="text-gray-600 text-xs font-semibold mt-2">2026</p>
                    </div>
                    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
                      <p className="text-gray-600 text-sm font-semibold mb-2">Verification</p>
                      <div className="text-2xl font-black text-green-600">✓ 3/4</div>
                      <p className="text-gray-600 text-xs font-semibold mt-2">Steps Complete</p>
                    </div>
                  </div>
                </div>
              )}

              {/* CONTACT INFO SECTION */}
              {profileSection === 'contact' && (
                <div className="space-y-6">
                  <div className="bg-white border-2 border-gray-200 rounded-3xl p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Contact Information</h2>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-gray-700 font-bold text-sm mb-3">Full Name</label>
                        <input type="text" value="Test Provider" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-900 focus:border-blue-500 focus:outline-none" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-bold text-sm mb-3">Email</label>
                          <input type="email" value="testprovider@urbance.local" className="w-full px-4 py-3 border-2 border-green-300 bg-green-50 rounded-xl font-semibold text-gray-900 focus:outline-none" readOnly />
                          <p className="text-green-600 text-xs font-bold mt-2">✓ Verified</p>
                        </div>

                        <div>
                          <label className="block text-gray-700 font-bold text-sm mb-3">Phone</label>
                          <input type="tel" value="+1 (555) 123-4567" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-900 focus:border-blue-500 focus:outline-none" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-bold text-sm mb-3">City</label>
                          <input type="text" value="Vancouver" className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-900 focus:border-blue-500 focus:outline-none" />
                        </div>

                        <div>
                          <label className="block text-gray-700 font-bold text-sm mb-3">Province</label>
                          <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-900 focus:border-blue-500 focus:outline-none">
                            <option>Ontario</option>
                            <option>Quebec</option>
                            <option>British Columbia</option>
                          </select>
                        </div>
                      </div>

                      <button className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black rounded-xl hover:shadow-lg transition-all">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* SERVICES SECTION */}
              {profileSection === 'services' && (
                <div className="space-y-6">
                  <div className="bg-white border-2 border-gray-200 rounded-3xl p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Services Offered</h2>
                    
                    <div className="space-y-4 mb-6">
                      {['Plumbing', 'Electrical', 'HVAC', 'General Repairs', 'Painting', 'Carpentry'].map((service) => (
                        <label key={service} className="flex items-center p-4 border-2 border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                          <input type="checkbox" defaultChecked={service === 'Plumbing' || service === 'Electrical'} className="w-5 h-5 accent-blue-600" />
                          <span className="ml-4 font-semibold text-gray-900">{service}</span>
                        </label>
                      ))}
                    </div>

                    <div>
                      <label className="block text-gray-700 font-bold text-sm mb-3">Years of Experience</label>
                      <select className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-900 focus:border-blue-500 focus:outline-none">
                        <option>Less than 1 year</option>
                        <option>1-2 years</option>
                        <option>3-5 years</option>
                        <option>5+ years</option>
                      </select>
                    </div>

                    <button className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black rounded-xl hover:shadow-lg transition-all mt-6">
                      Update Services
                    </button>
                  </div>
                </div>
              )}

              {/* DOCUMENTS SECTION */}
              {profileSection === 'documents' && (
                <div className="space-y-6">
                  <div className="bg-white border-2 border-gray-200 rounded-3xl p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Document Management</h2>
                    
                    {/* Upload Notice */}
                    <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-6 mb-8">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-200 flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-orange-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-gray-900 font-black mb-1">Monthly Document Renewal Required</p>
                          <p className="text-gray-700 font-semibold text-sm">Your documents expire on February 28, 2026. Please re-upload them before the deadline.</p>
                        </div>
                      </div>
                    </div>

                    {/* Documents Grid */}
                    <div className="space-y-4">
                      {[
                        { name: 'Government ID', status: 'verified', expiresOn: 'Feb 28, 2026', icon: '🪪' },
                        { name: 'Background Check', status: 'pending', expiresOn: 'Feb 28, 2026', icon: '🔍' },
                        { name: 'Insurance Certificate', status: 'verified', expiresOn: 'Feb 28, 2026', icon: '📋' },
                        { name: 'Trade License', status: 'verified', expiresOn: 'Feb 28, 2026', icon: '📜' },
                      ].map((doc) => (
                        <div key={doc.name} className="border-2 border-gray-300 rounded-2xl p-6 hover:border-blue-400 hover:bg-blue-50 transition-all">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div className="text-4xl">{doc.icon}</div>
                              <div>
                                <p className="text-gray-900 font-black text-lg">{doc.name}</p>
                                <p className="text-gray-600 font-semibold text-sm">Expires: {doc.expiresOn}</p>
                              </div>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-xs font-bold ${
                              doc.status === 'verified' 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {doc.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 py-2 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all text-sm">
                              View
                            </button>
                            <button className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all text-sm">
                              Re-upload
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* CERTIFICATIONS SECTION */}
              {profileSection === 'certifications' && (
                <div className="space-y-6">
                  <div className="bg-white border-2 border-gray-200 rounded-3xl p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Professional Certifications</h2>
                    
                    <div className="space-y-4 mb-8">
                      {['G2 Driver\'s License', 'CPR Certification', 'Trade License (Plumbing)', 'First Aid Certificate'].map((cert, i) => (
                        <div key={cert} className="border-2 border-gray-300 rounded-2xl p-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-pink-200 flex items-center justify-center">
                              <svg className="w-6 h-6 text-pink-700" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L15.09 8.26H21.77L16.84 12.45L17.97 18.71L12 14.5L6.03 18.71L7.16 12.45L2.23 8.26H8.91L12 2Z"/>
                              </svg>
                            </div>
                            <div>
                              <p className="text-gray-900 font-black">{cert}</p>
                              <p className="text-gray-600 font-semibold text-sm">Verified on Jan 31, 2026</p>
                            </div>
                          </div>
                          <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        </div>
                      ))}
                    </div>

                    <div className="bg-pink-50 border-2 border-pink-200 rounded-2xl p-6">
                      <h3 className="text-gray-900 font-black mb-4">Add New Certification</h3>
                      <div className="flex gap-3">
                        <input type="text" placeholder="Certification name" className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl font-semibold text-gray-900 focus:border-pink-500 focus:outline-none" />
                        <button className="px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SECURITY SECTION */}
              {profileSection === 'security' && (
                <div className="space-y-6">
                  <div className="bg-white border-2 border-gray-200 rounded-3xl p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Security Settings</h2>
                    
                    <div className="space-y-6">
                      <div className="border-2 border-gray-300 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-gray-900 font-black">Change Password</p>
                            <p className="text-gray-600 font-semibold text-sm">Update your password to keep your account secure</p>
                          </div>
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      <div className="border-2 border-gray-300 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-gray-900 font-black">Two-Factor Authentication</p>
                            <p className="text-gray-600 font-semibold text-sm">Add an extra layer of security to your account</p>
                          </div>
                          <div className="w-12 h-7 bg-gray-300 rounded-full relative">
                            <div className="w-6 h-6 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
                          </div>
                        </div>
                      </div>

                      <div className="border-2 border-gray-300 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-900 font-black">Active Sessions</p>
                            <p className="text-gray-600 font-semibold text-sm">1 active session on this device</p>
                          </div>
                          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>

                      <button className="w-full py-3 bg-red-50 text-red-600 font-black rounded-xl border-2 border-red-200 hover:bg-red-100 transition-all">
                        Sign Out of All Devices
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS SECTION */}
              {profileSection === 'notifications' && (
                <div className="space-y-6">
                  <div className="bg-white border-2 border-gray-200 rounded-3xl p-8">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Notification Preferences</h2>
                    
                    <div className="space-y-4">
                      {[
                        { title: 'New Job Alerts', description: 'Notifications when new jobs match your skills', enabled: true },
                        { title: 'Application Updates', description: 'Status updates on your application', enabled: true },
                        { title: 'Document Reminders', description: 'Reminders when documents are about to expire', enabled: true },
                        { title: 'Payment Updates', description: 'Notifications about payouts and earnings', enabled: true },
                        { title: 'Marketing Emails', description: 'Promotional content and news from Urbance', enabled: false },
                      ].map((notif) => (
                        <div key={notif.title} className="border-2 border-gray-300 rounded-2xl p-6 flex items-center justify-between">
                          <div>
                            <p className="text-gray-900 font-black">{notif.title}</p>
                            <p className="text-gray-600 font-semibold text-sm">{notif.description}</p>
                          </div>
                          <div className={`w-12 h-7 rounded-full relative ${notif.enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                            <div className={`w-6 h-6 bg-white rounded-full absolute top-0.5 transition-all ${notif.enabled ? 'right-0.5' : 'left-0.5'}`}></div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button className="w-full py-4 bg-gradient-to-r from-yellow-600 to-yellow-700 text-white font-black rounded-xl hover:shadow-lg transition-all mt-6">
                      Save Preferences
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
            <div>
              <h4 className="text-gray-900 font-black mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors">Dashboard</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors">Jobs</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors">Earnings</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-black mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-black mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors">Privacy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-900 font-black mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors">Help</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-semibold transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex items-center justify-between">
            <p className="text-gray-600 text-sm font-semibold">&copy; 2026 Urbance Pro. All rights reserved.</p>
            <p className="text-gray-600 text-sm font-semibold">Demo Experience</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
