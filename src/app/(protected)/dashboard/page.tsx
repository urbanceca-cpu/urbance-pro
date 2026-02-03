'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';
import type { Profile, ProviderApplication } from '@/lib/types';

export default function DashboardOverview() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [application, setApplication] = useState<ProviderApplication | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Check for demo session first (before auth attempt)
        const demoSession = localStorage.getItem('demo_session');
        const demoUser = localStorage.getItem('demo_user');
        
        if (demoSession && demoUser) {
          // Load demo mode
          const parsedDemoUser = JSON.parse(demoUser);
          setUser(parsedDemoUser);

          // Set up demo profile
          const demoProfile: Profile = {
            id: 'demo-user-id',
            role: 'provider',
            full_name: 'Test Provider',
            phone: '+1 (555) 123-4567',
            city: 'Vancouver, BC',
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setProfile(demoProfile);

          // Set up demo application
          const demoApplication: ProviderApplication = {
            id: 'demo-app-id',
            user_id: 'demo-user-id',
            full_name: 'Test Provider',
            email: 'testprovider@urbance.local',
            phone: '+1 (555) 123-4567',
            city: 'Vancouver, BC',
            services: ['plumbing', 'electrical'],
            experience_years: 5,
            availability: { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] },
            background_check_consent: true,
            insurance_status: 'active',
            notes: 'Demo provider for testing',
            status: 'submitted',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setApplication(demoApplication);
          setIsLoading(false);
          return;
        }

        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          router.push('/login');
          return;
        }

        setUser(authUser);

        // Load profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        }

        // Load application
        const { data: appData } = await supabase
          .from('provider_applications')
          .select('*')
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (appData) {
          setApplication(appData);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, [supabase, router]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
      active: 'success',
      pending: 'warning',
      suspended: 'error',
      approved: 'success',
      submitted: 'info',
      under_review: 'warning',
      rejected: 'error',
    };
    return colors[status] || 'default';
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const displayName = profile?.full_name || 'Provider';
  const nameForInitials = profile?.full_name || 'P';
  const initials = (nameForInitials?.[0] || 'P') + ((nameForInitials?.split(' ')[1]?.[0]) || 'S');
  const accountStatus = profile?.status || 'pending';
  const isApproved = accountStatus === 'active' || user?.id === 'demo-user-id'; // Demo user is treated as approved
  const userCity = profile?.city || 'Vancouver, BC';
  const userServices = application?.services || [];
  const experienceYears = application?.experience_years || 0;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar />
      
      <div className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 border-b border-blue-300 sticky top-0 z-10 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-xl"></div>
                <div className="relative w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center text-white font-bold text-xl shadow-xl">
                  {initials}
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-1 tracking-tight">
                  Welcome back, {displayName}!
                </h2>
                <p className="text-base text-white/90 font-medium">
                  {userServices.length > 0 
                    ? `${userServices.length} service${userServices.length > 1 ? 's' : ''} • ${userCity}` 
                    : `Ready to grow your business in ${userCity}`}
                </p>
              </div>
            </div>
            <Button 
              onClick={() => router.push('/dashboard/profile')} 
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold shadow-lg border-0"
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Status Alert */}
          {!isApproved && (
            <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">Profile Pending Review</h3>
                  <p className="text-sm text-gray-700 mb-3">
                    Your profile is being reviewed. Once approved, you'll be able to accept jobs on the platform.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => router.push('/apply')}>
                      Complete Profile
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => router.push('/dashboard/documents')}>
                      Upload Documents
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Account Status */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Account Status</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2 capitalize">
                      {accountStatus}
                    </h3>
                  </div>
                  <Badge variant={getStatusColor(accountStatus)} className="text-xs">
                    {accountStatus}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Active Jobs */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Active Jobs</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">0</h3>
                    <p className="text-xs text-gray-500 mt-1">Waiting to be approved</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Earnings */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">This Month</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">$0.00</h3>
                    <p className="text-xs text-gray-500 mt-1">Once approved</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Profile</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">85%</h3>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full w-[85%]"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Your Services */}
          {userServices.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Services</CardTitle>
                <CardDescription>Services you're registered to provide</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {userServices.map((service: string, index: number) => (
                    <div key={index} className="px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                      <span className="text-sm font-semibold text-blue-700 capitalize">{service.replace(/_/g, ' ')}</span>
                    </div>
                  ))}
                </div>
                {experienceYears > 0 && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-800">
                      <span className="font-bold">{experienceYears} years</span> of professional experience
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions & Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks you might want to do</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link href="/dashboard/profile" className="block">
                    <div className="p-4 border border-gray-200 rounded-xl hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Update Profile</h4>
                          <p className="text-xs text-gray-600">Edit your information</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/dashboard/documents" className="block">
                    <div className="p-4 border border-gray-200 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Upload Documents</h4>
                          <p className="text-xs text-gray-600">ID, certifications, etc.</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/dashboard/jobs" className="block">
                    <div className="p-4 border border-gray-200 rounded-xl hover:bg-purple-50 hover:border-purple-300 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Browse Jobs</h4>
                          <p className="text-xs text-gray-600">When you're approved</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/dashboard/payouts" className="block">
                    <div className="p-4 border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-300 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Payouts</h4>
                          <p className="text-xs text-gray-600">Manage your earnings</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Getting Started */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isApproved ? 'bg-green-100' : 'bg-gray-200'}`}>
                      <svg className={`w-4 h-4 ${isApproved ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isApproved ? 'text-green-700' : 'text-gray-600'}`}>
                        Profile created
                      </p>
                      <p className="text-xs text-gray-500">Your account is set up</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isApproved ? 'bg-green-100' : 'bg-gray-200'}`}>
                      <svg className={`w-4 h-4 ${isApproved ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isApproved ? 'text-green-700' : 'text-gray-600'}`}>
                        Application submitted
                      </p>
                      <p className="text-xs text-gray-500">Under review</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isApproved ? 'bg-green-100' : 'bg-blue-200 animate-pulse'}`}>
                      {isApproved ? (
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isApproved ? 'text-green-700' : 'text-blue-600'}`}>
                        {isApproved ? 'Approved!' : 'Under Review'}
                      </p>
                      <p className="text-xs text-gray-500">{isApproved ? 'Ready to accept jobs' : 'Pending approval'}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isApproved ? 'bg-green-100' : 'bg-gray-200'}`}>
                      <svg className={`w-4 h-4 ${isApproved ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${isApproved ? 'text-green-700' : 'text-gray-600'}`}>
                        {isApproved ? 'Start earning' : 'Ready to go'}
                      </p>
                      <p className="text-xs text-gray-500">{isApproved ? 'Accept jobs and build your reputation' : 'Once approved'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {application && (
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">Application {application.status}</p>
                      <p className="text-xs text-gray-500">
                        {application.status === 'submitted' 
                          ? 'Your application is under review' 
                          : application.status === 'approved'
                          ? 'You can now accept jobs!'
                          : 'Application in progress'}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500">
                      {new Date(application.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                )}
                <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Account created</p>
                    <p className="text-xs text-gray-500">Welcome to Urbance, {displayName}!</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Today'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
