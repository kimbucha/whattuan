import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { DayProps } from '@/types/activity';
import 'react-tooltip/dist/react-tooltip.css';

const ActivityDay = ({ 
  date, 
  count, 
  color, 
  tooltipContent,
  animationDelay = 0 
}: DayProps) => {
  const dayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dayRef.current) {
      gsap.fromTo(dayRef.current,
        { 
          scale: 0,
          opacity: 0 
        },
        { 
          scale: 1,
          opacity: 1,
          duration: 0.3,
          delay: animationDelay,
          ease: "back.out(1.7)"
        }
      );
    }
  }, [animationDelay]);

  return (
    <div
      ref={dayRef}
      className="w-[10px] h-[10px] rounded-sm cursor-pointer transition-colors duration-200 hover:ring-2 hover:ring-[#7d8590] hover:ring-offset-1 hover:ring-offset-[#161b22]"
      style={{ 
        backgroundColor: color,
        transform: 'scale(0)',  // Initial state for GSAP
        opacity: 0
      }}
      data-tooltip-id="activity-tooltip"
      data-tooltip-content={tooltipContent}
      role="gridcell"
      aria-label={tooltipContent}
      data-date={date}
      data-count={count}
    />
  );
};

export default ActivityDay; 