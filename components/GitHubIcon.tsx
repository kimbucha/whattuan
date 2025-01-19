import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import ActivityChart from "@/components/ActivityChart";
import { createBreathingAnimation } from "@/utils/animationUtils";
import { ActivityData } from "@/types/activity";
import { fetchGitHubContributions } from "@/utils/githubApi";

interface GitHubIconProps {
  isVisible: boolean;
  onChartOpen?: () => void;
  onChartClose?: () => void;
  username: string;
}

const GitHubIcon: React.FC<GitHubIconProps> = ({ 
  isVisible, 
  onChartOpen, 
  onChartClose,
  username
}) => {
  const [showChart, setShowChart] = useState(false);
  const [contributionData, setContributionData] = useState<ActivityData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.Context>();

  // Cleanup GSAP animations on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        animationRef.current.revert();
      }
    };
  }, []);

  // Reset chart state when visibility changes
  useEffect(() => {
    if (!isVisible) {
      setShowChart(false);
    }
  }, [isVisible]);

  // Fetch GitHub contributions
  const fetchContributions = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Fetching contributions for:', username);
      const contributions = await fetchGitHubContributions(username);
      console.log('Received contributions:', contributions);
      if (contributions.length > 0) {
        setContributionData(contributions);
      }
    } catch (error) {
      console.error('Failed to fetch contributions:', error);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

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

  // Handle icon click
  const handleClick = useCallback(async (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e?.stopPropagation) {
      e.stopPropagation();
    }

    if (!showChart && iconRef.current && chartContainerRef.current) {
      // Click animation
      const timeline = gsap.timeline();
      timeline.to(iconRef.current, {
        scale: 0.92,
        duration: 0.15,
        ease: "power2.out"
      })
      .to(iconRef.current, {
        scale: 1,
        duration: 0.15,
        ease: "power2.in"
      });

      // Fetch and show chart
      await fetchContributions();
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
  }, [showChart, onChartOpen, fetchContributions]);

  const closeChart = useCallback(() => {
    if (chartContainerRef.current) {
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
    } else {
      setShowChart(false);
      onChartClose?.();
    }
  }, [onChartClose]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e);
    } else if (e.key === 'Escape' && showChart) {
      closeChart();
    }
  }, [handleClick, showChart, closeChart]);

  return (
    <div 
      ref={containerRef}
      className="relative w-8 h-8 flex items-center justify-center cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      tabIndex={0}
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
          d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"
          fill="currentColor"
        />
      </svg>

      {showChart && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              closeChart();
            }}
            aria-hidden="true"
          />
          <div 
            ref={chartContainerRef}
            className="absolute -top-[150px] -left-[200px] z-50"
            role="dialog"
            aria-modal="true"
            aria-label="GitHub activity chart"
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              className="bg-[#161b22] rounded-lg shadow-xl p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-[128px] text-[#7d8590] text-sm">
                  Loading contributions...
                </div>
              ) : (
                <ActivityChart 
                  data={contributionData}
                  colorScheme={{
                    empty: '#161b22',
                    levels: [
                      '#0e4429',
                      '#006d32',
                      '#26a641',
                      '#39d353'
                    ]
                  }}
                  animation={{
                    enabled: true,
                    duration: 0.3,
                    stagger: 0.01
                  }}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default GitHubIcon; 