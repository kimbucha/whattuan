import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  title: 'What Tuan',
  description: 'Interactive portfolio showcasing Tuan\'s work',
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#000000'
};

// Server Component
export default function Page() {
  return <HomeClient />;
}

