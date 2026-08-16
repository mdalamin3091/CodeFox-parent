import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { queryKeys } from "@/lib/query-keys";
import { serverFetchRepo, serverFetchPullRequests } from "@/lib/api/server";
import { RepoDetailClient } from "./_components/RepoDetailClient";

function RepoDetailSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6 space-y-4">
      <div className="h-4 w-32 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
      <div className="h-28 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
      <div className="h-64 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    </div>
  );
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RepoDetailPage({ params }: Props) {
  const { id } = await params;
  const queryClient = getQueryClient();

  // Parallel non-blocking prefetch — both streams resolve independently
  void Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.repo(id),
      queryFn: () => serverFetchRepo(id),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.pullRequests(id),
      queryFn: () => serverFetchPullRequests(id),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<RepoDetailSkeleton />}>
        <RepoDetailClient id={id} />
      </Suspense>
    </HydrationBoundary>
  );
}
