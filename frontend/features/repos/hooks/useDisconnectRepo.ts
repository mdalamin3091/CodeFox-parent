import { useMutation, useQueryClient } from "@tanstack/react-query";
import { disconnectRepo } from "../api";

export function useDisconnectRepo(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, keepContext }: { id: string; keepContext: boolean }) =>
      disconnectRepo(id, keepContext),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["repos"] });
      onSuccess?.();
    },
  });
}
