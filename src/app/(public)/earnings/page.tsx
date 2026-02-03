'use client';

import { useEffect, useState, useRef } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function Earnings() {
  return (
    <>
      <div className="relative">
        <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 z-0"></div>
        <Navbar variant="dark" />
      </div>
      <main className="flex flex-col overflow-hidden">
        {/* HERO SECTION */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 -mt-20 pt-20">
          {/* Dynamic background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full">
            <div className="text-center max-w-5xl mx-auto space-y-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 backdrop-blur-sm border border-white/10 rounded-full">
                <span className="text-3xl">💰</span>
                <span className="text-white text-sm font-semibold">Instant Payouts • Real-Time Tracking</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1]">
                  Watch Your Earnings
                  <br />
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Grow in Real-Time
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 10C50 2 100 2 150 6C200 10 250 10 298 6" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#34D399" />
                          <stop offset="50%" stopColor="#22D3EE" />
                          <stop offset="100%" stopColor="#60A5FA" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Get paid anytime after work completed with instant visibility into your earnings. No waiting, no surprises—just transparent, reliable payouts.
                </p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Instant</div>
                  <div className="text-gray-300 mt-2 font-medium">Payouts After Completion</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">24/7</div>
                  <div className="text-gray-300 mt-2 font-medium">Real-Time Dashboard</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">$0</div>
                  <div className="text-gray-300 mt-2 font-medium">Hidden Fees</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* LIVE DASHBOARD PREVIEW */}
        <LiveDashboardPreview />

        {/* PAYOUT PROCESS SECTION */}
        <PayoutProcessSection />

        {/* DASHBOARD FEATURES */}
        <DashboardFeaturesSection />

        {/* LIVE EARNINGS COUNTER */}
        <LiveEarningsSection />

        {/* CTA SECTION */}
        <section className="relative py-16 px-6 overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Start Earning Today
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join thousands of professionals who trust Urbance for instant payouts and transparent earnings tracking.
            </p>
            <button className="px-12 py-5 bg-gradient-to-r from-emerald-500 to-blue-600 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105 animate-pulse">
              Apply Now - Get Paid After Every Job
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Live Dashboard Preview Component
function LiveDashboardPreview() {
  const { ref, isVisible } = useScrollReveal();
  const [todayEarnings, setTodayEarnings] = useState(234.50);
  const [weekEarnings, setWeekEarnings] = useState(1456.75);
  const [completedJobs, setCompletedJobs] = useState(12);
  const [rating, setRating] = useState(4.9);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      // Randomly update earnings to simulate live activity
      if (Math.random() > 0.7) {
        const increase = Math.random() * 50 + 20;
        setTodayEarnings(prev => prev + increase);
        setWeekEarnings(prev => prev + increase);
        setCompletedJobs(prev => prev + 1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section ref={ref} className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div 
          className="text-center mb-12"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 text-sm font-bold rounded-full mb-6">
            📊 Your Dashboard Preview
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            This Is What You'll See
            <br />
            <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
              After You're Onboarded
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real-time earnings tracking, instant job updates, and complete transparency—all in one beautiful dashboard.
          </p>
        </div>

        {/* Mock Dashboard */}
        <div 
          className="bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
            transition: 'opacity 1s ease-out 0.2s, transform 1s ease-out 0.2s',
          }}
        >
          {/* Dashboard Header */}
          <div className="bg-gradient-to-r from-gray-900 to-slate-800 px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-bold text-xl">
                JD
              </div>
              <div>
                <div className="text-white font-bold">John Doe</div>
                <div className="text-gray-400 text-sm">Premium Plumber</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-300 text-sm font-semibold">Available</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-8">
            <EarningCard
              title="Today's Earnings"
              amount={`$${todayEarnings.toFixed(2)}`}
              change="+$45.00"
              icon="💵"
              gradient="from-emerald-500 to-cyan-500"
              isAnimating={isVisible}
            />
            <EarningCard
              title="This Week"
              amount={`$${weekEarnings.toFixed(2)}`}
              change="+12.5%"
              icon="📈"
              gradient="from-blue-500 to-purple-500"
              isAnimating={isVisible}
            />
            <EarningCard
              title="Jobs Completed"
              amount={completedJobs.toString()}
              change="3 pending"
              icon="✅"
              gradient="from-purple-500 to-pink-500"
              isAnimating={isVisible}
            />
            <EarningCard
              title="Rating"
              amount={rating.toFixed(1)}
              change="⭐⭐⭐⭐⭐"
              icon="🏆"
              gradient="from-amber-500 to-orange-500"
              isAnimating={isVisible}
            />
          </div>

          {/* Live Activity Feed */}
          <div className="px-8 pb-8">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Live Activity</h3>
                <span className="text-sm text-gray-500">Last updated: Just now</span>
              </div>
              <div className="space-y-4">
                <ActivityItem
                  icon="💰"
                  title="Payment Received"
                  description="$145.00 deposited to your account"
                  time="2 min ago"
                  color="emerald"
                />
                <ActivityItem
                  icon="🔧"
                  title="Job Completed"
                  description="Kitchen Sink Repair - Sarah M."
                  time="1 hour ago"
                  color="blue"
                />
                <ActivityItem
                  icon="⭐"
                  title="New 5-Star Review"
                  description="'Excellent work and very professional!'"
                  time="3 hours ago"
                  color="amber"
                />
                <ActivityItem
                  icon="📅"
                  title="New Job Request"
                  description="Bathroom Faucet Installation - 2.5 mi away"
                  time="5 hours ago"
                  color="purple"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Earning Card Component
function EarningCard({ title, amount, change, icon, gradient, isAnimating }: any) {
  return (
    <div 
      className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
      style={{
        opacity: isAnimating ? 1 : 0,
        transform: isAnimating ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.6s ease-out 0.4s, transform 0.6s ease-out 0.4s',
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <span className={`text-xs font-semibold text-gray-500 px-2 py-1 bg-gray-100 rounded-full`}>
          {change}
        </span>
      </div>
      <div className="text-sm text-gray-600 mb-2">{title}</div>
      <div className={`text-3xl font-black bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
        {amount}
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ icon, title, description, time, color }: any) {
  const colorMap: any = {
    emerald: 'bg-emerald-100 text-emerald-700',
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    purple: 'bg-purple-100 text-purple-700',
  };

  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl hover:shadow-md transition-all duration-300">
      <div className={`w-10 h-10 rounded-full ${colorMap[color]} flex items-center justify-center flex-shrink-0 text-lg`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900">{title}</div>
        <div className="text-sm text-gray-600 truncate">{description}</div>
      </div>
      <div className="text-xs text-gray-500 whitespace-nowrap">{time}</div>
    </div>
  );
}

// Payout Process Section
function PayoutProcessSection() {
  const { ref, isVisible } = useScrollReveal();

  const steps = [
    {
      icon: '🎯',
      title: 'Complete Jobs',
      description: 'Finish your service and customer approves the work',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '✅',
      title: 'Instant Confirmation',
      description: 'Earnings appear in your dashboard immediately',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: '💳',
      title: 'Instant Processing',
      description: 'We process your payment immediately after work is completed and approved',
      color: 'from-orange-500 to-amber-500',
    },
    {
      icon: '🏦',
      title: 'Direct Deposit',
      description: 'Money transferred directly to your bank account',
      color: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <section ref={ref} className="py-16 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div 
          className="text-center mb-12"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-bold rounded-full mb-6">
            💸 Simple & Reliable
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            How Payouts Work
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From job completion to money in your bank—here's the complete journey of your earnings.
          </p>
        </div>

        {/* Flow Container - Vertical Timeline Style */}
        <div className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
                transition: `opacity 0.8s ease-out ${index * 0.15}s, transform 0.8s ease-out ${index * 0.15}s`,
              }}
            >
              <div className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} mb-12 md:mb-16`}>
                {/* Step Number Circle with Line */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 z-10`}>
                    <span className="text-3xl font-black text-white">{index + 1}</span>
                  </div>
                  {/* Connecting Line */}
                  {index < steps.length - 1 && (
                    <div className={`w-1 h-24 bg-gradient-to-b ${step.color} opacity-30 mt-4`}></div>
                  )}
                </div>

                {/* Content Card */}
                <div className="flex-1 group">
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-20 rounded-3xl blur-2xl transition-all duration-500`}></div>
                  
                  <div className="relative bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300">
                    {/* Icon Badge */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} bg-opacity-10 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-4xl">{step.icon}</span>
                    </div>

                    {/* Title & Description */}
                    <h3 className={`text-2xl font-black mb-3 bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {step.description}
                    </p>

                    {/* Decorative Corner */}
                    <div className={`absolute top-4 right-4 w-20 h-20 bg-gradient-to-br ${step.color} opacity-5 rounded-full -z-10`}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Payout Details */}
        <div 
          className="mt-12 bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-3xl p-8 border border-emerald-200"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 1s ease-out 0.6s, transform 1s ease-out 0.6s',
          }}
        >
          <h3 className="text-3xl font-black text-gray-900 mb-8 text-center">Payout Details</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent mb-3">
                Instant
              </div>
              <div className="text-gray-700 font-semibold mb-2">Processing</div>
              <div className="text-sm text-gray-600">Payment initiated immediately after work completion</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                Anytime
              </div>
              <div className="text-gray-700 font-semibold mb-2">Get Paid</div>
              <div className="text-sm text-gray-600">Receive payment right after your work is approved</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                100%
              </div>
              <div className="text-gray-700 font-semibold mb-2">Transparent</div>
              <div className="text-sm text-gray-600">See exactly what you earn for every completed job</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Dashboard Features Section
function DashboardFeaturesSection() {
  const { ref, isVisible } = useScrollReveal();

  const features = [
    {
      icon: '📊',
      title: 'Real-Time Analytics',
      description: 'Watch your earnings grow minute by minute with live updates as you complete jobs.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '📈',
      title: 'Performance Insights',
      description: 'Track your best days, top-performing services, and customer satisfaction trends.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: '💰',
      title: 'Earning Breakdown',
      description: 'See exactly how much you earned from each job with complete transparency.',
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      icon: '🎯',
      title: 'Goal Tracking',
      description: 'Set weekly or monthly income goals and monitor your progress in real-time.',
      gradient: 'from-orange-500 to-amber-500',
    },
    {
      icon: '🔔',
      title: 'Instant Notifications',
      description: 'Get alerted immediately when you receive payments, new job requests, or reviews.',
      gradient: 'from-rose-500 to-red-500',
    },
    {
      icon: '📱',
      title: 'Mobile Access',
      description: 'Check your earnings anywhere, anytime with our fully responsive mobile dashboard.',
      gradient: 'from-indigo-500 to-blue-500',
    },
  ];

  return (
    <section ref={ref} className="py-16 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <div 
          className="text-center mb-12"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-bold rounded-full mb-6">
            🚀 Powerful Features
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Everything You Need
            <br />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              In One Dashboard
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Manage your entire business with professional tools designed for service providers like you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 group"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
                transition: `opacity 0.8s ease-out ${index * 0.1}s, transform 0.8s ease-out ${index * 0.1}s`,
              }}
            >
              <div className={`text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                {feature.icon}
              </div>
              <h3 className={`text-2xl font-bold mb-4 bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}>
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// Live Earnings Counter Section
function LiveEarningsSection() {
  const { ref, isVisible } = useScrollReveal();
  const [earnings, setEarnings] = useState(0);
  const [jobs, setJobs] = useState(0);
  const targetEarnings = 4752.50;
  const targetJobs = 28;

  useEffect(() => {
    if (!isVisible) return;

    const earningsDuration = 2000;
    const jobsDuration = 1500;
    const earningsIncrement = targetEarnings / (earningsDuration / 50);
    const jobsIncrement = targetJobs / (jobsDuration / 50);

    let earningsValue = 0;
    let jobsValue = 0;

    const earningsInterval = setInterval(() => {
      earningsValue += earningsIncrement;
      if (earningsValue >= targetEarnings) {
        earningsValue = targetEarnings;
        clearInterval(earningsInterval);
      }
      setEarnings(earningsValue);
    }, 50);

    const jobsInterval = setInterval(() => {
      jobsValue += jobsIncrement;
      if (jobsValue >= targetJobs) {
        jobsValue = targetJobs;
        clearInterval(jobsInterval);
      }
      setJobs(Math.floor(jobsValue));
    }, 50);

    return () => {
      clearInterval(earningsInterval);
      clearInterval(jobsInterval);
    };
  }, [isVisible]);

  return (
    <section ref={ref} className="py-16 px-6 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div 
          className="text-center mb-12"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
            transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
          }}
        >
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 backdrop-blur-sm border border-white/10 rounded-full mb-6">
            <span className="text-white text-sm font-semibold">📊 Live Earnings Example</span>
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            Watch the Numbers Grow
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            This is what your typical week could look like—earnings updating in real-time as you complete jobs.
          </p>
        </div>

        {/* Live Counter Display */}
        <div 
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'scale(1)' : 'scale(0.95)',
            transition: 'opacity 1s ease-out 0.3s, transform 1s ease-out 0.3s',
          }}
        >
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className="text-center">
              <div className="text-gray-400 text-lg mb-4 font-semibold">Weekly Earnings</div>
              <div className="text-7xl md:text-8xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-4 tracking-tight">
                ${earnings.toFixed(2)}
              </div>
              <div className="flex items-center justify-center gap-2 text-emerald-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-lg font-bold">+24.5% vs last week</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-400 text-lg mb-4 font-semibold">Jobs Completed</div>
              <div className="text-7xl md:text-8xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent mb-4 tracking-tight">
                {jobs}
              </div>
              <div className="flex items-center justify-center gap-2 text-purple-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-lg font-bold">5 more scheduled</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Ticker */}
          <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-white font-bold">Recent Activity</span>
            </div>
            <div className="space-y-3">
              <LiveActivityTicker 
                icon="💰" 
                text="$185.00 - Bathroom Renovation Completed" 
                time="5 min ago"
                isVisible={isVisible}
                delay={0.5}
              />
              <LiveActivityTicker 
                icon="✅" 
                text="$125.00 - HVAC Maintenance Approved" 
                time="18 min ago"
                isVisible={isVisible}
                delay={0.7}
              />
              <LiveActivityTicker 
                icon="💵" 
                text="$95.00 - Plumbing Repair Payment Received" 
                time="42 min ago"
                isVisible={isVisible}
                delay={0.9}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Live Activity Ticker Component
function LiveActivityTicker({ icon, text, time, isVisible, delay }: any) {
  return (
    <div 
      className="flex items-center gap-4 bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
        transition: `opacity 0.6s ease-out ${delay}s, transform 0.6s ease-out ${delay}s`,
      }}
    >
      <span className="text-3xl">{icon}</span>
      <div className="flex-1">
        <div className="text-white font-medium">{text}</div>
        <div className="text-gray-400 text-sm">{time}</div>
      </div>
    </div>
  );
}
