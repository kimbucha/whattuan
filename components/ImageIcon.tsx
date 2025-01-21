import { useRef, useCallback } from "react";
import { createClickAnimation } from "@/utils/animations";
import { useIconAnimation } from "@/hooks/useIconAnimation";

interface ImageIconProps {
  isVisible: boolean;
  onClick?: () => void;
  index: number;
  total: number;
  centerRef: React.RefObject<HTMLElement>;
}

const ImageIcon: React.FC<ImageIconProps> = ({
  isVisible,
  onClick,
  index,
  total,
  centerRef
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);

  // Apply animations
  useIconAnimation({
    elementRef: containerRef,
    centerRef,
    index,
    total,
    isVisible
  });

  // Handle icon click with animation
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (iconRef.current) {
      createClickAnimation(iconRef.current).eventCallback("onComplete", () => onClick?.());
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
        zIndex: 50 // Ensure it's above other elements when dragging
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
        style={{ pointerEvents: 'none' }} // Prevent SVG from interfering with drag
      >
        <circle
          cx="49"
          cy="48"
          r="46"
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
        />
        <path
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