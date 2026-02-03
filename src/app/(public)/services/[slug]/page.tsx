'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AVAILABLE_SERVICES } from '@/lib/constants';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { use } from 'react';

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const service = AVAILABLE_SERVICES.find(s => s.key === slug);

  if (!service) {
    notFound();
  }

  const { ref: benefitsRef, isVisible: benefitsVisible } = useScrollReveal();
  const { ref: requirementsRef, isVisible: requirementsVisible } = useScrollReveal();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollReveal();

  return (
    <>
      <div className="relative">
        <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 z-0"></div>
        <Navbar variant="dark" />
      </div>
      <main className="flex flex-col overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 -mt-20 pt-20">
          {/* Dynamic background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="max-w-6xl mx-auto px-6 py-24 relative z-10 w-full">
            {/* Breadcrumb */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Link href="/" className="hover:text-white transition-colors">Home</Link>
                <span>/</span>
                <Link href="/services" className="hover:text-white transition-colors">Services</Link>
                <span>/</span>
                <span className="text-white">{service.label}</span>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                {/* Icon & Rate Badge */}
                <div className="flex items-center gap-4">
                  <div className="text-7xl">{service.icon}</div>
                  <div className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black text-lg rounded-full shadow-lg">
                    {service.avgRate}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4">
                    {service.label}
                  </h1>
                  <p className="text-2xl text-gray-300">
                    {service.description}
                  </p>
                </div>

                {/* Details */}
                <p className="text-lg text-gray-400 leading-relaxed">
                  {service.details}
                </p>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/apply" className="group">
                    <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3">
                      <span>Apply as {service.label} Pro</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </Link>
                  <Link href="/services">
                    <button className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                      View All Services
                    </button>
                  </Link>
                </div>
              </div>

              {/* Right Stats Card */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Why Join Urbance?</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Premium Customers</h4>
                      <p className="text-gray-400 text-sm">Access high-quality clients who value professional work</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Flexible Schedule</h4>
                      <p className="text-gray-400 text-sm">Choose jobs that fit your availability and location</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Weekly Payouts</h4>
                      <p className="text-gray-400 text-sm">Get paid quickly via direct deposit every week</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Build Your Reputation</h4>
                      <p className="text-gray-400 text-sm">Earn ratings and reviews to attract more clients</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT YOU'LL DO SECTION */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <div 
              ref={benefitsRef}
              className="text-center mb-16"
              style={{
                opacity: benefitsVisible ? 1 : 0,
                transform: benefitsVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
              }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                What You'll Be Doing
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                As a {service.label} professional on Urbance, here's what your typical work looks like
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.details.split(', ').map((task, index) => (
                <TaskCard key={index} task={task} index={index} isVisible={benefitsVisible} />
              ))}
            </div>
          </div>
        </section>

        {/* REQUIREMENTS SECTION */}
        <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div 
              ref={requirementsRef}
              className="text-center mb-16"
              style={{
                opacity: requirementsVisible ? 1 : 0,
                transform: requirementsVisible ? 'translateY(0)' : 'translateY(40px)',
                transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
              }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                Requirements to Join
              </h2>
              <p className="text-xl text-gray-600">
                What you need to become a verified {service.label} pro
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <RequirementCard
                title="Experience & Skills"
                items={[
                  '2+ years of professional experience',
                  'Strong portfolio or references',
                  'Excellent customer service skills',
                  'Reliable transportation'
                ]}
                icon="💼"
                isVisible={requirementsVisible}
              />

              <RequirementCard
                title="Legal Requirements"
                items={[
                  'Valid government-issued ID',
                  'Background check clearance',
                  'Liability insurance ($2M minimum)',
                  'Business license (if required)'
                ]}
                icon="📋"
                isVisible={requirementsVisible}
              />

              <RequirementCard
                title="Professional Standards"
                items={[
                  'Own tools and equipment',
                  'Professional appearance',
                  'Strong communication skills',
                  'Commitment to quality work'
                ]}
                icon="⭐"
                isVisible={requirementsVisible}
              />
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section 
          ref={ctaRef}
          className="py-24 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Start Earning?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join our platform as a {service.label} professional and connect with customers who value quality work.
            </p>

            <Link href="/apply">
              <button className="px-12 py-5 bg-white text-blue-600 font-black text-lg rounded-xl shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3">
                <span>Apply as {service.label} Pro</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </Link>

            <div className="mt-10 flex items-center justify-center gap-8 text-white/80 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No application fees</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>3-5 day approval</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Start earning immediately</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Task Card Component
function TaskCard({ task, index, isVisible }: { task: string; index: number; isVisible: boolean }) {
  return (
    <div
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s ease-out ${index * 0.1}s, transform 0.8s ease-out ${index * 0.1}s`,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-gray-700 font-medium">{task}</p>
      </div>
    </div>
  );
}

// Requirement Card Component
function RequirementCard({ title, items, icon, isVisible }: { title: string; items: string[]; icon: string; isVisible: boolean }) {
  return (
    <div
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
    >
      <div className="text-5xl mb-6">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3 text-gray-600">
            <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
