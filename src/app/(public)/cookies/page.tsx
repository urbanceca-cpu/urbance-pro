'use client';

import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function CookiesPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          
          <h1 className="text-5xl font-black text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-600">Last updated: January 31, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">1. What are Cookies?</h2>
            <p className="text-gray-600 leading-relaxed">
              Cookies are small pieces of data stored on your device when you visit our website. They help us remember your preferences and improve your experience. Cookies can be either "persistent" cookies or "session" cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">2. How We Use Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Urbance Pro uses cookies for the following purposes:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Authentication:</strong> To keep you logged in to your account</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Preferences:</strong> To remember your settings and preferences</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Analytics:</strong> To understand how you use our service and improve it</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Security:</strong> To protect against fraud and improve security</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">3. Types of Cookies We Use</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Essential Cookies</h3>
                <p className="text-gray-600">
                  These cookies are necessary for the website to function and cannot be switched off. They include login sessions and security features.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Performance Cookies</h3>
                <p className="text-gray-600">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Functional Cookies</h3>
                <p className="text-gray-600">
                  These cookies enable the website to provide enhanced functionality and personalization, remembering choices you've made.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">4. Managing Cookies</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              You have the right to decide whether to accept or reject non-essential cookies. Most web browsers allow some control of cookies through their settings. You can:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Delete all cookies from your browser</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Block all cookies from your browser</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Configure your browser to alert you before storing cookies</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">5. Third-Party Cookies</h2>
            <p className="text-gray-600 leading-relaxed">
              Our website may contain content from third parties, which may set their own cookies on your device. We are not responsible for third-party cookies. Please review their privacy policies for more information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">6. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about our use of cookies, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-gray-900 font-semibold">support@urbance.ca</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
