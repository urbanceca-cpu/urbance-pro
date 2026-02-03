'use client';

import { useState } from 'react';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export default function SupportPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject || !message) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    // TODO: Submit support ticket to Supabase
    setTimeout(() => {
      toast.success('Support ticket created');
      setSubject('');
      setMessage('');
      setIsCreating(false);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-blue-50">
      <DashboardSidebar />
      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold text-dark mb-8">Support</h1>

          {!isCreating ? (
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
                <CardDescription>We're here to support you</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-medium-grey mb-6">
                  Have a question or issue? Create a support ticket and our team will help you as soon as possible.
                </p>
                <Button onClick={() => setIsCreating(true)}>Create Support Ticket</Button>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Create Support Ticket</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <Input
                    id="subject"
                    label="Subject"
                    placeholder="Brief description of your issue"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                  <Textarea
                    id="message"
                    label="Message"
                    placeholder="Tell us more about your issue..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="h-32"
                  />
                  <div className="flex gap-3">
                    <Button type="submit" isLoading={isSubmitting}>
                      Submit Ticket
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreating(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
