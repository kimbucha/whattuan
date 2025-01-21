import { createContext, useContext, useRef, MutableRefObject } from 'react';
import gsap from 'gsap';

interface AnimationContextValue {
  globalTimeline: MutableRefObject<gsap.core.Timeline | null>;
  isAnimating: MutableRefObject<boolean>;
  isSafeToInteract: MutableRefObject<boolean>;
}

export const AnimationContext = createContext<AnimationContextValue>({
  globalTimeline: { current: null },
  isAnimating: { current: false },
  isSafeToInteract: { current: false }
});

export const useAnimationContext = () => {
  const context = useContext(AnimationContext);
  if (!context) {
    throw new Error('useAnimationContext must be used within an AnimationProvider');
  }
  return context;
};

export const useCreateAnimationContext = () => {
  const globalTimeline = useRef<gsap.core.Timeline | null>(null);
  const isAnimating = useRef(false);
  const isSafeToInteract = useRef(false);

  if (!globalTimeline.current) {
    globalTimeline.current = gsap.timeline({
      paused: true,
      onStart: () => { 
        isAnimating.current = true;
        isSafeToInteract.current = false;
      },
      onComplete: () => { 
        isAnimating.current = false;
        isSafeToInteract.current = true;
      }
    });
  }

  return {
    globalTimeline,
    isAnimating,
    isSafeToInteract
  };
}; 