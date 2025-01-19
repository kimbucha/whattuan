import { ActivityData } from '../types/activity';

const GITHUB_API_URL = 'https://api.github.com/graphql';

/**
 * Fetches GitHub contribution data for a user using GraphQL API
 */
export async function fetchGitHubContributions(username: string): Promise<ActivityData[]> {
  // Get token from environment variable
  const token = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
  
  if (!token) {
    console.error('GitHub token not found in environment variables');
    return [];
  }

  try {
    // Calculate date range for the past year
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 1);

    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection(from: "${startDate.toISOString()}", to: "${endDate.toISOString()}") {
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

    console.log('Making request for user:', username);
    console.log('Date range:', startDate.toISOString(), 'to', endDate.toISOString());

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

    console.log('Response status:', response.status);
    
    const responseText = await response.text();
    const data = JSON.parse(responseText);
    
    if (data.errors) {
      console.error('GitHub API Error:', data.errors);
      throw new Error(data.errors[0].message);
    }

    if (!data.data?.user?.contributionsCollection?.contributionCalendar) {
      console.error('Invalid response format:', data);
      return [];
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

    console.log('Successfully fetched contributions:', contributions.length);
    console.log('Total contributions:', calendar.totalContributions);
    return contributions;
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return [];
  }
} 