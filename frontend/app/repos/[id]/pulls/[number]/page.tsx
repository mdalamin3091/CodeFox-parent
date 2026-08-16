import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { queryKeys } from "@/lib/query-keys";
import { serverFetchPullRequests } from "@/lib/api/server";
import { PRReviewClient } from "./_components/PRReviewClient";

function PRReviewSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-6 space-y-4">
      <div className="h-4 w-40 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
      <div className="h-24 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
      <div className="h-64 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    </div>
  );
}

interface Props {
  params: Promise<{ id: string; number: string }>;
}

export default async function PrReviewPage({ params }: Props) {
  const { id: repoId, number: prNumStr } = await params;
  const prNumber = Number(prNumStr);
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery({
    queryKey: queryKeys.pullRequests(repoId),
    queryFn: () => serverFetchPullRequests(repoId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<PRReviewSkeleton />}>
        <PRReviewClient repoId={repoId} prNumber={prNumber} />
      </Suspense>
    </HydrationBoundary>
  );
}
