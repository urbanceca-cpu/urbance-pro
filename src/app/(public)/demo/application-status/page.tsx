'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ApplicationStatusPage() {
  const router = useRouter();
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const globalStyles = `
    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes pulse-soft {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }

    .animate-slide-up {
      animation: slideUp 0.6s ease-out;
    }

    .animate-fade-in {
      animation: fadeIn 0.6s ease-out;
    }

    .animate-pulse-soft {
      animation: pulse-soft 2s ease-in-out infinite;
    }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <style>{globalStyles}</style>
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-3 min-w-fit">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                  <span className="text-xl font-black text-white">U</span>
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">Urbance</span>
                  <span className="text-xs font-black px-2 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full">Pro</span>
                </div>
                <span className="text-xs font-bold text-gray-500">Application Status</span>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button 
                onClick={() => router.push('/demo')} 
                className="p-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200"
                title="Back to Dashboard"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12a9 9 0 011.537-5.06A9.003 9.003 0 0112 2.754a9.003 9.003 0 018.463 4.186A9 9 0 0121 12" />
                </svg>
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-gray-900">Test Provider</p>
                  <p className="text-xs font-semibold text-gray-500">Application</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-black text-white">TP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header Section */}
        <div className={`mb-12 ${animateIn ? 'animate-slide-up' : 'opacity-0'}`}>
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 hover:translate-x-1 transition-all duration-200 mb-8"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="space-y-2">
            <h1 className="text-6xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent">Application Status</h1>
            <p className="text-xl text-gray-600 font-semibold max-w-2xl">Track your provider application progress in real-time. We're excited to have you on board!</p>
          </div>
        </div>

        {/* Main Status Card - Hero Section */}
        <div className={`mb-12 ${animateIn ? 'animate-slide-up' : 'opacity-0'}`} style={{animationDelay: '0.1s'}}>
          <div className="bg-gradient-to-br from-white via-blue-50 to-cyan-50 border-2 border-blue-200/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-cyan-600/5 pointer-events-none"></div>
              
              <div className="relative p-10 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                  {/* Left side - Main Status */}
                  <div className="lg:col-span-2">
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full">IN PROGRESS</span>
                        <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Step 2 of 4</span>
                      </div>
                      <h2 className="text-5xl font-black text-gray-900 mb-3">Under Review</h2>
                      <p className="text-lg text-gray-600 font-semibold">Your application submitted on January 28, 2026</p>
                    </div>

                    {/* Enhanced Progress Indicator */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-700">Overall Progress</span>
                        <span className="text-lg font-black text-blue-600">50%</span>
                      </div>
                      <div className="relative h-4 bg-gray-200/50 rounded-full overflow-hidden backdrop-blur-sm border border-gray-300/30">
                        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-full shadow-lg transition-all duration-500"></div>
                      </div>
                    </div>
                  </div>

                  {/* Right side - Timeline Estimate */}
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
                    <div className="text-center space-y-3">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm font-semibold mb-1">Estimated Timeline</p>
                        <p className="text-3xl font-black text-yellow-600">3-5 Days</p>
                        <p className="text-xs text-gray-500 font-semibold mt-2">Est. completion: Feb 5</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className={`mb-12 ${animateIn ? 'animate-slide-up' : 'opacity-0'}`} style={{animationDelay: '0.2s'}}>
          <h3 className="text-3xl font-black text-gray-900 mb-8">Your Journey</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { step: 1, title: 'Profile Created', date: 'Jan 31, 2026', status: 'completed', icon: '✓', description: 'Your account was set up' },
              { step: 2, title: 'Application Submitted', date: 'Jan 28, 2026', status: 'completed', icon: '✓', description: 'Initial submission reviewed' },
              { step: 3, title: 'Under Review', date: 'Today', status: 'active', icon: '⏳', description: 'Documents being verified' },
              { step: 4, title: 'Final Approval', date: 'Est. Feb 5', status: 'pending', icon: '🎯', description: 'Account activation' },
            ].map((item, index) => (
              <div 
                key={item.step} 
                className={`${animateIn ? 'animate-slide-up' : 'opacity-0'}`}
                style={{animationDelay: `${0.3 + index * 0.1}s`}}
              >
                <div className={`h-full rounded-2xl p-6 border-2 transition-all duration-300 ${
                  item.status === 'completed' 
                    ? 'bg-green-50 border-green-200 shadow-md' 
                    : item.status === 'active' 
                    ? 'bg-blue-50 border-blue-300 shadow-lg scale-105'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                      item.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : item.status === 'active'
                        ? 'bg-blue-500 text-white animate-pulse-soft'
                        : 'bg-gray-400 text-white'
                    }`}>
                      {item.icon}
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      item.status === 'completed' 
                        ? 'bg-green-200 text-green-700' 
                        : item.status === 'active' 
                        ? 'bg-blue-200 text-blue-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {item.status === 'completed' ? 'Done' : item.status === 'active' ? 'Now' : 'Next'}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-black text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600 font-semibold mb-3">{item.description}</p>
                  <p className="text-xs text-gray-500 font-bold">{item.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What's Next & Help Section */}
        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 ${animateIn ? 'animate-slide-up' : 'opacity-0'}`} style={{animationDelay: '0.4s'}}>
          {/* What's Next */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-black text-gray-900 mb-6">What's Happening Now</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-2xl flex-shrink-0">
                    📋
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-900 mb-2">Document Review</h4>
                    <p className="text-gray-600 text-sm font-semibold">We're verifying your government ID and insurance documents. Typical time: 2-3 days</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-blue-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl flex-shrink-0">
                    🔍
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-900 mb-2">Background Check</h4>
                    <p className="text-gray-600 text-sm font-semibold">A quick background verification is running in parallel. Results arrive within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-green-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-2xl flex-shrink-0">
                    ✨
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-900 mb-2">Final Approval</h4>
                    <p className="text-gray-600 text-sm font-semibold">Once complete, you'll get email notification and access to earn immediately</p>
                  </div>
                </div>
              </div>

              <div className="bg-white border-2 border-indigo-200 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center text-2xl flex-shrink-0">
                    🎯
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-gray-900 mb-2">Tips for Success</h4>
                    <p className="text-gray-600 text-sm font-semibold">Complete your profile 100%, respond quickly to jobs, and maintain a high quality rating to unlock premium opportunities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6">
              <h4 className="text-lg font-black text-gray-900 mb-4">Your Progress</h4>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-gray-700">Profile Complete</p>
                    <p className="text-lg font-black text-blue-600">85%</p>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-gray-700">Documents Verified</p>
                    <p className="text-lg font-black text-green-600">3/4</p>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-gray-700">Days Elapsed</p>
                    <p className="text-lg font-black text-orange-600">3 days</p>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/demo/documents')}
                className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-between group"
              >
                <span>View Documents</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button 
                onClick={() => router.push('/demo/support')}
                className="w-full py-4 px-6 bg-white border-2 border-gray-300 text-gray-900 font-bold rounded-xl hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-between group"
              >
                <span>Get Support</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            </div>

            {/* Helpful Info */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
              <h4 className="text-sm font-black text-orange-900 mb-3 flex items-center gap-2">
                <span>💡</span> Quick Tip
              </h4>
              <p className="text-sm text-orange-800 font-semibold">Check your email regularly! We'll send you updates on each stage of your application.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
