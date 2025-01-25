import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// Register the plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(MotionPathPlugin);
}

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

    if (isActive && !isDragging) {
      // Create revolving animation
      animationRef.current = gsap.timeline({
        repeat: -1,
        defaults: {
          ease: 'none',
          duration
        }
      });

      // Set initial position and create the circular motion
      animationRef.current
        .set(dotRef.current, {
          opacity: 1,
          scale: 1,
          transformOrigin: '50% 50%'
        })
        .to(dotRef.current, {
          motionPath: {
            path: [
              { x: radius, y: 0 },
              { x: 0, y: radius },
              { x: -radius, y: 0 },
              { x: 0, y: -radius },
              { x: radius, y: 0 }
            ],
            curviness: 1,
            type: "cubic",
            autoRotate: false
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
    <div className="absolute inset-0 pointer-events-none">
      <div
        ref={dotRef}
        className="absolute h-1 w-1 rounded-full bg-white opacity-0 mix-blend-difference"
        style={{
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      />
    </div>
  );
} 