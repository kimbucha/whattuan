import React, { useMemo } from 'react';
import { Tooltip } from 'react-tooltip';
import { ActivityChartProps } from '@/types/activity';
import ActivityDay from '@/components/ActivityDay';
import {
  DEFAULT_COLOR_SCHEME,
  getColorForCount,
  formatDate,
  getMaxCount,
  generateWeeksArray
} from '@/utils/activityUtils';

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ActivityChart = ({
  data,
  colorScheme = DEFAULT_COLOR_SCHEME,
  tooltipFormat = (date, count) => `${count} contributions on ${formatDate(date)}`,
  animation = { enabled: true, duration: 0.3, stagger: 0.01 }
}: ActivityChartProps) => {
  const maxCount = useMemo(() => getMaxCount(data), [data]);
  const weeks = useMemo(() => generateWeeksArray(data, true), [data]);

  const getAnimationDelay = (weekIndex: number, dayIndex: number): number => {
    if (!animation.enabled) return 0;
    const totalDelay = (weekIndex * 7 + dayIndex) * (animation.stagger || 0.01);
    return totalDelay;
  };

  return (
    <div className="w-[480px] h-[112px] p-4">
      <div className="flex flex-col">
        {/* Days of week labels */}
        <div className="flex mb-2">
          <div className="w-8" /> {/* Spacer for alignment */}
          <div className="flex gap-[2px]">
            {DAYS_OF_WEEK.map(day => (
              <div
                key={day}
                className="w-[10px] text-[10px] text-[#7d8590] text-center"
                aria-hidden="true"
              >
                {day[0]}
              </div>
            ))}
          </div>
        </div>

        {/* Main grid */}
        <div className="flex">
          {/* Month labels */}
          <div className="flex flex-col justify-around text-[10px] text-[#7d8590] mr-2">
            {weeks.filter((_, i) => i % 4 === 0).map((_, i) => (
              <div key={i} className="h-[10px] leading-[10px]">
                {new Date(weeks[i * 4]?.[0]?.date || '').toLocaleDateString('en-US', { month: 'short' })}
              </div>
            ))}
          </div>

          {/* Activity grid */}
          <div 
            role="grid"
            className="flex gap-[2px]"
            aria-label="Activity contribution chart"
          >
            {weeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                role="row"
                className="flex flex-col gap-[2px]"
              >
                {week.map((day, dayIndex) => (
                  <ActivityDay
                    key={day.date || `empty-${dayIndex}`}
                    date={day.date}
                    count={day.count}
                    color={getColorForCount(day.count, maxCount, colorScheme)}
                    tooltipContent={day.date ? tooltipFormat(day.date, day.count) : ''}
                    animationDelay={getAnimationDelay(weekIndex, dayIndex)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end text-[10px] text-[#7d8590] mt-2">
          <span className="mr-1">Less</span>
          {[0, ...colorScheme.levels].map((_, index) => (
            <div
              key={index}
              className="w-[10px] h-[10px] rounded-sm mx-[1px]"
              style={{
                backgroundColor: index === 0 ? colorScheme.empty : colorScheme.levels[index - 1]
              }}
              role="presentation"
            />
          ))}
          <span className="ml-1">More</span>
        </div>
      </div>
      
      <Tooltip 
        id="activity-tooltip" 
        className="!bg-[#161b22] !text-[#7d8590] !border !border-[#30363d] !shadow-xl !text-xs !py-1 !px-2 !rounded"
        place="top"
        delayShow={50}
      />
    </div>
  );
};

export default ActivityChart; 