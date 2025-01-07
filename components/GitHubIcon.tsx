import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import ActivityChart from "@/components/ActivityChart";
import { createBreathingAnimation } from "@/utils/animationUtils";
import { ActivityData } from "@/types/activity";

interface GitHubIconProps {
  isVisible: boolean;
  onChartOpen?: () => void;
  onChartClose?: () => void;
}

const GitHubIcon: React.FC<GitHubIconProps> = ({ 
  isVisible, 
  onChartOpen, 
  onChartClose 
}) => {
  const [showChart, setShowChart] = useState(false);
  const [contributionData] = useState<ActivityData[]>([
    { date: '2024-01-01', count: 3 },
    { date: '2024-01-02', count: 2 },
  ]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && containerRef.current) {
      createBreathingAnimation(containerRef.current);
    }
  }, [isVisible]);

  const handleClick = useCallback((e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e?.stopPropagation) {
      e.stopPropagation();
    }

    if (!showChart) {
      gsap.to(iconRef.current, {
        scale: 0.9,
        duration: 0.1,
        yoyo: true,
        repeat: 1
      });

      gsap.fromTo(chartContainerRef.current,
        { opacity: 0, scale: 0.95, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          onStart: () => {
            setShowChart(true);
            onChartOpen?.();
          }
        }
      );
    } else {
      closeChart();
    }
  }, [showChart, onChartOpen]);

  const closeChart = useCallback(() => {
    gsap.to(chartContainerRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 20,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setShowChart(false);
        onChartClose?.();
      }
    });
  }, [onChartClose]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    } else if (e.key === 'Escape' && showChart) {
      closeChart();
    }
  }, [handleClick, showChart, closeChart]);

  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    closeChart();
  }, [closeChart]);

  return (
    <div 
      ref={containerRef}
      className="relative cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label="GitHub activity"
    >
      <svg
        ref={iconRef}
        width="40"
        height="40"
        viewBox="0 0 40 40"
        className="text-white"
      >
        <circle
          ref={circleRef}
          cx="20"
          cy="20"
          r="19"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          ref={pathRef}
          d="M20 10.2c-5.5 0-10 4.5-10 10 0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.5-1.1-4.5-4.9 0-1.1.4-2 1-2.7-.1-.2-.4-1.2.1-2.5 0 0 .8-.3 2.7 1 .8-.2 1.6-.3 2.5-.3.8 0 1.7.1 2.5.3 1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.5.6.7 1 1.6 1 2.7 0 3.8-2.3 4.6-4.5 4.9.3.3.6.9.6 1.8v2.7c0 .3.2.6.7.5 4-1.3 6.8-5.1 6.8-9.5 0-5.5-4.5-10-10-10z"
          fill="currentColor"
        />
      </svg>

      {showChart && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleBackdropClick}
          />
          <div 
            ref={chartContainerRef}
            className="absolute top-12 -left-40 bg-white p-4 rounded-lg shadow-lg z-50 w-[300px]"
          >
            <ActivityChart data={contributionData} />
          </div>
        </>
      )}
    </div>
  );
}

export default GitHubIcon; 