'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { toast } from 'sonner';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password-confirm`,
    });

    if (error) {
      toast.error(error.message || 'Failed to send reset email');
      setIsLoading(false);
      return;
    }

    toast.success('Reset email sent! Check your inbox.');
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur border-blue-100">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your email to receive a reset link</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-medium-grey">
                We've sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the instructions.
              </p>
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReset} className="space-y-6">
              <Input
                id="email"
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Send Reset Email
              </Button>

              <div className="text-center text-sm">
                <Link href="/login" className="text-blue-700 hover:underline">
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
