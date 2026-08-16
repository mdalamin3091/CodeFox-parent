import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { queryKeys } from "@/lib/query-keys";
import { serverFetchRepos } from "@/lib/api/server";
import { ReposPageClient } from "./_components/ReposPageClient";

export const dynamic = "force-dynamic";

export default async function ReposPage() {
  const queryClient = getQueryClient();

  const defaultParams = new URLSearchParams({
    page: "1", per_page: "24",
    sort: "updated", order: "desc",
    fork: "all", private: "all",
  });

  void queryClient.prefetchQuery({
    queryKey: queryKeys.repos(defaultParams.toString()),
    queryFn: () => serverFetchRepos(defaultParams),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ReposPageClient />
    </HydrationBoundary>
  );
}
