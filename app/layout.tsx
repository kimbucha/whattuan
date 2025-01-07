import './globals.css'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'whattuan',
  description: 'Personal website',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black antialiased">{children}</body>
    </html>
  );
}
