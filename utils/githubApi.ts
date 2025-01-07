import { ActivityData } from '../types/activity';

/**
 * Fetches GitHub contribution data for a user
 */
export async function fetchGitHubContributions(username: string): Promise<ActivityData[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events/public`);
    if (!response.ok) {
      throw new Error('Failed to fetch GitHub data');
    }

    const events = await response.json();
    const contributions = new Map<string, number>();

    // Process events into daily contributions
    events.forEach((event: any) => {
      const date = event.created_at.split('T')[0];
      contributions.set(date, (contributions.get(date) || 0) + 1);
    });

    // Convert to ActivityData array
    return Array.from(contributions.entries()).map(([date, count]) => ({
      date,
      count
    }));
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return [];
  }
} 