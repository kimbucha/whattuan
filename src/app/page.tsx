'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamic imports to ensure proper client-side rendering
const WhatElement = dynamic(() => import('@/core/what/WhatElement'), {
  ssr: false,
  loading: () => <div className="what-loading">Loading...</div>
});

const ASCIIBackground = dynamic(() => import('@/components/ASCIIDemo'), {
  ssr: false
});

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* ASCII Art Background */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={<div>Loading background...</div>}>
          <ASCIIBackground />
        </Suspense>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center">
        <Suspense fallback={<div>Loading...</div>}>
          <WhatElement />
        </Suspense>
      </div>

      <style jsx>{`
        .what-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          font-family: monospace;
          font-size: 1.5rem;
          color: #fff;
        }
      `}</style>
    </main>
  );
} 