import { useQuery } from "@tanstack/react-query";
import { fetchRepos } from "../api";

export function useRepos(params: URLSearchParams) {
  return useQuery({
    queryKey: ["repos", params.toString()],
    queryFn: () => fetchRepos(params),
    staleTime: 2 * 60_000,
    refetchInterval: (q) => {
      const busy = (q.state.data?.repos ?? []).some(
        (r) => r.embeddingStatus === "pending" || r.embeddingStatus === "processing"
      );
      return busy ? 5000 : false;
    },
  });
}
