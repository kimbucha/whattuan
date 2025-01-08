import { ActivityData } from '@/types/activity';

export const getMaxCount = (data: ActivityData[]): number => {
  return Math.max(...data.map(d => d.count), 0);
};

export const fillMissingDates = (data: ActivityData[]): ActivityData[] => {
  // Start from the first day of January 2025
  const startDate = new Date('2025-01-01');
  const endDate = new Date('2025-01-31');

  const dateMap = new Map(data.map(d => [d.date, d.count]));
  const filledData: ActivityData[] = [];

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    filledData.push({
      date: dateStr,
      count: dateMap.get(dateStr) || 0
    });
  }

  return filledData;
};

export const generateWeeksArray = (data: ActivityData[]): ActivityData[][] => {
  const weeks: ActivityData[][] = [];
  let currentWeek: ActivityData[] = [];

  data.forEach(day => {
    const date = new Date(day.date);
    currentWeek.push(day);
    
    // Start a new week every 7 days
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });

  // Add any remaining days
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ date: '', count: 0 });
    }
    weeks.push(currentWeek);
  }

  return weeks;
}; 