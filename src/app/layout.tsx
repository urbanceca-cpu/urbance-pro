import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { DeployCheck } from '@/components/DeployCheck';

// Inter font via Google Fonts
const interFontLink = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={interFontLink} rel="stylesheet" />
      </head>
      <body className="bg-white text-dark antialiased">
        <DeployCheck />
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}
