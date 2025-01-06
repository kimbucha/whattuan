import { useEffect, useRef } from "react";
import gsap from "gsap";

interface ImageIconProps {
  isVisible: boolean;
}

const ImageIcon = ({ isVisible }: ImageIconProps) => {
  const frameRef = useRef<SVGRectElement>(null);
  const mountainRef = useRef<SVGPathElement>(null);
  const sunRef = useRef<SVGCircleElement>(null);
  const timelineRef = useRef<GSAPTimeline | null>(null);

  const createBreathCycle = () => {
    const tl = gsap.timeline();

    // Set initial state
    gsap.set([frameRef.current, mountainRef.current], {
      transformOrigin: "center bottom"
    });
    gsap.set(sunRef.current, {
      transformOrigin: "center center"
    });

    // Inhale
    tl.to([frameRef.current, mountainRef.current, sunRef.current], {
      duration: 3,
      scale: 1.05,
      scaleY: function(i) {
        // Apply larger scaleY only to mountain (index 1)
        return i === 1 ? 1.3 : 1.05;
      },
      y: function(i) {
        // Move sun up (index 2)
        return i === 2 ? -15 : i === 1 ? -20 : 0;
      },
      ease: "power2.inOut"
    })
    
    // Exhale (reverse back to initial state)
    .to([frameRef.current, mountainRef.current, sunRef.current], {
      duration: 3,
      scale: 1,
      scaleY: 1,
      y: 0,
      ease: "power2.inOut"
    });

    return tl;
  };

  useEffect(() => {
    if (isVisible && !timelineRef.current) {
      // Create master timeline that repeats infinitely
      timelineRef.current = gsap.timeline({
        repeat: -1,
        repeatDelay: 0,
        defaults: {
          ease: "power2.inOut"
        }
      }).add(createBreathCycle());
    }

    // Control animation based on visibility
    if (timelineRef.current) {
      if (isVisible) {
        timelineRef.current.play();
      } else {
        timelineRef.current.pause();
        // Reset elements to initial state
        gsap.set([frameRef.current, mountainRef.current, sunRef.current], {
          scale: 1,
          scaleY: 1,
          y: 0,
          opacity: isVisible ? 1 : 0,
          immediateRender: true
        });
      }
    }

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    };
  }, [isVisible]);

  return (
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 200 200" 
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
  );
};

export default ImageIcon; 