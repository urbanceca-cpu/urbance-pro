'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { RevealStagger, RevealItem } from '@/components/RevealStagger';

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All Questions', icon: '🌟' },
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'payments', name: 'Payments & Earnings', icon: '💰' },
    { id: 'jobs', name: 'Jobs & Clients', icon: '👥' },
    { id: 'account', name: 'Account & Support', icon: '⚙️' },
  ];

  const faqs = [
    // Getting Started
    {
      category: 'getting-started',
      question: 'How much does it cost to join?',
      answer: 'Joining Urbance is 100% free. There are no signup fees, monthly fees, or hidden costs. We only take a 15% commission on completed jobs—you earn, we earn. That\'s it.',
    },
    {
      category: 'getting-started',
      question: 'How long does the approval process take?',
      answer: 'Most applications are reviewed within 3-5 business days. Background checks typically take 2-3 days. Once approved, you can start working immediately and accepting jobs.',
    },
    {
      category: 'getting-started',
      question: 'What areas do you serve?',
      answer: 'We currently operate throughout British Columbia, with the highest demand in Metro Vancouver (Vancouver, Surrey, Burnaby, Richmond, Coquitlam, Langley, and surrounding areas). We\'re expanding to other cities soon.',
    },
    {
      category: 'getting-started',
      question: 'Do I need insurance?',
      answer: 'Yes, liability insurance ($2M minimum) is required for most services. If you don\'t have it yet, we can recommend affordable providers during onboarding. Some services may have additional requirements.',
    },
    {
      category: 'getting-started',
      question: 'What documents do I need to apply?',
      answer: 'You\'ll need a valid government-issued ID, proof of eligibility to work in Canada, relevant certifications or trade licenses, proof of insurance, and professional references. We\'ll guide you through what\'s needed during the application process.',
    },
    {
      category: 'getting-started',
      question: 'Can I work for other platforms?',
      answer: 'Absolutely! Urbance is flexible. You\'re free to work independently or with other services. We only ask that you deliver quality work on the jobs you accept from us.',
    },

    // Payments & Earnings
    {
      category: 'payments',
      question: 'When do I get paid?',
      answer: 'Payments are processed weekly via direct deposit every Friday. You can track your earnings in real-time through the dashboard and see exactly when funds will arrive.',
    },
    {
      category: 'payments',
      question: 'How much can I earn?',
      answer: 'Earnings vary by service type, experience, and how much you work. On average, our professionals earn $3,500-$8,000 per month. Top earners make $10,000+ monthly. You set your own rates and schedule.',
    },
    {
      category: 'payments',
      question: 'What is the commission rate?',
      answer: 'Urbance takes a 15% commission on completed jobs. This covers payment processing, insurance, customer support, marketing, and platform maintenance. There are no other fees.',
    },
    {
      category: 'payments',
      question: 'Can I set my own rates?',
      answer: 'Yes! You have complete control over your pricing. We provide market rate guidance to help you stay competitive, but the final decision is yours.',
    },
    {
      category: 'payments',
      question: 'What payment methods do you support?',
      answer: 'We pay via direct deposit to your Canadian bank account. Payments are secure, automated, and processed every Friday for the previous week\'s completed work.',
    },
    {
      category: 'payments',
      question: 'Are there any hidden fees?',
      answer: 'No hidden fees whatsoever. The 15% commission is our only charge. No monthly subscriptions, no lead fees, no withdrawal fees. What you see is what you get.',
    },

    // Jobs & Clients
    {
      category: 'jobs',
      question: 'Can I choose which jobs to accept?',
      answer: 'Yes! You have complete control. Browse available jobs, see all details (location, pay, scope), and only accept the ones that fit your schedule and preferences. No pressure to accept everything.',
    },
    {
      category: 'jobs',
      question: 'How do I get more jobs?',
      answer: 'Build a strong profile with great photos and detailed service descriptions. Complete jobs on time and deliver quality work to earn 5-star reviews. Respond quickly to job requests. Top-rated pros get priority placement.',
    },
    {
      category: 'jobs',
      question: 'What if I need to cancel a job?',
      answer: 'Life happens! You can cancel jobs, but we ask for as much notice as possible. Frequent cancellations may affect your rating and job priority. Contact support if you\'re facing an emergency.',
    },
    {
      category: 'jobs',
      question: 'Can I bring my existing clients to the platform?',
      answer: 'Yes! You can invite your existing clients to book through Urbance. They\'ll enjoy protection, easy payment processing, and scheduling tools. You\'ll benefit from platform support and payment security.',
    },
    {
      category: 'jobs',
      question: 'What if a client is unsatisfied?',
      answer: 'We provide mediation for disputes and work to find fair solutions. Our support team reviews each case individually. We protect both clients and professionals, ensuring fair treatment for everyone.',
    },
    {
      category: 'jobs',
      question: 'How do reviews and ratings work?',
      answer: 'Clients can rate you 1-5 stars and leave written reviews after job completion. Your overall rating is the average of all reviews. High ratings lead to more job opportunities and higher earnings.',
    },

    // Account & Support
    {
      category: 'account',
      question: 'What if I have an issue with a customer?',
      answer: 'Our support team is here to help. We provide mediation for disputes, handle payment issues, and offer 24/7 support for urgent matters. Customer satisfaction is important, but so is fair treatment of our pros.',
    },
    {
      category: 'account',
      question: 'Can I pause my account temporarily?',
      answer: 'Yes! You can set your availability to "unavailable" anytime. You won\'t receive new job requests, but you can still complete scheduled jobs. Reactivate whenever you\'re ready.',
    },
    {
      category: 'account',
      question: 'How do I update my services or rates?',
      answer: 'Log into your dashboard and go to Profile Settings. You can add/remove services, update rates, change your availability, upload new photos, and edit your bio anytime.',
    },
    {
      category: 'account',
      question: 'What happens if I get injured on the job?',
      answer: 'As an independent contractor, you\'re responsible for your own WCB coverage. We strongly recommend having proper insurance. Contact support immediately if an incident occurs for guidance and documentation.',
    },
    {
      category: 'account',
      question: 'How do I contact support?',
      answer: 'Email support@urbance.ca, call our hotline (1-888-URBANCE), or use live chat in your dashboard. We aim to respond within 24 hours on weekdays, faster for urgent issues.',
    },
    {
      category: 'account',
      question: 'Can I delete my account?',
      answer: 'Yes, you can delete your account anytime from Account Settings. Complete all scheduled jobs first and ensure there are no pending payments. Account deletion is permanent and cannot be undone.',
    },
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <div className="relative">
        <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 z-0"></div>
        <Navbar variant="dark" />
      </div>

      <main className="flex flex-col overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 -mt-20 pt-20">
          {/* Animated background blobs */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full">
            <div className="text-center max-w-4xl mx-auto space-y-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-white/10 rounded-full">
                <span className="text-white text-sm font-semibold">💡 Got Questions? We've Got Answers</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1]">
                  Frequently Asked
                  <br />
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                      Questions
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 10C50 2 100 2 150 6C200 10 250 10 298 6" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#C084FC" />
                          <stop offset="50%" stopColor="#F472B6" />
                          <stop offset="100%" stopColor="#FB7185" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                  Everything you need to know about joining Urbance and earning on your terms.
                </p>
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search for answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg"
                  />
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 max-w-3xl mx-auto">
                <div className="space-y-2">
                  <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{faqs.length}+</div>
                  <div className="text-sm text-gray-400">Questions Answered</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">24/7</div>
                  <div className="text-sm text-gray-400">Support Available</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">&lt;24h</div>
                  <div className="text-sm text-gray-400">Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY FILTERS */}
        <section className="sticky top-20 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span>{category.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    activeCategory === category.id
                      ? 'bg-white/20 text-white'
                      : 'bg-white text-gray-600'
                  }`}>
                    {category.id === 'all' 
                      ? faqs.length 
                      : faqs.filter(f => f.category === category.id).length}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-4xl mx-auto">
            {searchQuery && (
              <div className="mb-8 text-center">
                <p className="text-gray-600">
                  Found <span className="font-bold text-purple-600">{filteredFaqs.length}</span> result{filteredFaqs.length !== 1 ? 's' : ''} for "{searchQuery}"
                </p>
              </div>
            )}

            {filteredFaqs.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-6">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No results found</h3>
                <p className="text-gray-600 mb-8">Try a different search term or browse by category</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  View All Questions
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <div key={index}>
                    <FAQItem faq={faq} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* STILL HAVE QUESTIONS SECTION */}
        <section className="py-24 px-6 bg-gradient-to-br from-purple-600 via-pink-600 to-rose-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="text-6xl mb-6">💬</div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Our support team is here to help. Get answers within 24 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:support@urbance.ca">
                <button className="px-8 py-4 bg-white text-purple-600 font-bold text-lg rounded-xl shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:scale-105 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Email Support</span>
                </button>
              </a>
              <a href="tel:1-888-URBANCE">
                <button className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-xl border-2 border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Call Us</span>
                </button>
              </a>
            </div>

            <div className="mt-10 flex items-center justify-center gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Fast response</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Expert help</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Friendly team</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join thousands of professionals earning on their terms. Application takes just 10 minutes.
            </p>

            <a href="/apply">
              <button className="px-12 py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg rounded-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3">
                <span>Start Your Application</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

// FAQ Item Component
function FAQItem({ faq }: { faq: { category: string; question: string; answer: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  const categoryColors = {
    'getting-started': 'from-blue-500 to-cyan-500',
    'payments': 'from-emerald-500 to-teal-500',
    'jobs': 'from-purple-500 to-pink-500',
    'account': 'from-orange-500 to-red-500',
  };

  const categoryIcons = {
    'getting-started': '🚀',
    'payments': '💰',
    'jobs': '👥',
    'account': '⚙️',
  };

  return (
    <div className="group bg-white rounded-2xl border-2 border-gray-200 hover:border-purple-300 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-start gap-4 text-left"
      >
        <div className={`flex-shrink-0 w-12 h-12 bg-gradient-to-br ${categoryColors[faq.category as keyof typeof categoryColors]} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
          {categoryIcons[faq.category as keyof typeof categoryIcons]}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-purple-600 transition-colors">
            {faq.question}
          </h3>
          {isOpen && (
            <p className="text-gray-600 leading-relaxed mt-3">
              {faq.answer}
            </p>
          )}
        </div>
        <svg 
          className={`flex-shrink-0 w-6 h-6 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
