import { ActivityData, ColorScheme } from '@/types/activity';

export const DEFAULT_COLOR_SCHEME: ColorScheme = {
  empty: '#161b22',
  levels: [
    '#0e4429',
    '#006d32',
    '#26a641',
    '#39d353'
  ]
};

/**
 * Get color based on activity count and maximum count
 */
export const getColorForCount = (
  count: number,
  maxCount: number,
  colorScheme = DEFAULT_COLOR_SCHEME
): string => {
  if (count === 0) return colorScheme.empty;
  
  // Cap the maximum count to prevent extreme outliers from skewing the color scale
  const normalizedMax = Math.min(maxCount, count * 5);
  const level = Math.ceil((count / normalizedMax) * (colorScheme.levels.length));
  return colorScheme.levels[Math.min(level - 1, colorScheme.levels.length - 1)];
};

/**
 * Format date string to localized format
 */
export const formatDate = (date: string, locale = 'en-US'): string => {
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Get maximum count from activity data
 */
export const getMaxCount = (data: ActivityData[]): number => {
  return Math.max(...data.map(d => d.count));
};

/**
 * Fill missing dates in activity data
 */
export const fillMissingDates = (data: ActivityData[]): ActivityData[] => {
  if (data.length === 0) return [];

  const sortedData = [...data].sort((a, b) => a.date.localeCompare(b.date));
  const result: ActivityData[] = [];
  
  const startDate = new Date(sortedData[0].date);
  const endDate = new Date(sortedData[sortedData.length - 1].date);
  
  const dateMap = new Map(data.map(d => [d.date, d.count]));
  
  for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    result.push({
      date: dateStr,
      count: dateMap.get(dateStr) || 0
    });
  }
  
  return result;
};

/**
 * Generate weeks array from activity data
 */
export const generateWeeksArray = (
  data: ActivityData[],
  startOnSunday = true
): ActivityData[][] => {
  const filledData = fillMissingDates(data);
  const weeks: ActivityData[][] = [];
  let currentWeek: ActivityData[] = [];
  
  // Adjust start date to begin on Sunday/Monday
  const firstDate = new Date(filledData[0].date);
  const dayOffset = startOnSunday ? firstDate.getDay() : (firstDate.getDay() || 7) - 1;
  
  // Add empty days at the start if needed
  for (let i = 0; i < dayOffset; i++) {
    currentWeek.push({
      date: '',
      count: 0
    });
  }
  
  filledData.forEach((day, index) => {
    currentWeek.push(day);
    if ((currentWeek.length === 7)) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  // Add remaining days
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', count: 0 });
    }
    weeks.push(currentWeek);
  }
  
  return weeks;
}; 