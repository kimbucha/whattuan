import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface CustomCursorProps {
  isDragging?: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ isDragging = false }) => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cursorRef.current) return;

    const cursor = cursorRef.current;
    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'none'
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  return (
    <div 
      ref={cursorRef}
      className={`cursor-dot fixed pointer-events-none z-50 w-2 h-2 bg-white rounded-full transform -translate-x-1 -translate-y-1 ${
        isDragging ? 'scale-150' : ''
      }`}
      style={{ 
        mixBlendMode: 'difference',
        willChange: 'transform'
      }}
    />
  );
};

export default CustomCursor; 