import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { useAnimationContext } from './useAnimationContext';

interface UseHoverAnimationProps {
  elementRef: React.RefObject<HTMLElement>;
  index: number;
  isVisible: boolean;
}

export const useHoverAnimation = ({ elementRef, index, isVisible }: UseHoverAnimationProps) => {
  const { isAnimating } = useAnimationContext();
  const floatAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const isHoveringRef = useRef(false);
  const isDraggingRef = useRef(false);

  const createFloatAnimation = useCallback(() => {
    if (!elementRef.current) return null;

    const element = elementRef.current;
    
    // Create unique but consistent random values based on index
    const seed = index + 1;
    const baseFrequency = 2 + (seed % 2); // Base floating duration
    const phaseOffset = seed * Math.PI / 4; // Offset for natural looking movement
    
    // Kill any existing animation
    if (floatAnimationRef.current) {
      floatAnimationRef.current.kill();
    }

    // Get current position as base
    const currentX = gsap.getProperty(element, "x") as number;
    const currentY = gsap.getProperty(element, "y") as number;

    // Create floating animation
    const timeline = gsap.timeline({ 
      repeat: -1,
      defaults: { ease: "none" },
      paused: true
    });

    // Composite movement using multiple sine waves for more natural motion
    timeline.to(element, {
      duration: baseFrequency,
      repeat: -1,
      x: currentX,
      y: currentY,
      modifiers: {
        x: () => {
          const time = timeline.time();
          const primary = Math.sin(time * 2 + phaseOffset) * 8;
          const secondary = Math.sin(time * 3.3 + phaseOffset * 1.5) * 4;
          return currentX + primary + secondary;
        },
        y: () => {
          const time = timeline.time();
          const primary = Math.cos(time * 1.7 + phaseOffset) * 8;
          const secondary = Math.cos(time * 2.8 + phaseOffset * 1.2) * 4;
          return currentY + primary + secondary;
        }
      }
    });

    // Add subtle rotation
    timeline.to(element, {
      rotation: "+=3",
      duration: baseFrequency * 1.3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    }, 0);

    return timeline;
  }, [elementRef, index]);

  // Initialize or recreate float animation when visibility changes
  useEffect(() => {
    if (!isVisible || isAnimating.current) return;

    const newTimeline = createFloatAnimation();
    if (newTimeline) {
      floatAnimationRef.current = newTimeline;
      if (!isDraggingRef.current) {
        newTimeline.play();
      }
    }

    return () => {
      if (floatAnimationRef.current) {
        floatAnimationRef.current.kill();
        floatAnimationRef.current = null;
      }
    };
  }, [isVisible, createFloatAnimation, isAnimating]);

  const pause = useCallback(() => {
    isDraggingRef.current = true;
    floatAnimationRef.current?.pause();
  }, []);

  const resume = useCallback(() => {
    if (isAnimating.current) return;
    isDraggingRef.current = false;
    const newTimeline = createFloatAnimation();
    if (newTimeline) {
      if (floatAnimationRef.current) {
        floatAnimationRef.current.kill();
      }
      floatAnimationRef.current = newTimeline;
      newTimeline.play();
    }
  }, [isAnimating, createFloatAnimation]);

  const kill = useCallback(() => {
    isDraggingRef.current = false;
    if (floatAnimationRef.current) {
      floatAnimationRef.current.kill();
      floatAnimationRef.current = null;
    }
  }, []);

  return {
    pause,
    resume,
    kill
  };
}; 