// ─── GitHub API Service ───────────────────────────────────────────────────────
// All GitHub API calls live here. UI components never call fetch directly.
// Auth token: VITE_GITHUB_TOKEN (optional — raises rate limit 60→5000/hr)

const GITHUB_USERNAME = 'Sharon-Sam14';
const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';
const GITHUB_REST_URL = 'https://api.github.com';
const TOKEN = (import.meta as any).env?.VITE_GITHUB_TOKEN ?? '';

// ─── In-Memory Cache (5 minutes TTL) ─────────────────────────────────────────
const cache = new Map<string, { data: unknown; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000;

function withCache<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return Promise.resolve(cached.data as T);
  }
  return fetcher().then((data) => {
    cache.set(key, { data, ts: Date.now() });
    return data;
  });
}

function gqlHeaders(): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;
  return headers;
}

function restHeaders(): HeadersInit {
  const headers: HeadersInit = { Accept: 'application/vnd.github+json' };
  if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;
  return headers;
}

// ─── Types ────────────────────────────────────────────────────────────────────
export interface GithubOverview {
  totalStars: number;
  publicRepos: number;
  totalForks: number;
  followers: number;
  following: number;
  totalContributions: number;
  totalCommits: number;
}

export interface WeeklyContribution {
  week: string; // ISO date of Sunday
  total: number;
}

export interface GithubRepo {
  name: string;
  description: string | null;
  primaryLanguage: string | null;
  languageColor: string | null;
  stars: number;
  forks: number;
  url: string;
  homepage: string | null;
  updatedAt: string;
}

export interface GithubEvent {
  id: string;
  type: string;
  repoName: string;
  createdAt: string;
  payload: {
    commits?: Array<{ message: string }>;
    ref?: string;
    refType?: string;
    release?: { name: string; tag_name: string };
  };
}

// ─── 1. GitHub Overview (GraphQL) ─────────────────────────────────────────────
export async function getGithubOverview(): Promise<GithubOverview> {
  return withCache<GithubOverview>('overview', async () => {
    const query = `
      query($login: String!) {
        user(login: $login) {
          followers { totalCount }
          following { totalCount }
          repositories(first: 100, privacy: PUBLIC, ownerAffiliations: OWNER) {
            totalCount
            nodes {
              stargazerCount
              forkCount
            }
          }
          contributionsCollection {
            contributionCalendar {
              totalContributions
            }
            totalCommitContributions
            totalPullRequestContributions
          }
        }
      }
    `;
    const res = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: gqlHeaders(),
      body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
    });
    const json = await res.json();
    const user = json?.data?.user;
    if (!user) throw new Error('Failed to fetch GitHub overview');

    const repos: Array<{ stargazerCount: number; forkCount: number }> =
      user.repositories.nodes ?? [];

    return {
      totalStars: repos.reduce((acc: number, r: { stargazerCount: number }) => acc + r.stargazerCount, 0),
      publicRepos: user.repositories.totalCount,
      totalForks: repos.reduce((acc: number, r: { forkCount: number }) => acc + r.forkCount, 0),
      followers: user.followers.totalCount,
      following: user.following.totalCount,
      totalContributions:
        user.contributionsCollection.contributionCalendar.totalContributions,
      totalCommits:
        user.contributionsCollection.totalCommitContributions,
    };
  });
}

// ─── 2. Contribution Calendar Weekly Data (GraphQL) ───────────────────────────
export async function getContributionGraph(): Promise<WeeklyContribution[]> {
  return withCache<WeeklyContribution[]>('contribution-graph', async () => {
    const query = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              weeks {
                firstDay
                contributionDays {
                  contributionCount
                }
              }
            }
          }
        }
      }
    `;
    const res = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: gqlHeaders(),
      body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
    });
    const json = await res.json();
    const weeks =
      json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];

    return weeks.map((w: { firstDay: string; contributionDays: Array<{ contributionCount: number }> }) => ({
      week: w.firstDay,
      total: w.contributionDays.reduce(
        (acc: number, d: { contributionCount: number }) => acc + d.contributionCount,
        0,
      ),
    }));
  });
}

// ─── 2.5 Daily Contribution Calendar (GraphQL) ────────────────────────────────
export interface DailyContribution {
  date: string;
  count: number;
  level: number;
}

export async function getDailyContributions(): Promise<DailyContribution[]> {
  return withCache<DailyContribution[]>('daily-contributions', async () => {
    const query = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              weeks {
                contributionDays {
                  date
                  contributionCount
                  contributionLevel
                }
              }
            }
          }
        }
      }
    `;
    const res = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: gqlHeaders(),
      body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
    });
    const json = await res.json();
    const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];

    const days: DailyContribution[] = [];
    const levelMap: Record<string, number> = {
      NONE: 0,
      FIRST_QUARTILE: 1,
      SECOND_QUARTILE: 2,
      THIRD_QUARTILE: 3,
      FOURTH_QUARTILE: 4,
    };

    for (const w of weeks) {
      for (const d of w.contributionDays) {
        days.push({
          date: d.date,
          count: d.contributionCount,
          level: levelMap[d.contributionLevel] ?? 0,
        });
      }
    }
    return days;
  });
}

