/**
 * Represents a single day's activity data
 */
export interface ActivityData {
  /** ISO 8601 date string (YYYY-MM-DD) */
  date: string;
  /** Number of activities/contributions for the day */
  count: number;
}

/**
 * Color scheme configuration for the activity chart
 */
export interface ColorScheme {
  /** Color for days with no activity */
  empty: string;
  /** Array of colors for increasing activity levels */
  levels: string[];
}

/**
 * Props for the main ActivityChart component
 */
export interface ActivityChartProps {
  /** Array of daily activity data */
  data: ActivityData[];
  /** Optional custom color scheme */
  colorScheme?: ColorScheme;
  /** Optional custom tooltip format function */
  tooltipFormat?: (date: string, count: number) => string;
  /** Optional animation settings */
  animation?: {
    enabled: boolean;
    duration?: number;
    stagger?: number;
  };
}

/**
 * Props for individual day squares in the chart
 */
export interface DayProps {
  /** ISO 8601 date string */
  date: string;
  /** Number of activities */
  count: number;
  /** Background color for the square */
  color: string;
  /** Tooltip content */
  tooltipContent: string;
  /** Animation delay for staggered animations */
  animationDelay?: number;
} 