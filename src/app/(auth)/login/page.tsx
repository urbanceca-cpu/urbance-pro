'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Navbar } from '@/components/Navbar';
import { toast } from 'sonner';

export default function Login() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Try to authenticate with email first
      const { data, error } = await supabase.auth.signInWithPassword({
        email: usernameOrEmail,
        password,
      });

      if (error) {
        toast.error(error.message || 'Failed to sign in');
        setIsLoading(false);
        return;
      }

      if (data.user) {
        toast.success('Signed in successfully!');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during sign in');
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="relative">
        <div className="fixed top-0 left-0 right-0 h-24 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 z-0"></div>
        <Navbar variant="dark" />
      </div>

      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 pt-32 pb-20 flex items-start justify-center px-4">
        <div className="w-full max-w-md mt-12">
          <Card className="w-full bg-white/95 backdrop-blur-xl border-gray-200 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mb-4 inline-flex">
                <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Urbance
                </div>
              </div>
              <CardTitle className="text-2xl">Provider Sign In</CardTitle>
              <CardDescription>Access your provider dashboard and manage your services</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                <Input
                  id="username-email"
                  label="Email"
                  type="email"
                  placeholder="email@example.com"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  required
                />
                <Input
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <Button type="submit" className="w-full text-lg font-bold" isLoading={isLoading}>
                  Sign In
                </Button>
              </form>

              {/* Security Info */}
              <div className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Secure Login:</span> All data is encrypted with 256-bit SSL. Your password is never stored in plain text.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600 mb-4">
                  New to Urbance?{' '}
                  <Link href="/apply" className="text-blue-600 font-semibold hover:underline">
                    Apply as a Provider
                  </Link>
                </p>
                <Link href="/reset-password" className="block text-center text-blue-600 text-sm hover:underline">
                  Forgot your password?
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Footer Info */}
          <div className="mt-8 text-center text-xs text-gray-400">
            <p>Protected by industry-standard security</p>
            <p className="mt-1">© 2026 Urbance. All rights reserved.</p>
          </div>
        </div>
      </main>
    </>
  );
}
