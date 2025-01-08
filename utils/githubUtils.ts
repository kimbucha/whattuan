import { ActivityData } from '@/types/activity';

export async function fetchGitHubContributions(username: string): Promise<ActivityData[]> {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/events`);
    if (!response.ok) {
      throw new Error('Failed to fetch GitHub data');
    }
    
    const events = await response.json();
    const contributions = new Map<string, number>();
    
    // Count push events and their commits
    events.forEach((event: any) => {
      if (event.type === 'PushEvent') {
        const date = event.created_at.split('T')[0];
        const count = event.payload.commits?.length || 0;
        contributions.set(date, (contributions.get(date) || 0) + count);
      }
    });
    
    return Array.from(contributions.entries()).map(([date, count]) => ({
      date,
      count
    }));
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return [];
  }
} 