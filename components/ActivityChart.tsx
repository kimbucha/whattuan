import React from 'react';
import { ActivityChartProps } from '@/types/activity';
import { getMaxCount, fillMissingDates, generateWeeksArray } from '@/utils/activityUtils';

const ActivityChart: React.FC<ActivityChartProps> = ({ 
  data,
  colorScheme = {
    empty: '#161b22',
    levels: ['#0e4429', '#006d32', '#26a641', '#39d353']
  },
  animation = {
    enabled: true,
    duration: 0.3,
    stagger: 0.01
  }
}) => {
  const filledData = fillMissingDates(data);
  const maxCount = getMaxCount(filledData);
  const weeks = generateWeeksArray(filledData);

  // Days of week in order, showing only Mon/Wed/Fri
  const daysOfWeek = [
    { day: 'Sun', show: false },
    { day: 'Mon', show: true },
    { day: 'Tue', show: false },
    { day: 'Wed', show: true },
    { day: 'Thu', show: false },
    { day: 'Fri', show: true },
    { day: 'Sat', show: false }
  ];

  const getColor = (count: number) => {
    if (count === 0) return colorScheme.empty;
    const level = Math.ceil((count / maxCount) * (colorScheme.levels.length - 1));
    return colorScheme.levels[Math.min(level, colorScheme.levels.length - 1)];
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTooltipText = (date: string, count: number) => {
    if (!date) return '';
    return `${count} contribution${count !== 1 ? 's' : ''} on ${formatDate(date)}`;
  };

  return (
    <div className="text-sm w-full max-w-[800px]">
      {/* Month labels */}
      <div className="flex mb-2">
        <div className="w-8" /> {/* Spacer for day labels */}
        <div className="flex-1 flex items-center text-[#7d8590] text-xs">
          <div className="min-w-[24px]">Jan</div>
          <div className="opacity-60">2025</div>
        </div>
      </div>

      <div className="flex">
        {/* Day labels */}
        <div className="flex flex-col mr-2 text-[#7d8590]">
          {daysOfWeek.map(({ day, show }) => (
            <div 
              key={day} 
              className="h-[10px] text-[10px] leading-[10px] mb-[2px]"
              style={{ visibility: show ? 'visible' : 'hidden' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Activity grid */}
        <div className="flex gap-[2px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[2px]">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className="w-[10px] h-[10px] rounded-sm transition-colors duration-200 hover:ring-1 hover:ring-[#7d8590] hover:ring-offset-1 hover:ring-offset-[#161b22]"
                  style={{
                    backgroundColor: getColor(day.count),
                    opacity: animation.enabled ? 0 : 1,
                    animation: animation.enabled 
                      ? `fadeIn ${animation.duration}s ease-out forwards ${weekIndex * (animation.stagger ?? 0.01)}s`
                      : undefined
                  }}
                  title={getTooltipText(day.date, day.count)}
                  role="gridcell"
                  aria-label={getTooltipText(day.date, day.count)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end text-[10px] text-[#7d8590] mt-2">
        <span className="mr-1">Less</span>
        {[colorScheme.empty, ...colorScheme.levels].map((color, i) => (
          <div
            key={i}
            className="w-[10px] h-[10px] rounded-sm mx-[1px]"
            style={{ backgroundColor: color }}
            role="presentation"
          />
        ))}
        <span className="ml-1">More</span>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default ActivityChart; 