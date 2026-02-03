'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { toast } from 'sonner';
import type { Profile } from '@/lib/types';

export default function AdminProviders() {
  const [providers, setProviders] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadProviders = async () => {
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

        // Load providers
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'provider')
          .order('created_at', { ascending: false });

        if (data) {
          setProviders(data);
        }
      } catch (error) {
        console.error('Error loading providers:', error);
        toast.error('Failed to load providers');
      } finally {
        setIsLoading(false);
      }
    };

    loadProviders();
  }, [supabase, router]);

  if (isLoading) {
    return <div className="p-8">Loading providers...</div>;
  }

  return (
    <div className="p-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-dark mb-2">Providers</h1>
      <p className="text-medium-grey mb-8">Manage provider accounts and status</p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-8">
            <p className="text-medium-grey text-sm mb-2">Total Providers</p>
            <h3 className="text-3xl font-bold text-dark">{providers.length}</h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-8">
            <p className="text-medium-grey text-sm mb-2">Active</p>
            <h3 className="text-3xl font-bold text-green-600">
              {providers.filter((p) => p.status === 'active').length}
            </h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-8">
            <p className="text-medium-grey text-sm mb-2">Pending</p>
            <h3 className="text-3xl font-bold text-yellow-600">
              {providers.filter((p) => p.status === 'pending').length}
            </h3>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-8">
            <p className="text-medium-grey text-sm mb-2">Suspended</p>
            <h3 className="text-3xl font-bold text-red-600">
              {providers.filter((p) => p.status === 'suspended').length}
            </h3>
          </CardContent>
        </Card>
      </div>

      {/* Providers List */}
      <div className="space-y-4">
        {providers.length === 0 ? (
          <Card>
            <CardContent className="pt-8 text-center">
              <p className="text-medium-grey">No providers yet</p>
            </CardContent>
          </Card>
        ) : (
          providers.map((provider) => (
            <Card key={provider.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-dark">{provider.full_name || 'Unknown'}</h3>
                    <p className="text-sm text-medium-grey">{provider.id}</p>
                  </div>
                  <Badge
                    variant={
                      provider.status === 'active'
                        ? 'success'
                        : provider.status === 'suspended'
                          ? 'error'
                          : 'warning'
                    }
                  >
                    {provider.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                  <div>
                    <p className="text-medium-grey">Phone</p>
                    <p className="font-medium text-dark">{provider.phone || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-medium-grey">City</p>
                    <p className="font-medium text-dark">{provider.city || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-medium-grey">Joined</p>
                    <p className="font-medium text-dark">{new Date(provider.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
