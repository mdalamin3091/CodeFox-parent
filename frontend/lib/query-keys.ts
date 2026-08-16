export const queryKeys = {
  reposSummary: ()               => ["repos-summary"]  as const,
  repos:        (params: string) => ["repos", params]  as const,
  repo:         (id: string)     => ["repo", id]       as const,
  pullRequests: (repoId: string) => ["prs", repoId]    as const,
};
