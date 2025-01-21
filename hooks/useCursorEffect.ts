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
  const absorptionRef = useRef<gsap.core.Timeline | null>(null);
  const followRef = useRef<gsap.core.Tween | null>(null);

  const createGlowEffect = useCallback(() => {
    if (!elementRef.current) return null;
    
    const element = elementRef.current;
    return gsap.timeline({ paused: true })
      .to(element, {
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
        scale: 1.02, // Reduced scale for subtler effect
        duration: 0.3,
        ease: 'power2.out'
      });
  }, [elementRef]);

  const createAbsorptionEffect = useCallback((x: number, y: number) => {
    if (!elementRef.current) return null;

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    return gsap.timeline({ paused: true })
      .fromTo('.cursor-dot', {
        x,
        y,
        scale: 1,
        opacity: 1
      }, {
        x: centerX,
        y: centerY,
        scale: 0.5,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      });
  }, [elementRef]);

  const updateBubblePosition = useCallback((x: number, y: number) => {
    if (!elementRef.current || !stateRef.current.isInside) return;

    const element = elementRef.current;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate distance from cursor to center
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxDistance = Math.min(rect.width, rect.height) / 2;
    
    // Calculate attraction factor (stronger when closer to edge)
    const factor = Math.min(distance / maxDistance, 1) * 0.05; // Reduced factor for subtler movement
    
    // Kill any existing follow animation
    if (followRef.current) {
      followRef.current.kill();
    }

    // Create new follow animation
    followRef.current = gsap.to(element, {
      x: `+=${dx * factor}`,
      y: `+=${dy * factor}`,
      duration: 0.6, // Slower for smoother movement
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
      
      // Create and play absorption effect
      absorptionRef.current = createAbsorptionEffect(e.clientX, e.clientY);
      absorptionRef.current?.play();
      
      // Start glow effect
      glowRef.current?.play();
      
      onStateChange?.(stateRef.current);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isSafeToInteract.current || !stateRef.current.isInside) return;
      
      stateRef.current.position = { x: e.clientX, y: e.clientY };
      updateBubblePosition(e.clientX, e.clientY);
      onStateChange?.(stateRef.current);
    };

    const handleMouseLeave = () => {
      if (!isSafeToInteract.current) return;

      stateRef.current.isInside = false;
      onStateChange?.(stateRef.current);
      
      // Reverse effects
      glowRef.current?.reverse();
      
      // Smoothly return to original position
      if (followRef.current) {
        followRef.current.kill();
      }
      gsap.to(element, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: 'power2.out'
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      
      glowRef.current?.kill();
      absorptionRef.current?.kill();
      followRef.current?.kill();
    };
  }, [elementRef, createGlowEffect, createAbsorptionEffect, updateBubblePosition, onStateChange, isSafeToInteract]);

  return stateRef.current;
}; 