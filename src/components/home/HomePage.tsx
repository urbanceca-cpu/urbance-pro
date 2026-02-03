'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProviderApplicationForm } from '@/components/ProviderApplicationForm';
import { HeroBackground } from '@/components/HeroBackground';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { formatCurrency } from '@/lib/utils';

const rateOptions = [
  { label: '$45/hr — Cleaning', value: 45 },
  { label: '$65/hr — Handyman', value: 65 },
  { label: '$75/hr — Plumbing', value: 75 },
  { label: '$85/hr — Electrical', value: 85 },
  { label: '$55/hr — Beauty', value: 55 },
];

export function HomePage() {
  const [hours, setHours] = useState(25);
  const [rate, setRate] = useState(75);

  const monthlyEarnings = useMemo(() => {
    const gross = hours * rate * 4;
    const afterFee = gross * 0.85;
    return Math.round(afterFee);
  }, [hours, rate]);

  return (
    <>
      <div className="relative">
        {/* Extended background for navbar area */}
        <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 z-0"></div>
        <Navbar variant="dark" />
      </div>
      <main className="flex flex-col overflow-hidden">
        {/* HERO SECTION - COMPLETELY REDESIGNED */}
        <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 -mt-20 pt-20">
          {/* Dynamic background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full">
            <div className="grid lg:grid-cols-12 gap-16 items-center">
              {/* Left Content - 7 columns */}
              <div className="lg:col-span-7 space-y-10">
                {/* Badge */}
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <span className="text-white text-sm font-semibold">Trusted by 5,000+ Professionals</span>
                </div>

                {/* Main Headline */}
                <div className="space-y-6">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1]">
                    Your Business,
                    <br />
                    <span className="relative inline-block">
                      <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                        Your Rules
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
                  <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-2xl">
                    Join BC's premier platform for service professionals. Set your rates, choose your schedule, earn more.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/apply" className="group">
                    <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3">
                      <span>Get Started Free</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </Link>
                  <button className="w-full sm:w-auto px-8 py-4 bg-white/5 backdrop-blur-sm text-white font-semibold text-lg rounded-xl border border-white/20 hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                    <span>Watch How It Works</span>
                  </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
                  <div className="space-y-1">
                    <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">$8.5K</div>
                    <div className="text-sm text-gray-400">Avg. Monthly</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">24hrs</div>
                    <div className="text-sm text-gray-400">Fast Payout</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">4.9/5</div>
                    <div className="text-sm text-gray-400">Pro Rating</div>
                  </div>
                </div>
              </div>

              {/* Right Calculator - 5 columns */}
              <div className="lg:col-span-5">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-75"></div>
                  <div className="relative bg-gray-800/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-xl">💰</div>
                        <div>
                          <h3 className="text-xl font-bold text-white">Earnings Calculator</h3>
                          <p className="text-sm text-gray-400">See your potential</p>
                        </div>
                      </div>
                    </div>

                    {/* Hours Input */}
                    <div className="space-y-6 mb-8">
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-semibold text-gray-300">Weekly Hours</label>
                          <span className="text-2xl font-bold text-white">{hours}h</span>
                        </div>
                        <input
                          type="range"
                          min={10}
                          max={40}
                          step={5}
                          value={hours}
                          onChange={(e) => setHours(Number(e.target.value))}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>10h</span>
                          <span>40h</span>
                        </div>
                      </div>

                      {/* Rate Select */}
                      <div>
                        <label className="text-sm font-semibold text-gray-300 mb-3 block">Hourly Rate</label>
                        <select
                          value={rate}
                          onChange={(e) => setRate(Number(e.target.value))}
                          className="w-full bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 text-white font-medium hover:border-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
                        >
                          {rateOptions.map((option) => (
                            <option key={option.value} value={option.value} className="bg-gray-800">
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Result Box */}
                    <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-2xl p-6 border border-white/10 text-center">
                      <div className="text-sm font-semibold text-gray-300 mb-2">Monthly Earnings</div>
                      <div className="text-5xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                        {formatCurrency(monthlyEarnings)}
                      </div>
                      <div className="text-xs text-gray-400">After 15% platform fee</div>
                    </div>

                    {/* Bottom CTA */}
                    <Link href="/apply">
                      <button className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-300">
                        Apply Now →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes blob {
              0%, 100% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
            }
            .animate-blob {
              animation: blob 7s infinite;
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
          `}</style>
        </section>

        {/* BENEFITS SECTION */}
        <section className="py-24 px-6 bg-white relative overflow-hidden" id="benefits">

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <span className="text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Why Choose Us</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent mb-4">Why professionals choose Urbance</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Designed for professionals who demand the best tools, fair treatment, and unlimited earning potential</p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: '📈',
                  title: 'Steady Customer Flow',
                  description: 'Automated booking system and real-time job notifications keep your schedule full.',
                  highlight: 'Never worry about finding work',
                  color: 'from-indigo-500 to-blue-600',
                },
                {
                  icon: '💰',
                  title: 'Fast, Secure Payments',
                  description: 'Instant payouts after every job with transparent invoicing.',
                  highlight: 'Earn and withdraw instantly',
                  color: 'from-emerald-500 to-green-600',
                },
                {
                  icon: '📱',
                  title: 'Smart Tools',
                  description: 'Professional dashboard for scheduling and earnings tracking at your fingertips.',
                  highlight: 'Work smarter, not harder',
                  color: 'from-violet-500 to-purple-600',
                },
                {
                  icon: '👥',
                  title: 'Community & Growth',
                  description: 'Connect with thousands of professionals, share tips, and grow together.',
                  highlight: 'Build your network',
                  color: 'from-pink-500 to-rose-600',
                },
                {
                  icon: '⏰',
                  title: 'Flexible Schedule',
                  description: 'Choose when, where, and how much you work. You\'re always in control.',
                  highlight: 'Set your own rules',
                  color: 'from-orange-500 to-amber-600',
                },
                {
                  icon: '🚀',
                  title: 'Growth & Support',
                  description: 'Free training, certifications, and dedicated support to grow your business.',
                  highlight: 'Scale without limits',
                  color: 'from-cyan-500 to-blue-600',
                },
              ].map((benefit, index) => {
                const { ref, isVisible } = useScrollReveal();
                return (
                <div
                  key={benefit.title}
                  ref={ref}
                  className="group relative"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                    transitionDelay: isVisible ? `${index * 100}ms` : undefined,
                  }}
                >
                  {/* Card background with gradient border */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} rounded-2xl opacity-0 group-hover:opacity-30 blur transition-all duration-300`}></div>
                  
                  {/* Card */}
                  <div className="relative bg-white border border-gray-200 rounded-2xl p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-white h-full">
                    {/* Top accent */}
                    <div className={`absolute top-0 left-0 w-1 h-12 bg-gradient-to-b ${benefit.color} rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>

                    {/* Icon */}
                    <div className="text-5xl mb-6 transform group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                      {benefit.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-emerald-500 transition-all duration-300">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {benefit.description}
                    </p>

                    {/* Highlight badge */}
                    <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${benefit.color} bg-opacity-15 border border-gray-300 group-hover:border-gray-400 transition-all duration-300`}>
                      <p className="text-xs font-semibold text-gray-700">
                        ✨ {benefit.highlight}
                      </p>
                    </div>
                  </div>
                </div>
                );
              })}
            </div>

            {/* CTA Section */}
            <div className="mt-20 text-center">
              <p className="text-gray-600 mb-6">Join thousands of professionals earning on their terms</p>
              <Link href="/apply">
                <button className="px-8 py-4 bg-gradient-to-r from-[#2F80ED] to-cyan-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105">
                  Start Earning Today
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* SERVICES SHOWCASE SECTION */}
        <section className="py-24 px-6 bg-white relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Services We Offer</h2>
              <p className="text-lg text-gray-600">Professional services for every need</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { emoji: '🧹', service: 'Cleaning', color: 'from-blue-100 to-blue-200' },
                { emoji: '🔧', service: 'Handyman', color: 'from-orange-100 to-orange-200' },
                { emoji: '🚰', service: 'Plumbing', color: 'from-cyan-100 to-cyan-200' },
                { emoji: '⚡', service: 'Electrical', color: 'from-yellow-100 to-yellow-200' },
                { emoji: '💅', service: 'Beauty', color: 'from-pink-100 to-pink-200' },
                { emoji: '🏠', service: 'Renovation', color: 'from-green-100 to-green-200' },
                { emoji: '🌳', service: 'Landscaping', color: 'from-emerald-100 to-emerald-200' },
                { emoji: '🎨', service: 'Painting', color: 'from-purple-100 to-purple-200' },
                { emoji: '🔐', service: 'Security', color: 'from-red-100 to-red-200' },
                { emoji: '📦', service: 'Moving', color: 'from-indigo-100 to-indigo-200' },
                { emoji: '🚗', service: 'Auto', color: 'from-slate-100 to-slate-200' },
                { emoji: '🎯', service: 'More...', color: 'from-violet-100 to-violet-200' },
              ].map((item, idx) => {
                const { ref, isVisible } = useScrollReveal();
                return (
                <div
                  key={item.service}
                  ref={ref}
                  className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br cursor-pointer hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  style={{
                    backgroundImage: `linear-gradient(to bottom right, rgb(${item.color === 'from-blue-100 to-blue-200' ? '219 234 254' : item.color === 'from-orange-100 to-orange-200' ? '254 230 201' : item.color === 'from-cyan-100 to-cyan-200' ? '207 250 254' : item.color === 'from-yellow-100 to-yellow-200' ? '254 243 199' : item.color === 'from-pink-100 to-pink-200' ? '252 231 243' : item.color === 'from-green-100 to-green-200' ? '220 252 231' : item.color === 'from-emerald-100 to-emerald-200' ? '209 250 229' : item.color === 'from-purple-100 to-purple-200' ? '243 232 255' : item.color === 'from-red-100 to-red-200' ? '254 226 226' : item.color === 'from-indigo-100 to-indigo-200' ? '224 242 254' : item.color === 'from-slate-100 to-slate-200' ? '241 245 249' : '237 233 254'}))`,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                    transitionDelay: isVisible ? `${idx * 50}ms` : undefined,
                  }}
                >
                  <div className="text-5xl mb-3 transform group-hover:scale-125 transition-transform duration-300">
                    {item.emoji}
                  </div>
                  <p className="text-sm font-bold text-gray-800 text-center group-hover:text-gray-900">{item.service}</p>
                </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* REQUIREMENTS SECTION */}
        <section className="py-32 px-6 bg-white relative overflow-hidden" id="requirements">
          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-20">
              <div className="inline-block mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Join Our Community</span>
              </div>
              <h2 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent mb-6">Requirements to join</h2>
              <p className="text-xl text-gray-700 max-w-2xl mx-auto">We maintain high standards to ensure quality service for our customers</p>
            </div>

            {/* Requirements Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: '👤',
                  number: '01',
                  title: 'Basic Requirements',
                  description: 'Essential qualifications every professional must have',
                  items: ['19+ years old', 'Legal right to work in Canada', 'Government-issued ID', 'Valid phone and email'],
                  color: 'from-blue-500 to-cyan-500',
                },
                {
                  icon: '🔧',
                  number: '02',
                  title: 'Professional Qualifications',
                  description: 'Skills and certifications for your service category',
                  items: ['2+ years experience', 'Trade certifications', 'Liability insurance', 'Professional tools & equipment'],
                  color: 'from-purple-500 to-pink-500',
                },
                {
                  icon: '✅',
                  number: '03',
                  title: 'Verification Process',
                  description: 'Our streamlined approval process',
                  items: ['Background check', 'Reference verification', 'Skills assessment', 'Quick onboarding training'],
                  color: 'from-emerald-500 to-cyan-500',
                },
              ].map((category, idx) => {
                const { ref, isVisible } = useScrollReveal();
                return (
                <div 
                  key={category.title} 
                  ref={ref}
                  className="group relative"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                    transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                    transitionDelay: isVisible ? `${idx * 100}ms` : undefined,
                  }}
                >
                  {/* Glow effect */}
                  <div className={`absolute -inset-1 bg-gradient-to-br ${category.color} rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-500`}></div>
                  
                  {/* Card */}
                  <div className="relative bg-white border border-gray-200 rounded-2xl p-8 hover:border-gray-300 hover:shadow-lg transition-all duration-300 h-full overflow-hidden">
                    {/* Top gradient accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${category.color}`}></div>

                    {/* Number badge */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="text-5xl">{category.icon}</div>
                      <span className={`text-4xl font-bold bg-gradient-to-br ${category.color} bg-clip-text text-transparent opacity-20`}>{category.number}</span>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-cyan-600 transition-all duration-300">
                      {category.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-6">{category.description}</p>

                    {/* Items list */}
                    <ul className="space-y-3">
                      {category.items.map((item, itemIdx) => (
                        <li key={item} className="flex items-start gap-3 text-gray-700 text-sm group/item">
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center mt-0.5 group-hover/item:scale-110 transition-transform`}>
                            <span className="text-xs text-white font-bold">✓</span>
                          </div>
                          <span className="group-hover/item:text-gray-900 transition-colors">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                );
              })}
            </div>

            {/* Quick Facts Section */}
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-12 mb-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { stat: '5 mins', label: 'Quick Application' },
                  { stat: '3-5 days', label: 'Verification Time' },
                  { stat: '500+', label: 'Active Professionals' },
                ].map((fact) => (
                  <div key={fact.label} className="text-center">
                    <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                      {fact.stat}
                    </div>
                    <p className="text-gray-400 text-sm">{fact.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="text-center">
              <p className="text-gray-300 mb-6 text-lg">Ready to start? Join thousands of professionals earning on their terms.</p>
              <Link href="/apply">
                <button className="px-10 py-4 bg-gradient-to-r from-[#2F80ED] to-cyan-500 text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2">
                  Begin Your Application
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION - REDESIGNED */}
        <section className="py-32 px-6 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 left-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg">
                <span className="text-white text-sm font-bold">⚡</span>
                <span className="text-white text-xs font-bold uppercase tracking-wider">Your Journey Starts Here</span>
              </div>
              <h2 className="text-6xl md:text-7xl font-black mb-6 leading-tight">
                <span className="text-gray-900">From application to</span>
                <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">
                  earning in days
                </span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A streamlined onboarding process designed to get you working fast
              </p>
            </div>

            {/* Timeline Container */}
            <div className="relative">
              {/* Vertical connecting line for mobile */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full lg:hidden"></div>
              
              {/* Horizontal connecting line for desktop */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transform -translate-y-1/2"></div>

              {/* Steps */}
              <div className="space-y-12 lg:space-y-0 lg:grid lg:grid-cols-4 lg:gap-8">
                {[
                  {
                    number: 1,
                    icon: '📝',
                    title: 'Quick Apply',
                    description: 'Fill out our simple online form with your professional details',
                    time: '10 minutes',
                    color: 'blue',
                    gradient: 'from-blue-500 to-blue-600',
                    bgColor: 'bg-blue-500',
                    features: [
                      'Basic information',
                      'Work experience',
                      'Service offerings',
                      'Availability schedule'
                    ],
                    delay: '0ms'
                  },
                  {
                    number: 2,
                    icon: '🔍',
                    title: 'Get Verified',
                    description: 'We conduct thorough background checks and credential verification',
                    time: '3-5 days',
                    color: 'purple',
                    gradient: 'from-purple-500 to-purple-600',
                    bgColor: 'bg-purple-500',
                    features: [
                      'ID verification',
                      'Background check',
                      'Reference validation',
                      'License confirmation'
                    ],
                    delay: '150ms'
                  },
                  {
                    number: 3,
                    icon: '🎯',
                    title: 'Get Trained',
                    description: 'Complete our comprehensive platform training and best practices',
                    time: '2 hours',
                    color: 'pink',
                    gradient: 'from-pink-500 to-pink-600',
                    bgColor: 'bg-pink-500',
                    features: [
                      'Platform walkthrough',
                      'Job acceptance flow',
                      'Customer communication',
                      'Payment system'
                    ],
                    delay: '300ms'
                  },
                  {
                    number: 4,
                    icon: '🚀',
                    title: 'Start Earning',
                    description: 'Accept jobs, serve customers, and receive instant payments',
                    time: 'Immediate',
                    color: 'emerald',
                    gradient: 'from-emerald-500 to-emerald-600',
                    bgColor: 'bg-emerald-500',
                    features: [
                      'Real-time job alerts',
                      'Flexible scheduling',
                      'Same-day payouts',
                      '24/7 support'
                    ],
                    delay: '450ms'
                  }
                ].map((step, idx) => {
                  const { ref, isVisible } = useScrollReveal();
                  return (
                    <div
                      key={step.number}
                      ref={ref}
                      className="relative pl-20 lg:pl-0"
                      style={{
                        opacity: isVisible ? 1 : 0,
                        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                        transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
                        transitionDelay: isVisible ? step.delay : undefined,
                      }}
                    >
                      {/* Timeline dot */}
                      <div className={`absolute left-0 lg:left-1/2 lg:top-0 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center shadow-xl z-10 border-4 border-white`}>
                        <span className="text-3xl">{step.icon}</span>
                      </div>

                      {/* Arrow connector for desktop */}
                      {idx < 3 && (
                        <div className="hidden lg:block absolute top-0 left-full w-full h-1 pointer-events-none">
                          <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
                            <div className={`w-3 h-3 ${step.bgColor} rotate-45 transform translate-x-1`}></div>
                          </div>
                        </div>
                      )}

                      {/* Card */}
                      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-gray-300 mt-8 lg:mt-16">
                        {/* Header with gradient */}
                        <div className={`bg-gradient-to-r ${step.gradient} p-6 text-white`}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="text-sm font-bold opacity-80 mb-1">STEP {step.number}</div>
                              <h3 className="text-2xl font-black">{step.title}</h3>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold">
                              ⏱ {step.time}
                            </div>
                          </div>
                          <p className="text-sm leading-relaxed opacity-95">
                            {step.description}
                          </p>
                        </div>

                        {/* Features list */}
                        <div className="p-6">
                          <div className="space-y-3">
                            {step.features.map((feature, featureIdx) => (
                              <div 
                                key={feature}
                                className="flex items-center gap-3 group/item"
                              >
                                <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${step.gradient} flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform`}>
                                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="text-gray-700 text-sm font-medium group-hover/item:text-gray-900 transition-colors">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom accent */}
                        <div className={`h-1 bg-gradient-to-r ${step.gradient} transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats Banner */}
            <div className="mt-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white text-center">
                <div className="space-y-2">
                  <div className="text-5xl font-black">10 min</div>
                  <div className="text-sm font-medium opacity-90">Average application time</div>
                </div>
                <div className="space-y-2 border-l border-r border-white/20 md:border-l md:border-r">
                  <div className="text-5xl font-black">3-5 days</div>
                  <div className="text-sm font-medium opacity-90">To full approval</div>
                </div>
                <div className="space-y-2">
                  <div className="text-5xl font-black">98%</div>
                  <div className="text-sm font-medium opacity-90">Successful completion rate</div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center mt-20">
              <div className="mb-6">
                <p className="text-2xl font-bold text-gray-900 mb-2">Ready to get started?</p>
                <p className="text-gray-600">Join thousands of professionals earning more with Urbance</p>
              </div>
              <Link href="/apply">
                <button className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3">
                  <span>Begin Your Journey</span>
                  <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* SUCCESS STORIES SECTION - REDESIGNED */}
        <section className="py-20 px-6 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full">
                <span className="text-white text-sm font-bold">⭐</span>
                <span className="text-white text-xs font-bold uppercase tracking-wider">Trusted By Thousands</span>
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-3">
                Real people, <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">real success</span>
              </h2>
              <p className="text-lg text-gray-600">See what professionals are saying about Urbance</p>
            </div>

            {/* Auto-scrolling testimonials */}
            <div className="relative">
              {/* Gradient overlays */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
              
              {/* Scrolling container */}
              <div className="overflow-hidden">
                <div className="flex gap-6 animate-scroll-left hover:pause">
                  {[
                    {
                      name: 'James M.',
                      role: 'Handyman',
                      location: 'Vancouver',
                      avatar: '👨‍🔧',
                      revenue: '$12.5K/mo',
                      rating: 5,
                      quote: 'Urbance doubled my income in 3 months. Best decision ever!',
                      color: 'from-blue-500 to-cyan-500'
                    },
                    {
                      name: 'Sarah C.',
                      role: 'House Cleaner',
                      location: 'Burnaby',
                      avatar: '👩‍🔧',
                      revenue: '$9.2K/mo',
                      rating: 5,
                      quote: 'Perfect for working around my kids schedule. Love the flexibility.',
                      color: 'from-purple-500 to-pink-500'
                    },
                    {
                      name: 'Mike T.',
                      role: 'Electrician',
                      location: 'Surrey',
                      avatar: '⚡',
                      revenue: '$15.8K/mo',
                      rating: 5,
                      quote: 'No more hunting for clients. Urbance brings work to me.',
                      color: 'from-emerald-500 to-teal-500'
                    },
                    {
                      name: 'Lisa R.',
                      role: 'Plumber',
                      location: 'Richmond',
                      avatar: '🔧',
                      revenue: '$11.3K/mo',
                      rating: 5,
                      quote: 'Same day payouts changed everything. Finally consistent income!',
                      color: 'from-orange-500 to-red-500'
                    },
                    {
                      name: 'David K.',
                      role: 'Landscaper',
                      location: 'Coquitlam',
                      avatar: '🌱',
                      revenue: '$13.7K/mo',
                      rating: 5,
                      quote: 'The job quality is amazing. Professional clients every time.',
                      color: 'from-green-500 to-emerald-500'
                    },
                    {
                      name: 'Emma L.',
                      role: 'Painter',
                      location: 'New West',
                      avatar: '🎨',
                      revenue: '$10.5K/mo',
                      rating: 5,
                      quote: 'Support team is incredible. They have my back always.',
                      color: 'from-pink-500 to-rose-500'
                    },
                    // Duplicate for seamless loop
                    {
                      name: 'James M.',
                      role: 'Handyman',
                      location: 'Vancouver',
                      avatar: '👨‍🔧',
                      revenue: '$12.5K/mo',
                      rating: 5,
                      quote: 'Urbance doubled my income in 3 months. Best decision ever!',
                      color: 'from-blue-500 to-cyan-500'
                    },
                    {
                      name: 'Sarah C.',
                      role: 'House Cleaner',
                      location: 'Burnaby',
                      avatar: '👩‍🔧',
                      revenue: '$9.2K/mo',
                      rating: 5,
                      quote: 'Perfect for working around my kids schedule. Love the flexibility.',
                      color: 'from-purple-500 to-pink-500'
                    },
                    {
                      name: 'Mike T.',
                      role: 'Electrician',
                      location: 'Surrey',
                      avatar: '⚡',
                      revenue: '$15.8K/mo',
                      rating: 5,
                      quote: 'No more hunting for clients. Urbance brings work to me.',
                      color: 'from-emerald-500 to-teal-500'
                    },
                  ].map((testimonial, idx) => (
                    <div
                      key={`${testimonial.name}-${idx}`}
                      className="flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 overflow-hidden group"
                    >
                      {/* Gradient header */}
                      <div className={`h-2 bg-gradient-to-r ${testimonial.color}`}></div>
                      
                      <div className="p-6">
                        {/* Avatar and info */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-2xl shadow-lg`}>
                            {testimonial.avatar}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                            <p className="text-sm text-gray-600">{testimonial.role}</p>
                            <p className="text-xs text-gray-500">📍 {testimonial.location}</p>
                          </div>
                        </div>

                        {/* Quote */}
                        <p className="text-gray-700 text-sm mb-4 leading-relaxed italic">
                          "{testimonial.quote}"
                        </p>

                        {/* Stats */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div>
                            <div className={`text-lg font-black bg-gradient-to-r ${testimonial.color} bg-clip-text text-transparent`}>
                              {testimonial.revenue}
                            </div>
                            <div className="text-xs text-gray-500">Monthly Earnings</div>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[...Array(testimonial.rating)].map((_, i) => (
                              <svg key={i} className="w-5 h-5 fill-yellow-400" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { number: '5,000+', label: 'Active Professionals', icon: '👥' },
                { number: '4.9/5', label: 'Average Rating', icon: '⭐' },
                { number: '$2.5M+', label: 'Paid Out Monthly', icon: '💰' },
                { number: '98%', label: 'Satisfaction Rate', icon: '✓' },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-6 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl font-black text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Add animation keyframes in global styles */}
          <style jsx>{`
            @keyframes scroll-left {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            .animate-scroll-left {
              animation: scroll-left 40s linear infinite;
            }

            .animate-scroll-left:hover {
              animation-play-state: paused;
            }
          `}</style>
        </section>

        {/* APPLICATION CTA SECTION - REDESIGNED */}
        <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 mb-6 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <span className="text-white text-sm font-bold">🚀</span>
              <span className="text-white text-xs font-bold uppercase tracking-wider">Ready to Get Started?</span>
            </div>

            {/* Heading */}
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
              Start your application today
            </h2>
            
            {/* Description */}
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
              Join thousands of professionals earning more with Urbance. Takes less than 10 minutes to complete.
            </p>

            {/* CTA Button */}
            <Link href="/apply">
              <button className="group relative px-12 py-6 bg-white text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 font-black text-xl rounded-2xl hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-4 overflow-hidden animate-pulse-glow">
                <span className="absolute inset-0 bg-white"></span>
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 animate-pulse"></span>
                <span className="relative bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Start Your Application Today
                </span>
                <svg className="relative w-6 h-6 text-blue-600 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </Link>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-white/80 text-sm">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No upfront costs</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Quick verification</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Start earning fast</span>
              </div>
            </div>
          </div>

          {/* Add custom animation styles */}
          <style jsx>{`
            @keyframes pulse-glow {
              0%, 100% {
                box-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3);
              }
              50% {
                box-shadow: 0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 255, 255, 0.5);
              }
            }

            .animate-pulse-glow {
              animation: pulse-glow 2s ease-in-out infinite;
            }
          `}</style>
        </section>

        {/* FAQ SECTION - REDESIGNED */}
        <section className="py-16 px-6 bg-white">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                <span className="text-white text-sm font-bold">💬</span>
                <span className="text-white text-xs font-bold uppercase tracking-wider">Got Questions?</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
                Everything you <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">need to know</span>
              </h2>
              <p className="text-lg text-gray-600">
                Quick answers to common questions about joining Urbance
              </p>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4 mb-12">
              {[
                {
                  question: 'How long does the application process take?',
                  answer: 'The application form takes about 10 minutes to complete. Once submitted, verification typically takes 3-5 business days. You\'ll receive updates via email throughout the process.',
                },
                {
                  question: 'What are the costs to join?',
                  answer: 'There are absolutely no upfront costs or monthly fees. We only charge a 15% platform fee on completed jobs. You only pay when you earn.',
                },
                {
                  question: 'How and when do I get paid?',
                  answer: 'You get paid via direct deposit within 24 hours of job completion. No waiting weeks for your money - we believe in fast, fair payments.',
                },
                {
                  question: 'Do I need my own insurance?',
                  answer: 'We strongly recommend having your own insurance. However, we can connect you with partner insurers who offer competitive rates for service professionals.',
                },
                {
                  question: 'What is the platform fee?',
                  answer: 'We charge 15% of the job total. This covers marketing, customer support, payment processing, background checks, and all platform services.',
                },
                {
                  question: 'Can I set my own pricing?',
                  answer: 'Absolutely! You set your hourly or flat rates based on your experience, skills, and local market conditions. You\'re in control of your earnings.',
                },
                {
                  question: 'How do I receive job requests?',
                  answer: 'You\'ll receive instant notifications via SMS and email when new jobs match your skills and service area. Accept jobs with a single tap.',
                },
                {
                  question: 'Can I choose which jobs to accept?',
                  answer: 'Yes! You have complete control. Review job details, customer ratings, and payment before accepting. No pressure, no obligations.',
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className="group bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-300"
                >
                  <summary className="cursor-pointer px-6 py-4 font-bold text-gray-900 text-lg flex items-center justify-between list-none">
                    <span className="group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all">
                      {faq.question}
                    </span>
                    <svg className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </summary>
                  <div className="px-6 pb-4 pt-2 text-gray-600 leading-relaxed border-t border-gray-100">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>

            {/* Still have questions */}
            <div className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Still have questions?</h3>
              <p className="text-gray-600 mb-5">Our support team is here to help you get started</p>
              <a href="mailto:support@urbance.ca">
                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Contact Support
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
