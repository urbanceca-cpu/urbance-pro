'use client';

import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function JobsPage() {
  return (
    <div className="flex min-h-screen bg-blue-50">
      <DashboardSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold text-dark mb-8">Jobs</h1>

          <Card>
            <CardHeader>
              <CardTitle>Available Jobs</CardTitle>
              <CardDescription>Browse and accept jobs matching your services</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-medium-grey text-sm">No jobs available yet. Check back soon!</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
