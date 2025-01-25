import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useAnimationContext } from './useAnimationContext';

interface CursorState {
  isInside: boolean;
  position: { x: number; y: number };
}

interface UseCursorEffectProps {
  elementRef: React.RefObject<HTMLElement>;
  onStateChange?: (state: CursorState) => void;
}

export const useCursorEffect = ({ elementRef, onStateChange }: UseCursorEffectProps) => {
  const { isSafeToInteract } = useAnimationContext();
  const stateRef = useRef<CursorState>({
    isInside: false,
    position: { x: 0, y: 0 }
  });
  const glowRef = useRef<gsap.core.Timeline | null>(null);

  const createGlowEffect = useCallback(() => {
    if (!elementRef.current) return null;
    
    const element = elementRef.current;
    return gsap.timeline({ paused: true })
      .to(element, {
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
      });
  }, [elementRef]);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    glowRef.current = createGlowEffect();

    const handleMouseEnter = (e: MouseEvent) => {
      if (!isSafeToInteract.current) return;

      stateRef.current.isInside = true;
      stateRef.current.position = { x: e.clientX, y: e.clientY };
      
      // Start glow effect
      if (glowRef.current) {
        glowRef.current.play();
      }
      
      onStateChange?.(stateRef.current);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isSafeToInteract.current || !stateRef.current.isInside) return;
      
      stateRef.current.position = { x: e.clientX, y: e.clientY };
      onStateChange?.(stateRef.current);
    };

    const handleMouseLeave = () => {
      if (!isSafeToInteract.current) return;

      stateRef.current.isInside = false;
      onStateChange?.(stateRef.current);
      
      // Reverse effects
      if (glowRef.current) {
        glowRef.current.reverse();
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      
      if (glowRef.current) glowRef.current.kill();
    };
  }, [elementRef, createGlowEffect, onStateChange, isSafeToInteract]);

  return stateRef.current;
}; 