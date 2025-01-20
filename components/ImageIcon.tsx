import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { createBreathingAnimation, clickAnimation } from "@/utils/animationUtils";
import { useDraggable } from "@/hooks/useDraggable";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

interface ImageIconProps {
  isVisible: boolean;
  onClick?: () => void;
}

const ImageIcon: React.FC<ImageIconProps> = ({ isVisible, onClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const animationRef = useRef<gsap.Context>();

  // Apply draggable functionality
  useDraggable(containerRef);

  // Cleanup GSAP animations on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.revert();
      }
    };
  }, []);

  // Setup breathing animation
  useEffect(() => {
    if (isVisible && containerRef.current && iconRef.current && circleRef.current && pathRef.current) {
      animationRef.current = createBreathingAnimation({
        container: containerRef.current,
        icon: iconRef.current,
        elements: [circleRef.current, pathRef.current],
        isVisible
      });
    }
    return () => {
      if (animationRef.current) {
        animationRef.current.revert();
      }
    };
  }, [isVisible]);

  // Handle icon click with animation
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (iconRef.current) {
      clickAnimation(iconRef.current).eventCallback("onComplete", () => onClick?.());
    } else {
      onClick?.();
    }
  }, [onClick]);

  return (
    <div 
      ref={containerRef}
      className={`absolute w-8 h-8 flex items-center justify-center cursor-move ${!isVisible ? 'pointer-events-none' : ''}`}
      style={{
        touchAction: "none", // Prevent touch scrolling while dragging
        visibility: isVisible ? 'visible' : 'hidden',
      }}
      onClick={handleClick}
      role="button"
      aria-label="Image gallery"
    >
      <svg
        ref={iconRef}
        width="30"
        height="30"
        viewBox="-2 -2 102 100"
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        <circle
          ref={circleRef}
          cx="49"
          cy="48"
          r="46"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
          ref={pathRef}
          fillRule="evenodd"
          clipRule="evenodd"
          d="M30 20h40c5.523 0 10 4.477 10 10v40c0 5.523-4.477 10-10 10H30c-5.523 0-10-4.477-10-10V30c0-5.523 4.477-10 10-10zm0 5c-2.761 0-5 2.239-5 5v40c0 2.761 2.239 5 5 5h40c2.761 0 5-2.239 5-5V30c0-2.761-2.239-5-5-5H30zm-2 40l10-10 5 5 15-15 10 10v10c0 1.105-.895 2-2 2H30c-1.105 0-2-.895-2-2v-0zM40 35c0 2.761-2.239 5-5 5s-5-2.239-5-5 2.239-5 5-5 5 2.239 5 5z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export default ImageIcon; 