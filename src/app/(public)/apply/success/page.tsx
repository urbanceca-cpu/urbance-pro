import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ApplySuccess() {
  return (
    <>
      <Navbar variant="light" />
      <main className="min-h-screen bg-gradient-hero flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md text-center bg-white/90 backdrop-blur border-blue-100">
          <CardContent className="pt-12">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6">
                <span className="text-3xl text-blue-800">✓</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-dark mb-3">Application Submitted</h1>
            <p className="text-medium-grey mb-8">
              Thanks for applying! We'll review your application and get back to you within 2-3 business days.
            </p>

            <div className="bg-gradient-to-br from-cyan-200/30 to-blue-100 p-4 rounded-xl mb-8 text-left border border-blue-100">
              <h3 className="font-semibold text-dark mb-3">What Happens Next</h3>
              <ul className="space-y-2 text-sm text-medium-grey">
                <li>✓ We review your application</li>
                <li>✓ Background check processing</li>
                <li>✓ Approval & account activation</li>
                <li>✓ Welcome to Urbance Pros</li>
              </ul>
            </div>

            <div className="space-y-3">
              <Link href="/">
                <Button variant="outline" className="w-full">
                  Back to Home
                </Button>
              </Link>
              <Link href="/login">
                <Button className="w-full">Sign In</Button>
              </Link>
            </div>

            <p className="text-sm text-medium-grey mt-6">
              Check your email for updates. You can also <Link href="/login" className="text-blue-700 hover:underline">sign in</Link> to track your application status.
            </p>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
