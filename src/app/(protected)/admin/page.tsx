'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function AdminHome() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

      if (!profile || profile.role !== 'admin') {
        router.push('/dashboard');
      }
    };

    checkAdmin();
  }, [supabase, router]);

  return (
    <div className="p-8 max-w-7xl">
      <h1 className="text-4xl font-bold text-dark mb-2">Admin Dashboard</h1>
      <p className="text-medium-grey mb-12">Manage Urbance providers and applications</p>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">📋 Applications</CardTitle>
            <CardDescription>Review and manage applications</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-medium-grey mb-4">Review pending applications, approve providers, and manage application status.</p>
            <Link href="/admin/applications">
              <Button variant="outline" className="w-full">
                View Applications
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">👥 Providers</CardTitle>
            <CardDescription>Manage provider accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-medium-grey mb-4">View all active providers, manage status, and handle account actions.</p>
            <Link href="/admin/providers">
              <Button variant="outline" className="w-full">
                View Providers
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">📊 Jobs</CardTitle>
            <CardDescription>Manage jobs (coming soon)</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-medium-grey mb-4">Monitor job assignments, completion status, and provider performance metrics.</p>
            <Button variant="outline" className="w-full" disabled>
              View Jobs (Soon)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
