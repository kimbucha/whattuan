import { useRef } from "react";

const ImageIcon = () => {
  const frameRef = useRef<SVGRectElement>(null);
  const mountainRef = useRef<SVGPathElement>(null);
  const sunRef = useRef<SVGCircleElement>(null);

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
        d="M 50 140 C 70 80, 100 120, 130 90 C 160 60, 170 120, 150 140"
        stroke="currentColor"
        strokeWidth="12"
        fill="none"
      />
      
      {/* Sun circle */}
      <circle
        ref={sunRef}
        cx="60"
        cy="60"
        r="12"
        fill="currentColor"
      />
    </svg>
  );
};

export default ImageIcon; 