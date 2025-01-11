import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { createBreathingAnimation } from "@/utils/animationUtils";

interface ImageIconProps {
  isVisible: boolean;
  onClick?: () => void;
}

const ImageIcon = ({ isVisible, onClick }: ImageIconProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const frameRef = useRef<SVGRectElement>(null);
  const mountainRef = useRef<SVGPathElement>(null);
  const sunRef = useRef<SVGCircleElement>(null);
  const timelineRef = useRef<GSAPTimeline | null>(null);

  useEffect(() => {
    if (containerRef.current && iconRef.current && frameRef.current && mountainRef.current && sunRef.current) {
      timelineRef.current = createBreathingAnimation({
        container: containerRef.current,
        icon: iconRef.current,
        elements: [frameRef.current, mountainRef.current, sunRef.current],
        isVisible
      });
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [isVisible]);

  const handleClick = useCallback((e: React.MouseEvent | React.KeyboardEvent) => {
    if (e.stopPropagation) {
      e.stopPropagation();
    }

    // Click animation
    gsap.to(iconRef.current, {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => onClick?.()
    });
  }, [onClick]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    }
  }, [handleClick]);

  return (
    <div 
      ref={containerRef}
      className="relative w-8 h-8 flex items-center justify-center cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label="Image gallery"
    >
      <svg 
        ref={iconRef}
        width="32" 
        height="32" 
        viewBox="-2 -2 102 100"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        {/* Outer frame */}
        <rect
          ref={frameRef}
          x="4"
          y="4"
          width="92"
          height="92"
          rx="8"
          ry="8"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        
        {/* Mountain path */}
        <path
          ref={mountainRef}
          d="M 20 70 Q 48 40 80 70"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        
        {/* Sun */}
        <circle
          ref={sunRef}
          cx="48"
          cy="30"
          r="8"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export default ImageIcon; 