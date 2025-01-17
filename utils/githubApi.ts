import { ActivityData } from '../types/activity';

const GITHUB_API_URL = 'https://api.github.com/graphql';

/**
 * Fetches GitHub contribution data for a user using GraphQL API
 */
export async function fetchGitHubContributions(username: string): Promise<ActivityData[]> {
  // Get token from environment variable
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  
  if (!token) {
    console.error('GitHub token not found');
    return [];
  }

  try {
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection(from: "${new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()}", to: "${new Date().toISOString()}") {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                  color
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(GITHUB_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub data');
    }

    const data = await response.json();
    
    if (data.errors) {
      console.error('GitHub API Error:', data.errors[0]);
      throw new Error(data.errors[0].message);
    }

    const calendar = data.data.user.contributionsCollection.contributionCalendar;
    const contributions: ActivityData[] = [];

    // Flatten the weeks array into a single array of contribution days
    calendar.weeks.forEach((week: any) => {
      week.contributionDays.forEach((day: any) => {
        contributions.push({
          date: day.date,
          count: day.contributionCount,
          color: day.color
        });
      });
    });

    return contributions;
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return [];
  }
} 