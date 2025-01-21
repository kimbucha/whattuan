import { useState, useEffect } from 'react';

export interface Bounds {
  left: number;
  top: number;
  width: number;
  height: number;
  center: {
    x: number;
    y: number;
  };
}

export const useWindowBounds = () => {
  const [bounds, setBounds] = useState<Bounds>(() => ({
    left: 0,
    top: 0,
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    center: {
      x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
      y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0
    }
  }));

  useEffect(() => {
    const updateBounds = () => {
      setBounds({
        left: 0,
        top: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        center: {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        }
      });
    };

    // Initial update
    updateBounds();

    // Update on resize
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  return bounds;
}; 