import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CustomCursorProps {
  isDragging?: boolean;
}

export default function CustomCursor({ isDragging = false }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cursorRef.current || !cursorDotRef.current) return;

    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;

    // Hide default cursor
    document.body.style.cursor = 'none';

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) return;
      
      // Smooth follow for outer circle
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out'
      });

      // Instant follow for inner dot
      gsap.set(cursorDot, {
        x: e.clientX,
        y: e.clientY
      });
    };

    const onMouseEnter = () => {
      if (isDragging) return;
      
      gsap.to([cursor, cursorDot], {
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const onMouseLeave = () => {
      gsap.to([cursor, cursorDot], {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.body.style.cursor = 'auto';
    };
  }, [isDragging]);

  // Hide cursor when dragging
  useEffect(() => {
    if (!cursorRef.current || !cursorDotRef.current) return;

    gsap.to([cursorRef.current, cursorDotRef.current], {
      opacity: isDragging ? 0 : 1,
      duration: 0.3,
      ease: 'power2.out'
    });
  }, [isDragging]);

  return (
    <>
      <div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-50 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white opacity-0 mix-blend-difference"
      />
      <div
        ref={cursorDotRef}
        className="pointer-events-none fixed left-0 top-0 z-50 h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-0 mix-blend-difference"
      />
    </>
  );
} 