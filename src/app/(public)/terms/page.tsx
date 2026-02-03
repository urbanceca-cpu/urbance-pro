'use client';

import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function TermsPage() {
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
          
          <h1 className="text-5xl font-black text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-xl text-gray-600">Last updated: January 31, 2026</p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-8">
          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using Urbance Pro ("Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Permission is granted to temporarily download one copy of the materials (information or software) on Urbance Pro for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Modify or copy the materials</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Use the materials for any commercial purpose or for any public display</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Attempt to reverse compile, disassemble, or reverse engineer any software</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Remove any copyright or other proprietary notations from the materials</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <span>Transfer the materials to another person or "mirror" the materials</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">3. Disclaimer</h2>
            <p className="text-gray-600 leading-relaxed">
              The materials on Urbance Pro are provided on an 'as is' basis. Urbance Pro makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">4. Limitations</h2>
            <p className="text-gray-600 leading-relaxed">
              In no event shall Urbance Pro or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Urbance Pro, even if Urbance Pro or an authorized representative has been notified orally or in writing of the possibility of such damage.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">5. Accuracy of Materials</h2>
            <p className="text-gray-600 leading-relaxed">
              The materials appearing on Urbance Pro could include technical, typographical, or photographic errors. Urbance Pro does not warrant that any of the materials on the website are accurate, complete, or current. Urbance Pro may make changes to the materials contained on its website at any time without notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">6. Limitations on Service</h2>
            <p className="text-gray-600 leading-relaxed">
              Service providers must maintain the highest standards of professionalism and conduct background verification processes. Failure to comply with our standards may result in account suspension or termination.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-black text-gray-900 mb-4">7. Contact Information</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms, please contact us at:
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
