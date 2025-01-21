import { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { createIconAnimation, createBreathingAnimation, AnimationConfig } from '@/utils/animations';
import { useWindowBounds } from './useWindowBounds';
import { useAnimationInit } from './useAnimationInit';
import { useHoverAnimation } from './useHoverAnimation';
import { useAnimationContext } from './useAnimationContext';
import { useCursorEffect } from './useCursorEffect';

interface UseIconAnimationProps {
  elementRef: React.RefObject<HTMLElement>;
  centerRef: React.RefObject<HTMLElement>;
  index: number;
  total: number;
  isVisible: boolean;
  config?: AnimationConfig;
}

export const useIconAnimation = ({
  elementRef,
  centerRef,
  index,
  total,
  isVisible,
  config
}: UseIconAnimationProps) => {
  const bounds = useWindowBounds();
  const { isAnimating, isSafeToInteract } = useAnimationContext();
  const animationRef = useRef<gsap.Context>();
  const iconAnimationRef = useRef<{ show: () => gsap.core.Timeline; hide: () => gsap.core.Timeline; }>();
  const isDraggingRef = useRef(false);
  const currentPositionRef = useRef({ x: 0, y: 0 });
  const dragStartPosRef = useRef({ x: 0, y: 0 });

  // Initialize hover animation
  const hoverAnimation = useHoverAnimation({
    elementRef,
    index,
    isVisible
  });

  // Initialize cursor effect
  const cursorState = useCursorEffect({
    elementRef,
    onStateChange: (state) => {
      if (!isSafeToInteract.current) return;
      
      if (state.isInside && !isDraggingRef.current) {
        // Pause hover animation when cursor is inside
        hoverAnimation.pause();
      } else if (!isDraggingRef.current) {
        // Resume hover animation when cursor leaves
        hoverAnimation.resume();
      }
    }
  });

  const handleDragStart = useCallback(() => {
    if (!isSafeToInteract.current) return;
    
    isDraggingRef.current = true;
    hoverAnimation.pause();
    
    // Store drag start position
    if (elementRef.current) {
      dragStartPosRef.current = {
        x: gsap.getProperty(elementRef.current, "x") as number,
        y: gsap.getProperty(elementRef.current, "y") as number
      };
    }
  }, [elementRef, hoverAnimation, isSafeToInteract]);

  const handleDragEnd = useCallback(() => {
    if (!isSafeToInteract.current) return;
    
    isDraggingRef.current = false;
    // Update current position
    if (elementRef.current) {
      currentPositionRef.current = {
        x: gsap.getProperty(elementRef.current, "x") as number,
        y: gsap.getProperty(elementRef.current, "y") as number
      };
      
      // Only resume hover if cursor isn't inside
      if (!cursorState.isInside) {
        hoverAnimation.resume();
      }
    }
  }, [elementRef, hoverAnimation, cursorState.isInside, isSafeToInteract]);

  // Initialize animations
  const isInitialized = useAnimationInit({
    onInit: () => {
      if (!elementRef.current || !centerRef.current) return;

      const element = elementRef.current;

      // Store initial position
      currentPositionRef.current = {
        x: bounds.center.x,
        y: bounds.center.y
      };

      // Initialize animations with window boundary
      iconAnimationRef.current = createIconAnimation(
        element,
        bounds.center.x,
        bounds.center.y,
        index,
        total,
        {
          ...config,
          bounds,
          onDragStart: handleDragStart,
          onDragEnd: handleDragEnd
        }
      );

      // Create breathing animation context
      animationRef.current = gsap.context(() => {
        const elements = element.querySelectorAll('circle, path');
        if (elements.length) {
          createBreathingAnimation(Array.from(elements) as HTMLElement[]);
        }
      }, element);
    },
    dependencies: [elementRef.current, centerRef.current, bounds, index, total, config, handleDragStart, handleDragEnd]
  });

  // Update animations when bounds change
  const updateAnimations = useCallback(() => {
    if (!isInitialized || !elementRef.current) return;

    const element = elementRef.current;

    // Recreate animations with new boundary
    iconAnimationRef.current = createIconAnimation(
      element,
      bounds.center.x,
      bounds.center.y,
      index,
      total,
      {
        ...config,
        bounds,
        onDragStart: handleDragStart,
        onDragEnd: handleDragEnd
      }
    );
  }, [bounds, isInitialized, elementRef, index, total, config, handleDragStart, handleDragEnd]);

  useEffect(() => {
    updateAnimations();
  }, [updateAnimations]);

  // Handle visibility changes
  useEffect(() => {
    if (!isInitialized || !iconAnimationRef.current) return;

    const showAnimation = () => {
      if (!iconAnimationRef.current) return;
      
      isAnimating.current = true;
      isSafeToInteract.current = false;
      
      return iconAnimationRef.current.show().then(() => {
        isAnimating.current = false;
        isSafeToInteract.current = true;
        if (!isDraggingRef.current && !cursorState.isInside) {
          hoverAnimation.resume();
        }
      });
    };

    const hideAnimation = () => {
      if (!iconAnimationRef.current) return;
      
      hoverAnimation.pause();
      isAnimating.current = true;
      isSafeToInteract.current = false;
      
      return iconAnimationRef.current.hide().then(() => {
        isAnimating.current = false;
        isSafeToInteract.current = false;
      });
    };

    if (isVisible) {
      showAnimation();
    } else {
      hideAnimation();
    }
  }, [isVisible, isInitialized, hoverAnimation, isAnimating, isSafeToInteract, cursorState.isInside]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.revert();
      }
      hoverAnimation.kill();
    };
  }, [hoverAnimation]);

  return {
    show: () => iconAnimationRef.current?.show(),
    hide: () => iconAnimationRef.current?.hide(),
    getBounds: () => bounds,
    getCurrentPosition: () => currentPositionRef.current,
    isDragging: () => isDraggingRef.current
  };
}; 