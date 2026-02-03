import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { DeployCheck } from '@/components/DeployCheck';

export const metadata: Metadata = {
  title: 'Urbance Pros',
  description: 'Join Canada\'s trust-first marketplace for premium home services.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white text-dark antialiased">
        <DeployCheck />
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
