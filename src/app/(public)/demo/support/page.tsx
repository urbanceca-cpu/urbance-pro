'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function SupportPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-gradient-to-b from-white via-white to-white/95 border-b border-gray-200 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between gap-8">
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
                <span className="text-xs font-bold text-gray-500">Support Center</span>
              </div>
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <button onClick={() => router.push('/demo')} className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12a9 9 0 011.537-5.06A9.003 9.003 0 0112 2.754a9.003 9.003 0 018.463 4.186A9 9 0 0121 12" />
                </svg>
              </button>
              <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-gray-900">Test Provider</p>
                  <p className="text-xs font-semibold text-gray-500">Support</p>
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
        <div className="mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-3">Support Center</h1>
          <p className="text-xl text-gray-600 font-semibold">Get help with your Urbance Pro account and platform features</p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search for help..." 
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-2xl font-semibold text-gray-900 focus:border-blue-500 focus:outline-none pl-14"
            />
            <svg className="w-6 h-6 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {[
            { title: 'Getting Started', description: 'Learn the basics and set up your profile', icon: '🚀', count: 8 },
            { title: 'Earnings & Payouts', description: 'How to earn money and request payments', icon: '💰', count: 12 },
            { title: 'Jobs & Applications', description: 'Browse jobs and manage your applications', icon: '💼', count: 15 },
            { title: 'Documents & Verification', description: 'Upload and manage your documents', icon: '📄', count: 10 },
            { title: 'Account & Security', description: 'Manage your account settings and security', icon: '🔒', count: 9 },
            { title: 'Technical Issues', description: 'Troubleshoot common problems', icon: '🔧', count: 7 },
          ].map((category) => (
            <div key={category.title} className="bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="text-gray-900 font-black text-xl mb-1">{category.title}</h3>
                  <p className="text-gray-600 font-semibold">{category.description}</p>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-bold rounded-full">{category.count}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-3xl p-12 text-center">
          <h2 className="text-3xl font-black text-gray-900 mb-3">Can't find what you're looking for?</h2>
          <p className="text-gray-700 font-semibold mb-8 max-w-2xl mx-auto text-lg">Contact our support team and we'll get back to you within 24 hours.</p>
          <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black rounded-xl hover:shadow-lg transition-all text-lg">
            📧 Contact Support Team
          </button>
        </div>
      </div>
    </div>
  );
}
