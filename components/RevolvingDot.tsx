import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface RevolvingDotProps {
  isActive?: boolean;
  isDragging?: boolean;
  radius?: number;
  duration?: number;
}

export default function RevolvingDot({ 
  isActive = false, 
  isDragging = false,
  radius = 24,
  duration = 2
}: RevolvingDotProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!dotRef.current) return;

    // Kill any existing animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    if (isActive || isDragging) {
      // Create revolving animation
      animationRef.current = gsap.timeline({
        repeat: -1,
        defaults: {
          ease: 'none',
          duration
        }
      })
      .set(dotRef.current, {
        opacity: 1,
        scale: isDragging ? 1.2 : 1
      })
      .to(dotRef.current, {
        motionPath: {
          path: `M ${radius} 0 A ${radius} ${radius} 0 1 1 ${-radius} 0 A ${radius} ${radius} 0 1 1 ${radius} 0`,
          autoRotate: false,
          alignOrigin: [0.5, 0.5]
        }
      });
    } else {
      // Fade out when inactive
      gsap.to(dotRef.current, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [isActive, isDragging, radius, duration]);

  return (
    <div
      ref={dotRef}
      className="pointer-events-none absolute left-1/2 top-1/2 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 mix-blend-difference"
    />
  );
} 