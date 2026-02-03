'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { RevealStagger, RevealItem } from '@/components/RevealStagger';

interface Story {
  id: number;
  name: string;
  service: string;
  location: string;
  image: string;
  quote: string;
  earnings: string;
  timeframe: string;
  rating: number;
  jobs: number;
  category: string;
}

export default function SuccessStories() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const stories = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      service: 'House Cleaning',
      location: 'Vancouver, BC',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=b6e3f4',
      quote: "Joining Urbance was the best decision I ever made. I went from struggling to pay bills to earning enough to support my family and save for the future.",
      earnings: '$5,200/month',
      timeframe: '6 months',
      rating: 4.9,
      jobs: 142,
      category: 'home',
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      service: 'Plumbing',
      location: 'Vancouver, BC',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=c0aede',
      quote: "I was working for a company making $3,500/month. Now I'm my own boss, set my own hours, and make double that. The freedom is incredible.",
      earnings: '$7,800/month',
      timeframe: '1 year',
      rating: 5.0,
      jobs: 238,
      category: 'trades',
    },
    {
      id: 3,
      name: 'Jennifer Chen',
      service: 'Personal Training',
      location: 'Surrey, BC',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer&backgroundColor=ffd5dc',
      quote: "The platform gave me everything I needed to grow my business. The clients are amazing, the support is top-notch, and I'm making more than I ever thought possible.",
      earnings: '$6,400/month',
      timeframe: '8 months',
      rating: 4.8,
      jobs: 186,
      category: 'wellness',
    },
    {
      id: 4,
      name: 'David Rodriguez',
      service: 'Electrical Work',
      location: 'Burnaby, BC',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=ffdfbf',
      quote: "From day one, I knew this was different. Quality customers, fair pay, and a team that actually cares about my success. I've never looked back.",
      earnings: '$8,900/month',
      timeframe: '2 years',
      rating: 5.0,
      jobs: 412,
      category: 'trades',
    },
    {
      id: 5,
      name: 'Amanda Foster',
      service: 'Interior Design',
      location: 'Richmond, BC',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda&backgroundColor=d1d4f9',
      quote: "I started part-time while working another job. Within 6 months, I was making enough to quit and go full-time. Now I'm living my dream every day.",
      earnings: '$7,200/month',
      timeframe: '10 months',
      rating: 4.9,
      jobs: 203,
      category: 'home',
    },
    {
      id: 6,
      name: 'James Park',
      service: 'HVAC Services',
      location: 'Coquitlam, BC',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=c7f0bd',
      quote: "The transparency is what sold me. I see exactly what I'm making, when I'm getting paid, and the clients are always respectful. This is what work should be.",
      earnings: '$9,500/month',
      timeframe: '1.5 years',
      rating: 5.0,
      jobs: 327,
      category: 'trades',
    },
    {
      id: 7,
      name: 'Rachel Thompson',
      service: 'Landscaping',
      location: 'Victoria, BC',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rachel&backgroundColor=fff0cf',
      quote: "I turned my passion into profit. Urbance gave me the platform to reach clients who appreciate quality work and are willing to pay for it.",
      earnings: '$6,800/month',
      timeframe: '9 months',
      rating: 4.9,
      jobs: 176,
      category: 'home',
    },
    {
      id: 8,
      name: 'Michael Brown',
      service: 'Handyman',
      location: 'Langley, BC',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=b4e7ce',
      quote: "Best platform I've ever worked with. The jobs are consistent, the pay is great, and I finally feel valued for my skills and experience.",
      earnings: '$5,900/month',
      timeframe: '7 months',
      rating: 4.8,
      jobs: 164,
      category: 'trades',
    },
    {
      id: 9,
      name: 'Lisa Anderson',
      service: 'Massage Therapy',
      location: 'Halifax, NS',
      image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa&backgroundColor=ffc9c9',
      quote: "Working through Urbance has transformed my life. I control my schedule, choose my clients, and earn more than I ever did at a spa.",
      earnings: '$5,600/month',
      timeframe: '5 months',
      rating: 5.0,
      jobs: 128,
      category: 'wellness',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Stories', icon: '🌟' },
    { id: 'home', label: 'Home Services', icon: '🏠' },
    { id: 'trades', label: 'Trades', icon: '🔧' },
    { id: 'wellness', label: 'Wellness', icon: '💆' },
  ];

  const filteredStories = selectedCategory === 'all' 
    ? stories 
    : stories.filter(story => story.category === selectedCategory);

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
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-6 py-24 relative z-10 w-full">
            <div className="text-center max-w-5xl mx-auto space-y-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm border border-white/10 rounded-full">
                <span className="text-3xl">⭐</span>
                <span className="text-white text-sm font-semibold">Real People • Real Success</span>
              </div>

              {/* Main Headline */}
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1]">
                  Their Stories,
                  <br />
                  <span className="relative inline-block">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
                      Your Inspiration
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
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Meet the professionals who transformed their lives and businesses through Urbance. These are real people with real results.
                </p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">1,200+</div>
                  <div className="text-gray-300 mt-2 font-medium">Success Stories</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="text-4xl font-black bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">$7.2K</div>
                  <div className="text-gray-300 mt-2 font-medium">Average Monthly Income</div>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                  <div className="text-4xl font-black bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">4.9⭐</div>
                  <div className="text-gray-300 mt-2 font-medium">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CATEGORY FILTERS */}
        <section className="py-8 px-6 bg-white border-b border-gray-200 sticky top-20 z-30">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span>{category.label}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* SUCCESS STORIES GRID */}
        <StoriesSection stories={filteredStories} />

        {/* CTA SECTION */}
        <section className="relative py-16 px-6 overflow-hidden bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Your Success Story Starts Here
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Join these amazing professionals and start building the life and income you deserve.
            </p>
            <button className="px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-lg font-bold rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 animate-pulse">
              Apply Now - Write Your Story
            </button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// Stories Section Component - Timeline with Center Line