// ─── 3. Recent Repositories (GraphQL) ─────────────────────────────────────────
export async function getRecentRepos(): Promise<GithubRepo[]> {
  return withCache<GithubRepo[]>('repos', async () => {
    const query = `
      query($login: String!) {
        user(login: $login) {
          repositories(
            first: 6
            privacy: PUBLIC
            ownerAffiliations: OWNER
            orderBy: { field: PUSHED_AT, direction: DESC }
          ) {
            nodes {
              name
              description
              url
              homepageUrl
              updatedAt
              stargazerCount
              forkCount
              primaryLanguage {
                name
                color
              }
            }
          }
        }
      }
    `;
    const res = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: gqlHeaders(),
      body: JSON.stringify({ query, variables: { login: GITHUB_USERNAME } }),
    });
    const json = await res.json();
    const nodes = json?.data?.user?.repositories?.nodes ?? [];

    return nodes.map((n: {
      name: string;
      description: string | null;
      url: string;
      homepageUrl: string | null;
      updatedAt: string;
      stargazerCount: number;
      forkCount: number;
      primaryLanguage: { name: string; color: string } | null;
    }) => ({
      name: n.name,
      description: n.description,
      primaryLanguage: n.primaryLanguage?.name ?? null,
      languageColor: n.primaryLanguage?.color ?? null,
      stars: n.stargazerCount,
      forks: n.forkCount,
      url: n.url,
      homepage: n.homepageUrl || null,
      updatedAt: n.updatedAt,
    }));
  });
}

// ─── 4. Recent Activity (REST Events API) ─────────────────────────────────────
export async function getRecentActivity(): Promise<GithubEvent[]> {
  return withCache<GithubEvent[]>('activity', async () => {
    const res = await fetch(
      `${GITHUB_REST_URL}/users/${GITHUB_USERNAME}/events/public?per_page=30`,
      { headers: restHeaders() },
    );
    if (!res.ok) throw new Error('Failed to fetch events');
    const data = await res.json();

    const allowed = ['PushEvent', 'CreateEvent', 'ReleaseEvent', 'WatchEvent'];
    return (data as Array<{
      id: string;
      type: string;
      repo: { name: string };
      created_at: string;
      payload: {
        commits?: Array<{ message: string }>;
        ref?: string;
        ref_type?: string;
        release?: { name: string; tag_name: string };
      };
    }>)
      .filter((e) => allowed.includes(e.type))
      .slice(0, 10)
      .map((e) => ({
        id: e.id,
        type: e.type,
        repoName: e.repo.name.replace(`${GITHUB_USERNAME}/`, ''),
        createdAt: e.created_at,
        payload: {
          commits: e.payload.commits,
          ref: e.payload.ref,
          refType: e.payload.ref_type,
          release: e.payload.release,
        },
      }));
  });
}

// ─── 5. Static Language Data ──────────────────────────────────────────────────
// Pre-computed from repository analysis. Curated for accurate representation.
export interface LanguageEntry {
  name: string;
  color: string;
  percentage: number;
}

export const LANGUAGE_DATA: LanguageEntry[] = [
  { name: 'TypeScript', color: '#3178C6', percentage: 28 },
  { name: 'JavaScript', color: '#F7DF1E', percentage: 18 },
  { name: 'Python',     color: '#3776AB', percentage: 16 },
  { name: 'Java',       color: '#ED8B00', percentage: 12 },
  { name: 'HTML',       color: '#E34F26', percentage: 8  },
  { name: 'CSS',        color: '#1572B6', percentage: 6  },
  { name: 'SQL',        color: '#336791', percentage: 5  },
  { name: 'React',      color: '#61DAFB', percentage: 4  },
  { name: 'Tailwind',   color: '#38B2AC', percentage: 2  },
  { name: 'Spring Boot',color: '#6DB33F', percentage: 1  },
];

// ─── 6. Static Tech Distribution ─────────────────────────────────────────────
export interface TechEntry {
  name: string;
  color: string;
  value: number;
}

export const TECH_DISTRIBUTION: TechEntry[] = [
  { name: 'React',          color: '#61DAFB', value: 22 },
  { name: 'TypeScript',     color: '#3178C6', value: 18 },
  { name: 'Python',         color: '#3776AB', value: 14 },
  { name: 'JavaScript',     color: '#F7DF1E', value: 12 },
  { name: 'Java',           color: '#ED8B00', value: 10 },
  { name: 'TailwindCSS',    color: '#38B2AC', value: 8  },
  { name: 'PostgreSQL',     color: '#336791', value: 6  },
  { name: 'Django',         color: '#092E20', value: 4  },
  { name: 'Spring Boot',    color: '#6DB33F', value: 3  },
  { name: 'Docker',         color: '#2496ED', value: 2  },
  { name: 'GitHub Actions', color: '#2088FF', value: 1  },
];
