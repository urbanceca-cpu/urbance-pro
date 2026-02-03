import { Metadata } from 'next';
import { HomePage } from '@/components/home/HomePage';

export const metadata: Metadata = {
  title: 'Become a Pro | Urbance',
  description: 'Join Urbance\'s network of verified professionals. Flexible schedule, competitive pay, instant payouts, and full support.',
};

export default function Home() {
  return <HomePage />;
}
