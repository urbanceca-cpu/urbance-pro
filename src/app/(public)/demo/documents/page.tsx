'use client';

import { useRouter } from 'next/navigation';

export default function DocumentsPage() {
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
                <span className="text-xs font-bold text-gray-500">Documents</span>
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
                  <p className="text-xs font-semibold text-gray-500">Documents</p>
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
          <button onClick={() => router.back()} className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-5xl font-black text-gray-900 mb-3">Document Management</h1>
          <p className="text-xl text-gray-600 font-semibold">Upload and manage your professional documents</p>
        </div>

        {/* Upload Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Active Documents */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Active Documents</h2>
              
              <div className="space-y-4">
                {[
                  { name: 'Government ID', status: 'verified', uploaded: 'Jan 31, 2026', expires: 'Feb 28, 2026' },
                  { name: 'Background Check', status: 'pending', uploaded: 'Jan 28, 2026', expires: 'Feb 28, 2026' },
                  { name: 'Insurance Certificate', status: 'verified', uploaded: 'Jan 20, 2026', expires: 'Feb 28, 2026' },
                ].map((doc) => (
                  <div key={doc.name} className="border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-400 transition-all">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-gray-900 font-black text-lg">{doc.name}</p>
                        <p className="text-gray-600 text-sm font-semibold">Uploaded: {doc.uploaded}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        doc.status === 'verified'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {doc.status === 'verified' ? '✓ Verified' : '⏳ Pending'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 font-semibold mb-4">Expires: {doc.expires}</div>
                    <div className="flex gap-3">
                      <button className="flex-1 py-2 border-2 border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-all">
                        View
                      </button>
                      <button className="flex-1 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all">
                        Replace
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload New Document */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-3xl p-8">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Upload New Document</h2>
              
              <div className="border-4 border-dashed border-blue-400 rounded-2xl p-12 text-center">
                <svg className="w-16 h-16 text-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <p className="text-gray-900 font-black text-lg mb-2">Drag and drop files here</p>
                <p className="text-gray-600 font-semibold mb-6">or click to select from your computer</p>
                <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg transition-all">
                  Select Files
                </button>
              </div>
            </div>
          </div>

          {/* Document Requirements */}
          <div className="space-y-6">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 sticky top-24">
              <h3 className="text-gray-900 font-black text-lg mb-4">Requirements</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-700 font-bold mb-2">Supported Formats</p>
                  <p className="text-gray-600 text-sm font-semibold">PDF, JPG, PNG (Max 10MB)</p>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-700 font-bold mb-2">File Quality</p>
                  <p className="text-gray-600 text-sm font-semibold">Clear, readable photos with visible text and details</p>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <p className="text-gray-700 font-bold mb-2">Expiration</p>
                  <p className="text-gray-600 text-sm font-semibold">Documents expire monthly and must be re-uploaded</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
