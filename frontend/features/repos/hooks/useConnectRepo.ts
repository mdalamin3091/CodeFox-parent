import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { connectRepo } from "../api";

export function useConnectRepo() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: connectRepo,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["repos"] });
      router.push(`/repos/${id}`);
    },
  });
}
