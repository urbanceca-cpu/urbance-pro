'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function PayoutsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/demo')} className="flex items-center gap-3 hover:opacity-70 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                <span className="text-lg font-black text-white">U</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Urbance</span>
                <span className="text-lg font-black text-gray-800">Pro</span>
              </div>
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-xs font-bold text-white">TP</span>
              </div>
              <span className="text-gray-700 font-semibold text-sm">Test Provider</span>
            </div>
            <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => router.push('/login')}>
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-5xl font-black text-gray-900 mb-3">Manage Your Payouts</h1>
          <p className="text-xl text-gray-600 font-semibold">Control your payments, track history, and set up automatic transfers</p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Settings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Payout Method Card */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Payout Method</h2>
              
              <div className="space-y-4">
                {/* Current Method */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-green-200 rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-green-700" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-900 font-black text-lg">Direct Deposit</p>
                        <p className="text-gray-600 font-semibold">••• ••• •••• 4242</p>
                        <p className="text-green-700 text-xs font-bold mt-1">✓ VERIFIED</p>
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg text-sm">Active</span>
                  </div>
                </div>

                {/* Add New Method */}
                <button className="w-full p-6 border-2 border-gray-300 rounded-2xl hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="text-gray-900 font-black text-lg">Add New Method</p>
                      <p className="text-gray-600 font-semibold">Connect another bank account</p>
                    </div>
                  </div>
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Payout Schedule */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Payout Schedule</h2>
              
              <div className="space-y-4">
                <div className="p-6 bg-blue-50 border-2 border-blue-200 rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-gray-900 font-black text-lg">Automatic Payouts</p>
                    <div className="w-12 h-7 bg-green-500 rounded-full relative cursor-pointer">
                      <div className="w-6 h-6 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
                    </div>
                  </div>
                  <p className="text-gray-700 font-semibold text-sm mb-3">Automatically send your earnings to your bank account every Friday</p>
                  <div className="bg-white rounded-lg p-3 text-gray-700 text-xs font-semibold">
                    Next Payout: Friday, February 7, 2026
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-2xl">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                      </svg>
                    </div>
                    <p className="text-gray-900 font-black text-lg">Manual Payout Requests</p>
                  </div>
                  <p className="text-gray-700 font-semibold text-sm">Need money sooner? Request an instant payout anytime.</p>
                </div>
              </div>
            </div>

            {/* Payment History */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Payment History</h2>
              
              <div className="space-y-3">
                {[
                  { date: 'Jan 31, 2026', amount: '$0.00', status: 'pending', description: 'Pending from job #4521' },
                  { date: 'Jan 24, 2026', amount: '$0.00', status: 'completed', description: 'Completed - Direct Deposit' },
                ].map((payment, i) => (
                  <div key={i} className="p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-gray-900 font-bold">{payment.date}</p>
                        <p className="text-gray-600 text-sm font-semibold">{payment.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900 font-black text-lg">{payment.amount}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                          payment.status === 'completed' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {payment.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Empty State */}
                <div className="p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-900 font-bold text-lg mb-2">No Payment History</p>
                  <p className="text-gray-600 font-semibold">Complete jobs to start earning and track your payouts here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="space-y-6">
            {/* Quick Summary */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-8">
              <h3 className="text-gray-900 font-black text-lg mb-6">Quick Summary</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-green-700 text-sm font-bold mb-2">AVAILABLE BALANCE</p>
                  <div className="text-4xl font-black text-gray-900">$0.00</div>
                </div>
                
                <div className="border-t border-green-200 pt-6">
                  <p className="text-green-700 text-sm font-bold mb-2">PENDING</p>
                  <div className="text-2xl font-black text-gray-900">$0.00</div>
                  <p className="text-green-600 text-xs font-semibold mt-1">From 0 jobs</p>
                </div>

                <div className="border-t border-green-200 pt-6">
                  <p className="text-green-700 text-sm font-bold mb-2">PAID OUT (ALL TIME)</p>
                  <div className="text-2xl font-black text-gray-900">$0.00</div>
                </div>

                <button className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black rounded-2xl hover:shadow-lg transition-all">
                  Request Payout
                </button>
              </div>
            </div>

            {/* Fee Information */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-6">
              <h3 className="text-gray-900 font-black text-lg mb-4">Fee Information</h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-gray-600 font-semibold mb-1">Urbance Fee</p>
                  <p className="text-gray-900 font-black text-lg">10%</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-600 font-semibold mb-1">Payment Processing</p>
                  <p className="text-gray-900 font-black">Free</p>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-600 font-semibold mb-1">Payout Method</p>
                  <p className="text-gray-900 font-black">Direct Deposit</p>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6">
              <h3 className="text-gray-900 font-black text-lg mb-3">Need Help?</h3>
              <p className="text-gray-700 font-semibold text-sm mb-4">Check our support center for payout FAQs and troubleshooting</p>
              <button onClick={() => router.push('/demo/support')} className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all text-sm">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
