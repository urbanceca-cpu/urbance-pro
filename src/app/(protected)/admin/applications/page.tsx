'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';
import type { ProviderApplication } from '@/lib/types';

export default function AdminApplications() {
  const [applications, setApplications] = useState<ProviderApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('submitted');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        // Verify admin role
        const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

        if (!profile || profile.role !== 'admin') {
          router.push('/dashboard');
          return;
        }

        // Load applications
        let query = supabase.from('provider_applications').select('*');

        if (filter !== 'all') {
          query = query.eq('status', filter);
        }

        const { data } = await query.order('created_at', { ascending: false });

        if (data) {
          setApplications(data);
        }
      } catch (error) {
        console.error('Error loading applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setIsLoading(false);
      }
    };

    loadApplications();
  }, [supabase, router, filter]);

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('provider_applications')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;

      setApplications(applications.map((app) => (app.id === id ? { ...app, status: 'approved' } : app)));
      toast.success('Application approved');
    } catch (error) {
      console.error('Error approving application:', error);
      toast.error('Failed to approve application');
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('provider_applications')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      setApplications(applications.map((app) => (app.id === id ? { ...app, status: 'rejected' } : app)));
      toast.success('Application rejected');
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
    }
  };

  if (isLoading) {
    return <div className="p-8">Loading applications...</div>;
  }

  return (
    <div className="p-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-dark mb-2">Applications</h1>
      <p className="text-medium-grey mb-8">Review and manage provider applications</p>

      {/* Filter */}
      <div className="flex gap-3 mb-8">
        {['submitted', 'under_review', 'approved', 'rejected', 'all'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === status ? 'bg-[#2F80ED] text-white' : 'bg-blue-50 text-dark hover:bg-blue-100'
            }`}
          >
            {status.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="pt-8 text-center">
              <p className="text-medium-grey">No applications found</p>
            </CardContent>
          </Card>
        ) : (
          applications.map((app) => (
            <Card key={app.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-dark">{app.full_name}</h3>
                    <p className="text-sm text-medium-grey">{app.email}</p>
                  </div>
                  <Badge variant={app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'error' : 'info'}>
                    {app.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4 pb-4 border-b border-medium-grey/10 text-sm">
                  <div>
                    <p className="text-medium-grey">Phone</p>
                    <p className="font-medium text-dark">{app.phone}</p>
                  </div>
                  <div>
                    <p className="text-medium-grey">City</p>
                    <p className="font-medium text-dark">{app.city}</p>
                  </div>
                  <div>
                    <p className="text-medium-grey">Experience</p>
                    <p className="font-medium text-dark">{app.experience_years} years</p>
                  </div>
                  <div>
                    <p className="text-medium-grey">Services</p>
                    <p className="font-medium text-dark">{app.services.length} service(s)</p>
                  </div>
                </div>

                {app.status === 'submitted' && (
                  <div className="flex gap-3">
                    <Button size="sm" onClick={() => handleApprove(app.id)}>
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleReject(app.id)}>
                      Reject
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
