import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable, MotionPathPlugin);
}

interface Bounds {
  left: number;
  top: number;
  width: number;
  height: number;
  center: {
    x: number;
    y: number;
  };
}

export interface AnimationConfig {
  radius?: number;
  duration?: number;
  stagger?: number;
  bounds?: Bounds;
  physics?: {
    gravity?: number;
    friction?: number;
    maxThrowForce?: number;
  };
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onComplete?: () => void;
}

export const DEFAULT_CONFIG: AnimationConfig = {
  radius: 80,
  duration: 0.4,
  stagger: 0.1,
  physics: {
    gravity: 980,
    friction: 0.95,
    maxThrowForce: 2000
  }
};

export const createIconAnimation = (
  element: HTMLElement,
  config: AnimationConfig = {}
): { show: () => gsap.core.Timeline; hide: () => gsap.core.Timeline } => {
  const show = () => {
    return gsap.timeline()
      .to(element, {
        opacity: 1,
        scale: 1,
        duration: config.duration ?? 0.4,
        ease: 'power2.out',
        onComplete: config.onComplete
      });
  };

  const hide = () => {
    return gsap.timeline()
      .to(element, {
        opacity: 0,
        scale: 0.8,
        duration: config.duration ?? 0.4,
        ease: 'power2.in'
      });
  };

  return { show, hide };
};

export const createFloatingAnimation = (
  element: HTMLElement,
  index: number = 0,
  config: { amplitude?: number; duration?: number; bounds?: Bounds } = {}
) => {
  // Create unique but consistent random values based on index
  const seed = Math.sin(index * 1000);
  const randomAmplitude = (seed * 4) + 8; // Range: 4-12px
  const randomDuration = (Math.sin(index * 2000) * 0.5) + 2; // Range: 1.5-2.5s
  const randomPhase = Math.sin(index * 3000) * Math.PI;
  const randomXAmplitude = (Math.sin(index * 4000) * 2) + 4; // Range: 2-6px

  const { bounds } = config;

  // Create a timeline for combined animations
  const tl = gsap.timeline({ repeat: -1 });

  // Vertical floating with unique amplitude and duration
  tl.to(element, {
    y: `+=${randomAmplitude}`,
    duration: randomDuration,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    startAt: { y: Math.sin(randomPhase) * (randomAmplitude / 2) }
  });

  // Add slight horizontal movement with different timing
  tl.to(element, {
    x: `+=${randomXAmplitude}`,
    duration: randomDuration * 1.3,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
    startAt: { x: Math.cos(randomPhase) * (randomXAmplitude / 2) }
  }, 0);

  // Add subtle rotation
  tl.to(element, {
    rotation: (seed * 5),
    duration: randomDuration * 1.7,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1
  }, 0);

  if (bounds) {
    tl.vars.modifiers = {
      y: (y: number) => Math.max(bounds.top, Math.min(bounds.height, y))
    };
  }

  return tl;
};

export const createClickAnimation = (element: HTMLElement | SVGElement) => {
  return gsap.timeline()
    .to(element, {
      scale: 0.92,
      duration: 0.15,
      ease: 'power2.out'
    })
    .to(element, {
      scale: 1,
      duration: 0.15,
      ease: 'power2.in'
    });
};

// Update breathing animation to respect container bounds
export const createBreathingAnimation = (elements: HTMLElement[]) => {
  elements.forEach((element, index) => {
    gsap.to(element, {
      opacity: 0.6,
      duration: 1.5 + (index * 0.2),
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  });
}; 