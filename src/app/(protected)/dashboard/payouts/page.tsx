'use client';

import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function PayoutsPage() {
  return (
    <div className="flex min-h-screen bg-blue-50">
      <DashboardSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-6xl">
          <h1 className="text-3xl font-bold text-dark mb-8">Payouts</h1>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-8">
                <div className="text-medium-grey text-sm mb-2">Total Earned</div>
                <h3 className="text-3xl font-bold text-primary">$0.00</h3>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-8">
                <div className="text-medium-grey text-sm mb-2">Pending</div>
                <h3 className="text-3xl font-bold text-dark">$0.00</h3>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-8">
                <div className="text-medium-grey text-sm mb-2">This Month</div>
                <h3 className="text-3xl font-bold text-dark">$0.00</h3>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Payout History</CardTitle>
              <CardDescription>View all your completed payouts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-medium-grey text-sm">No payouts yet</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
