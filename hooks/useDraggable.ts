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
    
    floatingAnimationRef.current = gsap.to(target, {
      y: "+=15",
      duration: 1.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
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

    draggableInstanceRef.current = Draggable.create(element, {
      type: "x,y",
      inertia: true,
      dragResistance,
      throwResistance,
      maxDuration,
      onPress: function() {
        console.log('Icon pressed');
        cleanupAnimations(this.target);
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
      onThrowUpdate: function() {
        const currentTime = Date.now();
        const deltaTime = Math.max((currentTime - physicsRef.current.lastTime) / 1000, 0.001);
        
        physicsRef.current.velocityX *= friction;
        physicsRef.current.velocityY *= friction;
        physicsRef.current.velocityY += gravity * deltaTime;
        
        this.x += physicsRef.current.velocityX * deltaTime;
        this.y += physicsRef.current.velocityY * deltaTime;
        
        const { rotation, normalizedSpeed } = calculateTransform(
          physicsRef.current.velocityX,
          physicsRef.current.velocityY
        );
        
        gsap.to(this.target, {
          rotation,
          scaleX: 1 + normalizedSpeed * 0.3,
          scaleY: 2 - (1 + normalizedSpeed * 0.3),
          duration: 0.1,
          ease: "none",
          overwrite: true
        });
        
        updatePhysics(this.x, this.y, currentTime);
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
            }
          }
        });
      },
      onRelease: function() {
        console.log('Icon released');
        this.enable();
      }
    })[0];

    startFloatingAnimation(element);

    return () => {
      if (draggableInstanceRef.current) {
        draggableInstanceRef.current.kill();
        draggableInstanceRef.current = null;
      }
      cleanupAnimations(element);
    };
  }, [dragResistance, throwResistance, maxDuration, gravity, friction, maxThrowForce]);
}; 