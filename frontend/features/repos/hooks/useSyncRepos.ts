import { useMutation, useQueryClient } from "@tanstack/react-query";
import { syncRepos } from "../api";

export function useSyncRepos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: syncRepos,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["repos"] }),
  });
}
