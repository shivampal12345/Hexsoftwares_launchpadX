export const queryKeys = {
  startups: ['startups'] as const,
  startup: (id: string) => ['startups', id] as const,
  stats: ['stats'] as const,
  dashboard: ['dashboard'] as const,
};
