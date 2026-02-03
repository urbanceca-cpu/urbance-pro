'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function AdminJobs() {
  const [isLoading, setIsLoading] = useState(true);
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
        return;
      }

      setIsLoading(false);
    };

    checkAdmin();
  }, [supabase, router]);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="p-8 max-w-7xl">
      <h1 className="text-3xl font-bold text-dark mb-2">Jobs</h1>
      <p className="text-medium-grey mb-8">Manage and monitor jobs</p>

      <Card>
        <CardHeader>
          <CardTitle>Jobs Management</CardTitle>
          <CardDescription>This section is coming soon</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-medium-grey">Job management features will be available in the next update.</p>
        </CardContent>
      </Card>
    </div>
  );
}
