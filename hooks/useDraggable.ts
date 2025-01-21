import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

// Register GSAP plugins
gsap.registerPlugin(Draggable);

interface PhysicsState {
  lastX: number;
  lastY: number;
  lastTime: number;
  velocityX: number;
  velocityY: number;
}

interface DraggableConfig {
  dragResistance?: number;
  throwResistance?: number;
  maxDuration?: number;
  gravity?: number;
  friction?: number;
  maxThrowForce?: number;
}

export const useDraggable = (
  elementRef: React.RefObject<HTMLElement>,
  config: DraggableConfig = {}
) => {
  const {
    dragResistance = 0.45,
    throwResistance = 0.5,
    maxDuration = 2,
    gravity = 980,
    friction = 0.95,
    maxThrowForce = 2000
  } = config;

  const floatingAnimationRef = useRef<gsap.core.Tween>();
  const draggableInstanceRef = useRef<Draggable | null>(null);
  const physicsRef = useRef<PhysicsState>({
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    velocityX: 0,
    velocityY: 0
  });

  const startFloatingAnimation = (target: HTMLElement) => {
    if (floatingAnimationRef.current) {
      floatingAnimationRef.current.kill();
    }
    
    // Clear any existing GSAP tweens on the target
    gsap.killTweensOf(target);
    
    // Get current Y position or start at a random phase
    const currentY = gsap.getProperty(target, "y") as number;
    const randomPhase = Math.random() * 15; // Random starting point in the 15px range
    
    floatingAnimationRef.current = gsap.to(target, {
      y: `+=${15}`,
      duration: 1.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      startAt: { y: currentY || randomPhase } // Use current position or random phase
    });
  };

  const cleanupAnimations = (target: HTMLElement) => {
    if (floatingAnimationRef.current) {
      floatingAnimationRef.current.kill();
    }
    gsap.killTweensOf(target);
  };

  const updatePhysics = (x: number, y: number, currentTime: number) => {
    const deltaTime = Math.max((currentTime - physicsRef.current.lastTime) / 1000, 0.001);
    physicsRef.current.velocityX = (x - physicsRef.current.lastX) / deltaTime;
    physicsRef.current.velocityY = (y - physicsRef.current.lastY) / deltaTime;
    physicsRef.current.lastX = x;
    physicsRef.current.lastY = y;
    physicsRef.current.lastTime = currentTime;
  };

  const calculateTransform = (velocityX: number, velocityY: number) => {
    const rotation = Math.atan2(velocityY, velocityX) * (180 / Math.PI);
    const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
    const normalizedSpeed = Math.min(speed / 1000, 1);
    return { rotation, normalizedSpeed };
  };

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    
    // Cleanup any existing draggable instance
    if (draggableInstanceRef.current) {
      draggableInstanceRef.current.kill();
    }

    // Clear any existing animations
    cleanupAnimations(element);

    // Calculate bounds based on the shared container
    const updateBounds = () => {
      // Find the shared container (the fixed inset-0 div)
      const container = element.closest('.fixed.inset-0');
      if (!container) {
        console.warn('No shared container found for draggable element');
        return null;
      }

      const containerRect = container.getBoundingClientRect();
      const elementRect = element.getBoundingClientRect();
      const padding = 20; // Add some padding from edges

      return {
        left: padding,
        top: padding,
        width: containerRect.width - (padding * 2),
        height: containerRect.height - (padding * 2)
      };
    };

    // Create draggable with bounds
    draggableInstanceRef.current = Draggable.create(element, {
      type: "x,y",
      inertia: true,
      dragResistance,
      throwResistance,
      maxDuration,
      bounds: updateBounds() || undefined,
      onPress: function() {
        console.log('Icon pressed');
        cleanupAnimations(this.target);
        
        // Update bounds on press to handle window resize
        const newBounds = updateBounds();
        if (newBounds) {
          this.applyBounds(newBounds);
        }

        // Bring to front
        gsap.set(this.target, { zIndex: 100 });
      },
      onDragStart: function() {
        console.log('Drag started');
        const currentTime = Date.now();
        physicsRef.current = {
          lastX: this.x,
          lastY: this.y,
          lastTime: currentTime,
          velocityX: 0,
          velocityY: 0
        };
        
        gsap.to(this.target, {
          scale: 1.1,
          duration: 0.2,
          overwrite: true
        });
      },
      onDrag: function() {
        console.log('Dragging', { x: this.x, y: this.y });
        updatePhysics(this.x, this.y, Date.now());
        const { rotation, normalizedSpeed } = calculateTransform(
          physicsRef.current.velocityX,
          physicsRef.current.velocityY
        );
        
        gsap.to(this.target, {
          rotation,
          scaleX: 1 + normalizedSpeed * 0.5,
          scaleY: 2 - (1 + normalizedSpeed * 0.5),
          duration: 0.1,
          ease: "none",
          overwrite: true
        });
      },
      onDragEnd: function() {
        console.log('Drag ended');
        const speed = Math.sqrt(
          physicsRef.current.velocityX * physicsRef.current.velocityX + 
          physicsRef.current.velocityY * physicsRef.current.velocityY
        );
        const angle = Math.atan2(physicsRef.current.velocityY, physicsRef.current.velocityX);
        
        const throwForce = Math.min(speed / 500, maxThrowForce);
        this.throwProps = {
          x: this.x + Math.cos(angle) * throwForce,
          y: this.y + Math.sin(angle) * throwForce
        };

        gsap.to(this.target, {
          rotation: 0,
          scale: 1,
          scaleX: 1,
          scaleY: 1,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
          overwrite: true,
          onComplete: () => {
            if (this.target) {
              startFloatingAnimation(this.target);
              gsap.set(this.target, { zIndex: 50 }); // Reset z-index
            }
          }
        });
      },
      onRelease: function() {
        console.log('Icon released');
        this.enable();
      }
    })[0];

    // Add window resize handler to update bounds
    const handleResize = () => {
      if (draggableInstanceRef.current) {
        const newBounds = updateBounds();
        if (newBounds) {
          draggableInstanceRef.current.applyBounds(newBounds);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    startFloatingAnimation(element);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (draggableInstanceRef.current) {
        draggableInstanceRef.current.kill();
        draggableInstanceRef.current = null;
      }
      cleanupAnimations(element);
    };
  }, [dragResistance, throwResistance, maxDuration, gravity, friction, maxThrowForce]);
}; 