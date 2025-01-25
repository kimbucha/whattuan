import React from 'react';
import { useEffect, useRef, forwardRef } from 'react';
import { createFloatingAnimation } from '@/utils/animations';

interface FloatingTextProps {
  text: string;
  className?: string;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
}

const FloatingText = React.forwardRef<HTMLDivElement, FloatingTextProps>(({
  text,
  className = '',
  onMouseEnter,
  onMouseLeave
}, ref) => {
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const animationsRef = useRef<gsap.core.Tween[]>([]);

  useEffect(() => {
    const element = ref && 'current' in ref ? ref.current : null;
    if (!element) return;

    // Create floating animation for each letter
    animationsRef.current = letterRefs.current.map((letter, index) => {
      if (!letter) return null;
      return createFloatingAnimation(letter, index);
    }).filter((anim): anim is gsap.core.Tween => anim !== null);

    return () => {
      animationsRef.current.forEach(anim => anim.kill());
      animationsRef.current = [];
    };
  }, [text, ref]);

  return (
    <div
      ref={ref}
      className={`block relative ${className}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        width: 'fit-content',
        margin: '0 auto'
      }}
    >
      {text.split('').map((letter, index) => (
        <span
          key={index}
          ref={(el) => {
            letterRefs.current[index] = el;
            return undefined;
          }}
          className="inline-block relative"
          style={{ willChange: 'transform' }}
        >
          {letter}
        </span>
      ))}
    </div>
  );
});

FloatingText.displayName = 'FloatingText';

export default FloatingText; 