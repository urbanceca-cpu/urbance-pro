'use client';

import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PrivacyPage() {
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
          
          <h1 className="text-5xl font-black text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">Last updated: January 31, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-600 leading-relaxed">
              Urbance Pro ("we", "us", "our", or "Company") operates the website and mobile application. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">2. Information Collection and Use</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We collect several different types of information for various purposes to provide and improve our Service to you.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Personal Data:</strong> Email address, name, phone number, address, and other identifying information you provide</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Usage Data:</strong> Information about how you access and use the Service, including IP address, browser type, pages visited</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Documents:</strong> Government ID, insurance documents, and other verification materials</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">3. Use of Data</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Urbance Pro uses the collected data for various purposes:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>To provide and maintain our Service</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>To verify your identity and background for safety</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>To communicate with you about updates and announcements</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>To improve and optimize our Service</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>To process your payments and send you related information</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">4. Security of Data</h2>
            <p className="text-gray-600 leading-relaxed">
              The security of your data is important to us but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">5. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:
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
