import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
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
  centerX: number,
  centerY: number,
  index: number,
  total: number,
  config: AnimationConfig = DEFAULT_CONFIG
) => {
  const { 
    radius = 80, 
    duration = 0.4,
    bounds,
    physics = DEFAULT_CONFIG.physics,
    onDragStart,
    onDragEnd
  } = config;
  
  // Calculate position in the circle
  const angleInRadians = ((-Math.PI / 2) + (2 * Math.PI * (index / total)));
  const x = centerX + Math.cos(angleInRadians) * radius;
  const y = centerY + Math.sin(angleInRadians) * radius;

  // Physics state
  let lastX = x;
  let lastY = y;
  let lastTime = Date.now();
  let velocityX = 0;
  let velocityY = 0;
  let draggable: Draggable | null = null;
  let isDragging = false;

  const updatePhysics = (newX: number, newY: number, currentTime: number) => {
    const deltaTime = Math.max((currentTime - lastTime) / 1000, 0.001);
    velocityX = (newX - lastX) / deltaTime;
    velocityY = (newY - lastY) / deltaTime;
    lastX = newX;
    lastY = newY;
    lastTime = currentTime;
  };

  const calculateTransform = () => {
    const rotation = Math.atan2(velocityY, velocityX) * (180 / Math.PI);
    const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    const normalizedSpeed = Math.min(speed / 1000, 1);
    return { rotation, normalizedSpeed };
  };

  // Track animation state
  let isAnimating = false;
  let currentAnimation: gsap.core.Timeline | null = null;

  // Ensure initial position is set before any animations
  gsap.set(element, {
    visibility: 'hidden',
    position: 'fixed',
    xPercent: -50,
    yPercent: -50,
    x: x,  // Set initial position to final position
    y: y,  // Set initial position to final position
    opacity: 0,
    scale: 0.8,
    rotation: 0
  });

  return {
    show: () => {
      // If already animating, don't start a new animation
      if (isAnimating) return currentAnimation;

      // Kill any existing animations
      if (currentAnimation) {
        currentAnimation.kill();
      }

      // Set initial state
      gsap.set(element, {
        visibility: 'visible',
        x,
        y,
        opacity: 0,
        scale: 0.8
      });

      // Create draggable if it doesn't exist
      if (!draggable) {
        draggable = Draggable.create(element, {
          type: "x,y",
          inertia: true,
          trigger: element,
          bounds: window,
          dragClickables: true,
          onClick: (e) => {
            if (!isDragging) {
              element.click();
            }
            isDragging = false;
          },
          onDragStart: function() {
            isDragging = true;
            onDragStart?.();
            updatePhysics(this.x, this.y, Date.now());
            const { rotation, normalizedSpeed } = calculateTransform();
            
            gsap.to(element, {
              rotation,
              scaleX: 1 + normalizedSpeed * 0.2,
              scaleY: 1 - normalizedSpeed * 0.1,
              duration: 0.1,
              ease: "none",
              overwrite: true
            });
          },
          onDragEnd: function() {
            onDragEnd?.();
            setTimeout(() => {
              isDragging = false;
            }, 50);
          },
          onDrag: function() {
            updatePhysics(this.x, this.y, Date.now());
            const { rotation, normalizedSpeed } = calculateTransform();
            
            gsap.to(element, {
              rotation,
              scaleX: 1 + normalizedSpeed * 0.2,
              scaleY: 1 - normalizedSpeed * 0.1,
              duration: 0.1,
              ease: "none",
              overwrite: true
            });
          },
          onThrowUpdate: function() {
            const currentTime = Date.now();
            const deltaTime = Math.max((currentTime - lastTime) / 1000, 0.001);
            
            velocityX *= physics?.friction ?? DEFAULT_CONFIG.physics!.friction!;
            velocityY *= physics?.friction ?? DEFAULT_CONFIG.physics!.friction!;
            
            const nextX = this.x + velocityX * deltaTime;
            const nextY = this.y + velocityY * deltaTime;
            
            // Bounce off screen edges
            const bounce = -0.8;
            if (nextX <= 0 || nextX >= window.innerWidth) {
              velocityX *= bounce;
              this.x = nextX <= 0 ? 0 : window.innerWidth;
            }
            if (nextY <= 0 || nextY >= window.innerHeight) {
              velocityY *= bounce;
              this.y = nextY <= 0 ? 0 : window.innerHeight;
            }
            
            if (nextX > 0 && nextX < window.innerWidth) {
              this.x = nextX;
            }
            if (nextY > 0 && nextY < window.innerHeight) {
              this.y = nextY;
            }
            
            const { rotation, normalizedSpeed } = calculateTransform();
            
            gsap.to(element, {
              rotation,
              scaleX: 1 + normalizedSpeed * 0.2,
              scaleY: 1 - normalizedSpeed * 0.1,
              duration: 0.1,
              ease: "none",
              overwrite: true
            });
            
            updatePhysics(this.x, this.y, currentTime);
          }
        })[0];
        
        draggable.disable();
      }

      isAnimating = true;
      currentAnimation = gsap.timeline({
        onComplete: () => {
          isAnimating = false;
          if (draggable) {
            draggable.enable();
          }
        }
      })
      .to(element, {
        opacity: 1,
        scale: 1,
        duration: duration,
        ease: 'power2.out'
      });

      return currentAnimation;
    },
    hide: () => {
      // If already animating, don't start a new animation
      if (isAnimating) return currentAnimation;

      if (draggable) {
        draggable.disable();
      }

      isAnimating = true;
      currentAnimation = gsap.timeline({
        onComplete: () => {
          isAnimating = false;
          if (draggable) {
            draggable.kill();
            draggable = null;
          }
          gsap.set(element, { 
            visibility: 'hidden',
            x,  // Reset to original position
            y   // Reset to original position
          });
        }
      })
      .to(element, {
        opacity: 0,
        scale: 0.8,
        duration: duration,
        ease: 'power2.in'
      });

      return currentAnimation;
    }
  };
};

export const createFloatingAnimation = (
  element: HTMLElement,
  index: number = 0,
  config: { amplitude?: number; duration?: number; bounds?: Bounds } = {}
) => {
  const { amplitude = 8, duration = 1.5, bounds } = config;
  const randomPhase = Math.random() * Math.PI * 2;
  const delay = index * 0.1;

  const animation = gsap.to(element, {
    y: `+=${amplitude}`,
    duration,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    delay,
    startAt: { y: Math.sin(randomPhase) * (amplitude / 2) }
  });

  if (bounds) {
    animation.vars.modifiers = {
      y: (y: number) => {
        return Math.max(bounds.top, Math.min(bounds.height, y));
      }
    };
  }

  return animation;
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
export const createBreathingAnimation = (
  elements: HTMLElement[],
  config: { bounds?: Bounds } = {}
) => {
  // Use a smaller scale factor to prevent clipping
  const SCALE_FACTOR = 1.05;
  
  const animation = gsap.timeline({ 
    repeat: -1,
    defaults: {
      duration: 2,
      ease: 'sine.inOut'
    }
  });

  // Animate each element with proper scaling
  elements.forEach((element, index) => {
    animation.to(element, {
      scale: SCALE_FACTOR,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: index * 0.1
    }, 0);
  });

  return animation;
}; 