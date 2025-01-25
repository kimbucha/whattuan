import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { useWindowBounds } from './useWindowBounds';
import { useAnimationContext } from './useAnimationContext';

interface UseAnimationProps {
  elementRef: React.RefObject<HTMLElement>;
  centerRef?: React.RefObject<HTMLElement>;
  index?: number;
  total?: number;
  isVisible?: boolean;
  config?: {
    radius?: number;
    duration?: number;
    stagger?: number;
  };
}

export const useAnimation = ({
  elementRef,
  centerRef,
  index = 0,
  total = 1,
  isVisible = true,
  config = {}
}: UseAnimationProps) => {
  const bounds = useWindowBounds();
  const { isAnimating } = useAnimationContext();
  const positionRef = useRef({ x: 0, y: 0 });
  const floatingRef = useRef<gsap.core.Timeline | null>(null);
  const isHoveredRef = useRef(false);
  const isDraggingRef = useRef(false);

  // Calculate position for circular arrangement
  const calculatePosition = useCallback(() => {
    if (!centerRef?.current || !elementRef.current) return { x: 0, y: 0 };

    const centerRect = centerRef.current.getBoundingClientRect();
    const elementRect = elementRef.current.getBoundingClientRect();
    const containerRect = centerRef.current.parentElement?.getBoundingClientRect();
    
    if (!containerRect) return { x: 0, y: 0 };

    // Calculate radius based on container size
    const containerSize = Math.min(containerRect.width, containerRect.height);
    const radius = config.radius ?? (containerSize * 0.4); // 40% of container size

    // Calculate angle with consistent spacing and offset
    const angleOffset = -Math.PI / 2; // Start from top
    const angleInRadians = angleOffset + (2 * Math.PI * (index / total));
    
    // Calculate position relative to container center
    const x = (containerRect.width / 2) + Math.cos(angleInRadians) * radius - (elementRect.width / 2);
    const y = (containerRect.height / 2) + Math.sin(angleInRadians) * radius - (elementRect.height / 2);
    
    return { x, y };
  }, [centerRef, elementRef, index, total, config.radius]);

  // Create floating animation with consistent scale
  const createFloatingAnimation = useCallback(() => {
    if (!elementRef.current || !centerRef?.current || isDraggingRef.current) return null;

    const element = elementRef.current;
    
    // Create unique but consistent random values based on index
    const seed = index + 1;
    const baseFrequency = 2 + (seed % 2); // Base floating duration
    const phaseOffset = seed * Math.PI / 4; // Offset for natural looking movement
    
    // Get current position as base
    const currentX = gsap.getProperty(element, "x") as number;
    const currentY = gsap.getProperty(element, "y") as number;

    // Create floating animation with irregular movement
    const tl = gsap.timeline({ 
      repeat: -1,
      defaults: { ease: "none" }
    });

    // Add multiple overlapping sine waves for more natural movement
    const duration = 3 + Math.random(); // Random duration between 3-4s
    
    // Main floating animation
    tl.to(element, {
      duration,
      x: currentX,
      y: currentY,
      rotation: "+=5", // Add constant rotation
      modifiers: {
        x: () => {
          const time = tl.time();
          // Combine multiple sine waves with different frequencies
          const wave1 = Math.sin(time * 1.5 + phaseOffset) * 4;
          const wave2 = Math.sin(time * 0.7 + phaseOffset * 1.3) * 2;
          return currentX + wave1 + wave2;
        },
        y: () => {
          const time = tl.time();
          // Combine multiple sine waves with different frequencies
          const wave1 = Math.cos(time * 1.2 + phaseOffset) * 4;
          const wave2 = Math.cos(time * 0.9 + phaseOffset * 1.7) * 2;
          return currentY + wave1 + wave2;
        }
      }
    });

    // Start playing immediately
    tl.play();

    return tl;
  }, [elementRef, centerRef, index, isDraggingRef]);

  // Initialize position and floating animation
  useEffect(() => {
    if (!elementRef.current || isAnimating.current) return;

    const pos = calculatePosition();
    positionRef.current = pos;

    // Set initial position with smooth transition
    gsap.to(elementRef.current, {
      x: pos.x,
      y: pos.y,
      opacity: isVisible ? 1 : 0,
      scale: isVisible ? 1 : 0.8,
      rotation: 0, // Reset rotation
      duration: 0.6,
      ease: 'power2.out',
      onComplete: () => {
        // Only start floating animation after reaching initial position
        if (!isDraggingRef.current) {
          if (floatingRef.current) {
            floatingRef.current.kill();
          }
          const floatingAnim = createFloatingAnimation();
          if (floatingAnim) {
            floatingRef.current = floatingAnim;
          }
        }
      }
    });

    return () => {
      if (floatingRef.current) {
        floatingRef.current.kill();
        floatingRef.current = null;
      }
    };
  }, [elementRef, calculatePosition, isVisible, isAnimating, createFloatingAnimation]);

  // Update position on window resize or scroll
  useEffect(() => {
    if (!elementRef.current || isDraggingRef.current) return;

    const pos = calculatePosition();
    positionRef.current = pos;
    
    // Smooth transition to new position
    gsap.to(elementRef.current, {
      x: pos.x,
      y: pos.y,
      duration: 0.4,
      ease: 'power2.out',
      onComplete: () => {
        // Restart floating animation from new position
        if (!isDraggingRef.current) {
          if (floatingRef.current) {
            floatingRef.current.kill();
          }
          const floatingAnim = createFloatingAnimation();
          if (floatingAnim) {
            floatingRef.current = floatingAnim;
          }
        }
      }
    });
  }, [bounds, elementRef, calculatePosition, createFloatingAnimation]);

  // Handle hover and drag states
  const handleHover = useCallback((isEntering: boolean) => {
    if (!elementRef.current || isDraggingRef.current) return;

    isHoveredRef.current = isEntering;

    gsap.to(elementRef.current, {
      scale: isEntering ? 1.3 : 1,
      duration: 0.3,
      ease: 'power2.out'
    });

    // Pause floating animation on hover
    if (floatingRef.current) {
      if (isEntering) {
        floatingRef.current.pause();
      } else if (!isDraggingRef.current) {
        floatingRef.current.resume();
      }
    }
  }, [elementRef]);

  const handleDrag = useCallback((isDragging: boolean) => {
    if (!elementRef.current) return;

    isDraggingRef.current = isDragging;

    if (isDragging) {
      if (floatingRef.current) {
        floatingRef.current.pause();
      }
    } else {
      const pos = calculatePosition();
      gsap.to(elementRef.current, {
        x: pos.x,
        y: pos.y,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          if (!isHoveredRef.current && !isDraggingRef.current) {
            const floatingAnim = createFloatingAnimation();
            if (floatingAnim) {
              if (floatingRef.current) {
                floatingRef.current.kill();
              }
              floatingRef.current = floatingAnim;
            }
          }
        }
      });
    }
  }, [elementRef, calculatePosition, createFloatingAnimation]);

  return {
    handleHover,
    handleDrag,
    position: positionRef.current
  };
}; 