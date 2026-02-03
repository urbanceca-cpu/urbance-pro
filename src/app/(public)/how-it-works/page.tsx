'use client';

import { Metadata } from 'next';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function HowItWorks() {
  return (
    <>
      <div className="relative">
        {/* Extended background for navbar area */}
        <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 z-0"></div>
        <Navbar variant="dark" />
      </div>
      <main className="flex flex-col overflow-hidden">
        {/* HERO SECTION - Inspired by Home Page */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 -mt-20 pt-20">
          {/* Dynamic background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-cyan-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full">
            <div className="text-center max-w-4xl mx-auto space-y-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-white text-sm font-semibold">Simple 4-Step Process</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1]">
                  Your Journey to
                  <br />
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      Financial Freedom
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 10C50 2 100 2 150 6C200 10 250 10 298 6" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#60A5FA" />
                          <stop offset="50%" stopColor="#22D3EE" />
                          <stop offset="100%" stopColor="#A78BFA" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
                  Join thousands of professionals earning on their terms. Quick approval, flexible schedule, higher earnings.
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/apply" className="group">
                  <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3">
                    <span>Start Your Application</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </Link>
                <Link href="/earnings" className="group">
                  <button className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-semibold text-lg rounded-xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300">
                    Calculate Earnings
                  </button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 pt-12 max-w-3xl mx-auto">
                <div className="space-y-2">
                  <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">10 min</div>
                  <div className="text-sm text-gray-400">Application Time</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">3-5 days</div>
                  <div className="text-sm text-gray-400">Approval Process</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">98%</div>
                  <div className="text-sm text-gray-400">Approval Rate</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* THE PROCESS - Timeline Style */}
        <section className="py-32 px-6 bg-white relative overflow-hidden">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">How It Works</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Four simple steps to start earning. No hidden fees, no complicated processes.
              </p>
            </div>

            <div className="relative">
              {/* Connecting Line */}
              <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-cyan-500 transform -translate-x-1/2"></div>

              {/* Steps */}
              <div className="space-y-24">
                <TimelineStep
                  number={1}
                  title="Submit Your Application"
                  description="Takes just 10 minutes. Tell us about your skills, experience, and services. Upload your ID and relevant certifications."
                  features={[
                    "Quick online form",
                    "No application fee",
                    "Instant confirmation",
                    "Mobile-friendly"
                  ]}
                  color="blue"
                  side="left"
                />
                
                <TimelineStep
                  number={2}
                  title="Background Verification"
                  description="We conduct a thorough but fast background check to ensure safety for everyone on the platform. This typically takes 3-5 business days."
                  features={[
                    "Criminal record check",
                    "Identity verification",
                    "Professional references",
                    "Insurance validation"
                  ]}
                  color="purple"
                  side="right"
                />
                
                <TimelineStep
                  number={3}
                  title="Profile Setup & Training"
                  description="Once approved, complete your professional profile. Watch quick training videos to understand how the platform works and best practices."
                  features={[
                    "Customize your services",
                    "Set your availability",
                    "Upload portfolio photos",
                    "Watch training modules"
                  ]}
                  color="cyan"
                  side="left"
                />
                
                <TimelineStep
                  number={4}
                  title="Start Earning"
                  description="Browse available jobs in your area, accept the ones you want, and get to work. Get paid weekly via direct deposit."
                  features={[
                    "Choose your jobs",
                    "Set your schedule",
                    "Track earnings live",
                    "Weekly payouts"
                  ]}
                  color="emerald"
                  side="right"
                />
              </div>
            </div>
          </div>
        </section>

        {/* REQUIREMENTS SECTION */}
        <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">What You'll Need</h2>
              <p className="text-xl text-gray-600">Simple requirements to get started</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <RequirementCard
                icon="🆔"
                title="Legal Documents"
                items={[
                  "Valid government-issued ID",
                  "Proof of eligibility to work",
                  "Background check consent",
                  "Tax information (SIN)"
                ]}
                color="blue"
              />
              
              <RequirementCard
                icon="💼"
                title="Professional Credentials"
                items={[
                  "Proof of experience (2+ years)",
                  "Trade certifications (if applicable)",
                  "Professional references",
                  "Portfolio or past work samples"
                ]}
                color="purple"
              />
              
              <RequirementCard
                icon="🛡️"
                title="Insurance & Safety"
                items={[
                  "Liability insurance ($2M minimum)",
                  "WCB coverage (self-employed)",
                  "Business license (if required)",
                  "Safety certifications"
                ]}
                color="cyan"
              />
            </div>

            <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center">
              <p className="text-gray-700">
                <span className="font-bold">Don't have everything yet?</span> No problem! Apply now and we'll guide you through what you need during the process.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-24 px-6 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Common Questions</h2>
              <p className="text-xl text-gray-600">Everything you need to know</p>
            </div>

            <div className="space-y-4">
              <FAQItem
                question="How much does it cost to join?"
                answer="Joining Urbance is 100% free. There are no signup fees, monthly fees, or hidden costs. We only take a 15% commission on completed jobs—you earn, we earn. That's it."
              />
              
              <FAQItem
                question="When do I get paid?"
                answer="Payments are processed weekly via direct deposit every Friday. You can track your earnings in real-time through the dashboard and see exactly when funds will arrive."
              />
              
              <FAQItem
                question="Can I work for other platforms?"
                answer="Absolutely! Urbance is flexible. You're free to work independently or with other services. We only ask that you deliver quality work on the jobs you accept from us."
              />
              
              <FAQItem
                question="What if I have an issue with a customer?"
                answer="Our support team is here to help. We provide mediation for disputes, handle payment issues, and offer 24/7 support for urgent matters. Customer satisfaction is important, but so is fair treatment of our pros."
              />
              
              <FAQItem
                question="Do I need insurance?"
                answer="Yes, liability insurance ($2M minimum) is required for most services. If you don't have it yet, we can recommend affordable providers during onboarding. Some services may have additional requirements."
              />
              
              <FAQItem
                question="How long does approval take?"
                answer="Most applications are reviewed within 3-5 business days. Background checks typically take 2-3 days. Once approved, you can start working immediately."
              />
              
              <FAQItem
                question="Can I choose which jobs to accept?"
                answer="Yes! You have complete control. Browse available jobs, see all details (location, pay, scope), and only accept the ones that fit your schedule and preferences."
              />
              
              <FAQItem
                question="What areas do you serve?"
                answer="We currently operate throughout British Columbia, with the highest demand in Metro Vancouver (Vancouver, Surrey, Burnaby, Richmond, Coquitlam, Langley, and surrounding areas). We're expanding to other cities soon."
              />
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Join 5,000+ professionals who've already transformed their business with Urbance.
            </p>

            <Link href="/apply">
              <button className="px-12 py-5 bg-white text-blue-600 font-black text-lg rounded-xl shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3 animate-pulse-glow">
                <span>Start Your Application</span>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </Link>

            <div className="mt-10 flex items-center justify-center gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No upfront costs</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Quick approval</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Start earning fast</span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Timeline Step Component
function TimelineStep({ number, title, description, features, color, side }: {
  number: number;
  title: string;
  description: string;
  features: string[];
  color: 'blue' | 'purple' | 'cyan' | 'emerald';
  side: 'left' | 'right';
}) {
  const { ref, isVisible } = useScrollReveal();
  
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    cyan: 'from-cyan-500 to-cyan-600',
    emerald: 'from-emerald-500 to-emerald-600',
  };

  const bgColorClasses = {
    blue: 'bg-blue-50 border-blue-200',
    purple: 'bg-purple-50 border-purple-200',
    cyan: 'bg-cyan-50 border-cyan-200',
    emerald: 'bg-emerald-50 border-emerald-200',
  };

  return (
    <div 
      ref={ref}
      className={`lg:grid lg:grid-cols-2 gap-16 items-center ${side === 'right' ? 'lg:text-left' : 'lg:text-right'}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
    >
      {/* Content */}
      <div className={side === 'right' ? 'lg:order-2' : ''}>
        <div className={`inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r ${colorClasses[color]} rounded-full mb-6`}>
          <span className="text-white font-bold text-lg">Step {number}</span>
        </div>
        
        <h3 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">{title}</h3>
        <p className="text-lg text-gray-600 mb-6 leading-relaxed">{description}</p>
        
        <ul className="space-y-3">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3 text-gray-700">
              <svg className={`w-5 h-5 text-${color}-600 flex-shrink-0`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Visual */}
      <div className={`relative ${side === 'right' ? 'lg:order-1' : ''}`}>
        <div className="relative group">
          {/* Creative number design */}
          <div className="relative">
            {/* Glow layers */}
            <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses[color]} rounded-full blur-3xl opacity-20 scale-150 group-hover:scale-175 transition-transform duration-500`}></div>
            <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses[color]} rounded-full blur-2xl opacity-30 scale-125 group-hover:scale-150 transition-transform duration-500`}></div>
            
            {/* Main number with 3D effect */}
            <div className="relative">
              <div className={`text-[12rem] lg:text-[14rem] font-black leading-none bg-gradient-to-br ${colorClasses[color]} bg-clip-text text-transparent transform group-hover:scale-110 transition-all duration-300 select-none`}
                style={{
                  textShadow: '0 10px 30px rgba(0,0,0,0.2)',
                  WebkitTextStroke: '2px transparent',
                  paintOrder: 'stroke fill',
                }}>
                {number}
              </div>
              
              {/* Floating decorative dots */}
              <div className={`absolute top-1/4 -right-8 w-4 h-4 bg-gradient-to-r ${colorClasses[color]} rounded-full opacity-60 animate-bounce`} style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
              <div className={`absolute bottom-1/4 -left-8 w-3 h-3 bg-gradient-to-r ${colorClasses[color]} rounded-full opacity-50 animate-bounce`} style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
              <div className={`absolute top-1/2 right-0 w-2 h-2 bg-gradient-to-r ${colorClasses[color]} rounded-full opacity-40 animate-bounce`} style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
            </div>
          </div>
        </div>
        
        {/* Timeline Dot */}
        <div className={`hidden lg:block absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r ${colorClasses[color]} rounded-full shadow-lg border-4 border-white animate-pulse`} style={{
          [side === 'left' ? 'right' : 'left']: '-4rem'
        }}></div>
      </div>
    </div>
  );
}

// Requirement Card Component
function RequirementCard({ icon, title, items, color }: {
  icon: string;
  title: string;
  items: string[];
  color: 'blue' | 'purple' | 'cyan';
}) {
  const { ref, isVisible } = useScrollReveal();
  
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    cyan: 'from-cyan-500 to-cyan-600',
  };

  return (
    <div 
      ref={ref}
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
    >
      <div className={`w-16 h-16 bg-gradient-to-r ${colorClasses[color]} rounded-2xl flex items-center justify-center text-3xl mb-6`}>
        {icon}
      </div>
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

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const { ref, isVisible } = useScrollReveal();
  
  return (
    <div 
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
      }}
    >
      <details 
        className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-all duration-300 overflow-hidden"
      >
        <summary className="cursor-pointer p-6 flex items-center justify-between font-bold text-gray-900 text-lg hover:text-blue-600 transition-colors">
          <span>{question}</span>
          <svg className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="px-6 pb-6 text-gray-600 leading-relaxed">
          {answer}
        </div>
      </details>
    </div>
  );
}
