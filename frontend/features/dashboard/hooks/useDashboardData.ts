import { useSuspenseQuery } from "@tanstack/react-query";
import { fetchReposSummary } from "../api";
import { queryKeys } from "@/lib/query-keys";

export function useDashboardData() {
  const { data } = useSuspenseQuery({
    queryKey: queryKeys.reposSummary(),
    queryFn: fetchReposSummary,
    staleTime: 60_000,
  });

  const repos = data?.repos ?? [];

  return {
    totalRepos: data?.pagination.total ?? 0,
    connectedRepos: repos.filter((r) => r.connected),
    indexedCount: repos.filter((r) => r.embeddingStatus === "completed").length,
  };
}
