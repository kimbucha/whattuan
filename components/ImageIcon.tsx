import { useEffect, useRef } from "react";
import gsap from "gsap";
import { createBreathingAnimation } from "@/utils/animationUtils";

interface ImageIconProps {
  isVisible: boolean;
}

const ImageIcon = ({ isVisible }: ImageIconProps) => {
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

  return (
    <div 
      ref={containerRef}
      className="relative w-8 h-8 flex items-center justify-center"
    >
      <svg 
        ref={iconRef}
        width="32" 
        height="32" 
        viewBox="10 10 180 180" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-white"
      >
        {/* Outer frame */}
        <rect
          ref={frameRef}
          x="20"
          y="20"
          width="160"
          height="160"
          rx="12"
          ry="12"
          stroke="currentColor"
          strokeWidth="12"
          fill="none"
        />
        
        {/* Mountain path */}
        <path
          ref={mountainRef}
          d="M 40 140 Q 100 80 160 140"
          stroke="currentColor"
          strokeWidth="12"
          fill="none"
        />
        
        {/* Sun */}
        <circle
          ref={sunRef}
          cx="100"
          cy="60"
          r="12"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export default ImageIcon; 