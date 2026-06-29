// ─── GitHub Data Hooks ────────────────────────────────────────────────────────
import { useState, useEffect } from 'react';
import {
  getGithubOverview,
  getContributionGraph,
  getRecentRepos,
  getRecentActivity,
  getDailyContributions,
  type GithubOverview,
  type WeeklyContribution,
  type GithubRepo,
  type GithubEvent,
  type DailyContribution,
} from '../services/github';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(fetcher: () => Promise<T>, key: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, loading: true, error: null });
    fetcher()
      .then((data) => {
        if (!cancelled) setState({ data, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled)
          setState({ data: null, loading: false, error: String(err?.message ?? err) });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return state;
}

export function useGithubStats(): FetchState<GithubOverview> {
  return useFetch(getGithubOverview, 'overview');
}

export function useContributionGraph(): FetchState<WeeklyContribution[]> {
  return useFetch(getContributionGraph, 'contribution-graph');
}

export function useRecentRepos(): FetchState<GithubRepo[]> {
  return useFetch(getRecentRepos, 'repos');
}

export function useRecentActivity(): FetchState<GithubEvent[]> {
  return useFetch(getRecentActivity, 'activity');
}

export function useDailyContributions(): FetchState<DailyContribution[]> {
  return useFetch(getDailyContributions, 'daily-contributions');
}
