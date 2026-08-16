import { useQuery } from "@tanstack/react-query";
import { fetchRepo } from "../api";

export function useRepo(id: string) {
  return useQuery({
    queryKey: ["repo", id],
    queryFn: () => fetchRepo(id),
    refetchInterval: (q) => {
      const s = q.state.data?.embeddingStatus;
      return s === "pending" || s === "processing" ? 5000 : false;
    },
  });
}