function StoriesSection({ stories }: { stories: Story[] }) {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="relative py-32 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Results Counter */}
        <div 
          className="text-center mb-20"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
          }}
        >
          <p className="text-gray-600 text-lg">
            Showing <span className="font-bold text-purple-600">{stories.length}</span> inspiring {stories.length === 1 ? 'story' : 'stories'}
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative">
          {/* Center Vertical Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-200 via-pink-200 to-rose-200 transform -translate-x-1/2 hidden lg:block"></div>

          {/* Cards with Apple-style reveal - Alternating left and right */}
          <RevealStagger className="space-y-24">
            {stories.map((story, index) => {
              // Different color gradients for each number
              const colorGradients = [
                { from: 'from-blue-500', to: 'to-cyan-500' },      // 1
                { from: 'from-purple-500', to: 'to-pink-500' },    // 2
                { from: 'from-emerald-500', to: 'to-teal-500' },   // 3
                { from: 'from-orange-500', to: 'to-red-500' },     // 4
                { from: 'from-indigo-500', to: 'to-purple-500' },  // 5
                { from: 'from-cyan-500', to: 'to-blue-500' },      // 6
                { from: 'from-pink-500', to: 'to-rose-500' },      // 7
                { from: 'from-teal-500', to: 'to-emerald-500' },   // 8
                { from: 'from-violet-500', to: 'to-fuchsia-500' }, // 9
              ];
              const gradient = colorGradients[index];

              return (
                <RevealItem key={story.id}>
                  <div className={`lg:grid lg:grid-cols-2 gap-16 items-center ${index % 2 === 0 ? 'lg:text-left' : 'lg:text-right'}`}>
                    {/* Card Container */}
                    <div className={index % 2 === 0 ? '' : 'lg:order-2'}>
                      <StoryCard story={story} index={index} />
                    </div>

                    {/* Number Visual - Opposite side from card */}
                    <div className={`relative group ${index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'} hidden lg:block`}>
                      <div className="relative">
                        {/* Glow layers */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient.from} ${gradient.to} rounded-full blur-3xl opacity-20 scale-150 group-hover:scale-175 transition-transform duration-500`}></div>
                        <div className={`absolute inset-0 bg-gradient-to-br ${gradient.from} ${gradient.to} rounded-full blur-2xl opacity-30 scale-125 group-hover:scale-150 transition-transform duration-500`}></div>
                        
                        {/* Main Number with 3D effect */}
                        <div className="relative">
                          <div className={`text-[12rem] lg:text-[14rem] font-black leading-none bg-gradient-to-br ${gradient.from} ${gradient.to} bg-clip-text text-transparent transform group-hover:scale-110 transition-all duration-300 select-none`}
                            style={{
                              textShadow: '0 10px 30px rgba(0,0,0,0.2)',
                              WebkitTextStroke: '2px transparent',
                              paintOrder: 'stroke fill',
                            }}>
                            {index + 1}
                          </div>
                          
                          {/* Floating decorative dots */}
                          <div className={`absolute top-1/4 -right-8 w-4 h-4 bg-gradient-to-br ${gradient.from} ${gradient.to} rounded-full opacity-60 animate-bounce`} style={{ animationDelay: '0s', animationDuration: '2s' }}></div>
                          <div className={`absolute bottom-1/4 -left-8 w-3 h-3 bg-gradient-to-br ${gradient.from} ${gradient.to} rounded-full opacity-50 animate-bounce`} style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}></div>
                          <div className={`absolute top-1/2 right-0 w-2 h-2 bg-gradient-to-br ${gradient.from} ${gradient.to} rounded-full opacity-40 animate-bounce`} style={{ animationDelay: '1s', animationDuration: '3s' }}></div>
                        </div>
                      </div>
                      
                      {/* Timeline Dot */}
                      <div className={`absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br ${gradient.from} ${gradient.to} rounded-full shadow-lg border-4 border-white animate-pulse`} style={{
                        [index % 2 === 0 ? 'left' : 'right']: '-4rem'
                      }}></div>
                    </div>
                  </div>
                </RevealItem>
              );
            })}
          </RevealStagger>
        </div>
      </div>
    </section>
  );
}

// Story Card Component
function StoryCard({ story, index }: { story: Story; index: number }) {
  return (
    <div className="group relative">
      {/* Main Card Container */}
      <div className="relative bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-blue-100/20 to-cyan-100/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

        {/* Content Container */}
        <div className="relative">
          {/* Header Section with Avatar & Badge */}
          <div className="relative px-8 pt-8 pb-6">
            <div className="flex items-start gap-6">
              {/* Large Avatar with Decorative Ring */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-pink-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <div className="relative w-24 h-24 rounded-3xl overflow-hidden ring-4 ring-white shadow-xl">
                  <img src={story.image} alt={story.name} className="w-full h-full object-cover" />
                </div>
                {/* Verified Badge - Larger */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center ring-4 ring-white shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Name & Info */}
              <div className="flex-1 min-w-0 pt-2">
                <h3 className="text-3xl font-black text-gray-900 mb-2 leading-tight">{story.name}</h3>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-3">
                  <span className="text-sm font-bold text-purple-700">{story.service}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>{story.location}</span>
                </div>
              </div>

              {/* Rating Badge - Floating Style */}
              <div className="flex-shrink-0">
                <div className="relative group/rating">
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-md opacity-30 group-hover/rating:opacity-50 transition-opacity"></div>
                  <div className="relative px-5 py-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200 shadow-lg">
                    <div className="flex flex-col items-center">
                      <svg className="w-7 h-7 text-amber-500 mb-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-xl font-black text-gray-900">{story.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quote Section with Creative Design */}
          <div className="px-8 py-6">
            <div className="relative bg-gradient-to-br from-gray-50 to-white backdrop-blur-sm rounded-3xl p-6 border border-gray-100">
              {/* Large Quote Mark */}
              <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl text-white font-serif">"</span>
              </div>
              
              <p className="text-gray-700 text-lg leading-relaxed pt-2">
                {story.quote}
              </p>
            </div>
          </div>

          {/* Stats Section - Creative Layout */}
          <div className="px-8 pb-8">
            <div className="grid grid-cols-3 gap-4">
              {/* Monthly Earnings */}
              <div className="relative group/stat overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-md opacity-10 group-hover/stat:opacity-30 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border-2 border-purple-200 hover:border-purple-300 transition-all">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <span className="text-2xl">💰</span>
                    </div>
                    <div className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
                      {story.earnings}
                    </div>
                    <div className="text-xs text-gray-600 font-bold uppercase tracking-wider">Monthly</div>
                  </div>
                </div>
              </div>

              {/* Jobs Completed */}
              <div className="relative group/stat overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl blur-md opacity-10 group-hover/stat:opacity-30 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border-2 border-blue-200 hover:border-blue-300 transition-all">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <span className="text-2xl">✅</span>
                    </div>
                    <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                      {story.jobs}
                    </div>
                    <div className="text-xs text-gray-600 font-bold uppercase tracking-wider">Jobs Done</div>
                  </div>
                </div>
              </div>

              {/* Time on Platform */}
              <div className="relative group/stat overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl blur-md opacity-10 group-hover/stat:opacity-30 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border-2 border-emerald-200 hover:border-emerald-300 transition-all">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <div className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                      {story.timeframe}
                    </div>
                    <div className="text-xs text-gray-600 font-bold uppercase tracking-wider">Journey</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Accent Bar with Pattern */}
        <div className="h-2 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
}
