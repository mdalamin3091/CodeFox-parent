import { useQuery } from "@tanstack/react-query";
import { fetchPullRequests } from "../api";

export function usePullRequests(repoId: string, enabled = true) {
  return useQuery({
    queryKey: ["prs", repoId],
    queryFn: () => fetchPullRequests(repoId),
    enabled,
    refetchInterval: (q) => {
      const busy = (q.state.data ?? []).some(
        (pr) => pr.reviewStatus === "processing" || pr.analysisStatus === "processing"
      );
      return busy ? 5000 : false;
    },
  });
}
