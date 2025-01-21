import { useRef, useCallback } from "react";
import { createClickAnimation } from "@/utils/animations";
import { useIconAnimation } from "@/hooks/useIconAnimation";

interface GitHubIconProps {
  isVisible: boolean;
  username: string;
  onChartOpen?: () => void;
  onChartClose?: () => void;
  index: number;
  total: number;
  centerRef: React.RefObject<HTMLElement>;
}

const GitHubIcon: React.FC<GitHubIconProps> = ({
  isVisible,
  username,
  onChartOpen,
  onChartClose,
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
      createClickAnimation(iconRef.current).eventCallback("onComplete", () => onChartOpen?.());
    } else {
      onChartOpen?.();
    }
  }, [onChartOpen]);

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
      aria-label="GitHub activity"
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
          d="M48 19.9c-14.4 0-26 11.6-26 26 0 11.5 7.5 21.2 17.8 24.7 1.3.2 1.8-.6 1.8-1.3v-4.4c-7.3 1.6-8.8-3.5-8.8-3.5-1.2-3-2.9-3.8-2.9-3.8-2.4-1.6.2-1.6.2-1.6 2.6.2 4 2.7 4 2.7 2.3 4 6.1 2.8 7.6 2.1.2-1.7.9-2.8 1.6-3.4-5.8-.7-11.9-2.9-11.9-12.9 0-2.8 1-5.2 2.7-7-.3-.7-1.2-3.3.3-6.8 0 0 2.2-.7 7.2 2.7 2.1-.6 4.3-.9 6.5-.9 2.2 0 4.4.3 6.5.9 5-3.4 7.2-2.7 7.2-2.7 1.4 3.5.5 6.1.3 6.8 1.7 1.8 2.7 4.2 2.7 7 0 10-6.1 12.2-11.9 12.9.9.8 1.7 2.4 1.7 4.8v7.1c0 .7.5 1.5 1.8 1.3 10.3-3.4 17.8-13.2 17.8-24.7 0-14.4-11.6-26-26-26z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
};

export default GitHubIcon; 