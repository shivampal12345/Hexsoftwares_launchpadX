'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { CampaignInvestment, CampaignInvestmentSummary, Investment, PlatformStats, Startup } from '@/types';

async function fetchStartups(): Promise<Startup[]> {
  const response = await fetch('/api/startups');
  if (!response.ok) {
    throw new Error('Failed to load startups.');
  }
  const result = (await response.json()) as { data: Startup[] };
  return result.data.map((startup) => ({
    ...startup,
    id: startup._id,
  }));
}

async function fetchStartup(id: string): Promise<Startup> {
  const response = await fetch(`/api/startups/${id}`);
  if (!response.ok) {
    throw new Error('Failed to load startup.');
  }
  const result = (await response.json()) as { data: Startup };
  return {
    ...result.data,
    id: result.data._id,
  };
}

async function fetchPlatformStats(): Promise<PlatformStats> {
  const response = await fetch('/api/stats');
  if (!response.ok) {
    throw new Error('Failed to load platform stats.');
  }
  const result = await response.json();
  return result.data;
}

export function useStartups() {
  return useQuery({
    queryKey: queryKeys.startups,
    queryFn: fetchStartups,
  });
}

export function useStartup(id: string, initialData?: Startup) {
  return useQuery({
    queryKey: queryKeys.startup(id),
    queryFn: () => fetchStartup(id),
    initialData,
    enabled: Boolean(id),
  });
}

export function usePlatformStats() {
  return useQuery({
    queryKey: queryKeys.stats,
    queryFn: fetchPlatformStats,
  });
}

async function fetchDashboardSummary() {
  const response = await fetch('/api/dashboard');
  if (!response.ok) {
    throw new Error('Failed to load dashboard summary.');
  }
  const result = await response.json();
  return result.data as {
    draftCampaigns: number;
    awaitingReview: number;
    readyToLaunch: number;
  };
}

export function useDashboardSummary() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: fetchDashboardSummary,
  });
}

async function fetchMyInvestments(): Promise<Investment[]> {
  const response = await fetch('/api/investments');
  if (response.status === 401) {
    return [];
  }

  if (!response.ok) {
    throw new Error('Failed to load investments.');
  }

  return response.json() as Promise<Investment[]>;
}

export function useMyInvestments(enabled = true) {
  return useQuery({
    queryKey: ['investments', 'me'],
    queryFn: fetchMyInvestments,
    enabled,
  });
}

async function fetchCampaignInvestments(id: string): Promise<{
  data: CampaignInvestment[];
  summary: CampaignInvestmentSummary;
}> {
  const response = await fetch(`/api/startups/${id}/investments`);
  if (!response.ok) {
    throw new Error('Failed to load campaign investments.');
  }

  return response.json() as Promise<{
    data: CampaignInvestment[];
    summary: CampaignInvestmentSummary;
  }>;
}

export function useCampaignInvestments(id: string) {
  return useQuery({
    queryKey: ['startups', id, 'investments'],
    queryFn: () => fetchCampaignInvestments(id),
    enabled: Boolean(id),
  });
}
