'use client';

import { useState, useMemo } from 'react';
import { Metadata } from 'next';
import { AVAILABLE_SERVICES } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import Link from 'next/link';

export default function Services() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'home', 'trades', 'wellness'];

  const filteredServices = useMemo(() => {
    return AVAILABLE_SERVICES.filter((service) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = service.label.toLowerCase().includes(searchLower) ||
                           service.description.toLowerCase().includes(searchLower) ||
                           service.details.toLowerCase().includes(searchLower) ||
                           ('keywords' in service && service.keywords && service.keywords.some(keyword => keyword.toLowerCase().includes(searchLower)));
      
      if (selectedCategory === 'all') return matchesSearch;
      
      const homeServices = ['cleaning', 'landscaping', 'moving', 'window_cleaning', 'pest_control'];
      const tradeServices = ['handyman', 'plumbing', 'electrical', 'painting', 'flooring', 'hvac', 'roofing', 'carpentry', 'appliance_repair'];
      const wellnessServices = ['beauty', 'fitness'];
      
      if (selectedCategory === 'home') return homeServices.includes(service.key) && matchesSearch;
      if (selectedCategory === 'trades') return tradeServices.includes(service.key) && matchesSearch;
      if (selectedCategory === 'wellness') return wellnessServices.includes(service.key) && matchesSearch;
      
      return matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <>
      <div className="relative">
        <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 z-0"></div>
        <Navbar variant="dark" />
      </div>
      <main className="flex flex-col overflow-hidden">
        {/* HERO SECTION - Inspired by Home Page */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 -mt-20 pt-20">
          {/* Dynamic background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-emerald-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full">
            <div className="text-center max-w-5xl mx-auto space-y-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-white text-sm font-semibold">30+ Service Categories</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1]">
                  Professional Services
                  <br />
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                      Always Accepting
                    </span>
                    <svg className="absolute -bottom-2 left-0 w-full" height="12" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2 10C50 2 100 2 150 6C200 10 250 10 298 6" stroke="url(#gradient)" strokeWidth="3" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#60A5FA" />
                          <stop offset="50%" stopColor="#22D3EE" />
                          <stop offset="100%" stopColor="#10B981" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
                  We accept applications from skilled professionals across all service categories. Find your specialty and start earning today.
                </p>
              </div>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl blur opacity-75"></div>
                  <div className="relative flex items-center bg-white rounded-2xl shadow-2xl overflow-hidden">
                    <div className="pl-6 pr-4">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="Search services... (e.g., plumbing, cleaning, electrical)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 py-5 text-gray-900 placeholder-gray-500 focus:outline-none text-lg"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="px-4 text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    <Link href="/apply" className="m-2">
                      <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300">
                        Apply Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex items-center justify-center gap-3 flex-wrap pt-4">
                {[
                  { key: 'all', label: 'All Services', icon: '🏠' },
                  { key: 'home', label: 'Home Services', icon: '🧹' },
                  { key: 'trades', label: 'Trades', icon: '🔨' },
                  { key: 'wellness', label: 'Wellness', icon: '💆' },
                ].map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                      selectedCategory === cat.key
                        ? 'bg-white text-gray-900 shadow-xl scale-105'
                        : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                    }`}
                  >
                    <span className="mr-2">{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 max-w-3xl mx-auto">
                <div className="space-y-2">
                  <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">30+</div>
                  <div className="text-sm text-gray-400">Service Categories</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">$45-100</div>
                  <div className="text-sm text-gray-400">Average Hourly Rate</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">24/7</div>
                  <div className="text-sm text-gray-400">Applications Open</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES GRID */}
        <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Results count */}
            <div className="mb-8 text-center">
              <p className="text-gray-600 text-lg">
                Showing <span className="font-bold text-gray-900">{filteredServices.length}</span> service{filteredServices.length !== 1 ? 's' : ''}
                {searchQuery && <span> for "<span className="font-bold text-blue-600">{searchQuery}</span>"</span>}
              </p>
            </div>

            {filteredServices.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service, index) => (
                  <ServiceCard key={service.key} service={service} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No services found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                  }}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-emerald-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Don't See Your Service?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              We're constantly expanding our service categories. Apply anyway and tell us about your expertise—we'd love to grow with you.
            </p>

            <Link href="/apply">
              <button className="px-12 py-5 bg-white text-blue-600 font-black text-lg rounded-xl shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-3">
                <span>Apply Now - It's Free</span>
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
                <span>No fees to apply</span>
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

// Service Card Component
function ServiceCard({ service, index }: { service: typeof AVAILABLE_SERVICES[number]; index: number }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <div
      ref={ref}
      className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.8s ease-out ${index * 0.05}s, transform 0.8s ease-out ${index * 0.05}s`,
      }}
    >
      {/* Icon */}
      <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
        {service.icon}
      </div>

      {/* Title & Rate */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {service.label}
        </h3>
        <span className="px-3 py-1 bg-gradient-to-r from-emerald-100 to-cyan-100 text-emerald-700 text-sm font-bold rounded-full">
          {service.avgRate}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 mb-4 font-medium">{service.description}</p>

      {/* Details */}
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">{service.details}</p>

      {/* Benefits */}
      <div className="space-y-2 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Premium customer base</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Set your own schedule</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>Weekly payouts</span>
        </div>
      </div>

      {/* Read More Button */}
      <Link href={`/services/${service.key}`}>
        <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center gap-2">
          <span>Learn More</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </Link>
    </div>
  );
}
