export const dynamic = "force-dynamic";

import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import { queryKeys } from "@/lib/query-keys";
import { serverFetchReposSummary } from "@/lib/api/server";
import { StatsGrid, ConnectedReposList, AccountInfo } from "@/features/dashboard";
import { DashboardGreeting } from "./_components/DashboardGreeting";

function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    </>
  );
}

export default async function DashboardPage() {
  const queryClient = getQueryClient();

  // void — non-blocking: server streams HTML immediately, data arrives via RSC stream
  void queryClient.prefetchQuery({
    queryKey: queryKeys.reposSummary(),
    queryFn: serverFetchReposSummary,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6 space-y-7">
        <DashboardGreeting />
        <Suspense fallback={<DashboardSkeleton />}>
          <StatsGrid />
          <ConnectedReposList />
        </Suspense>
        <AccountInfo />
      </div>
    </HydrationBoundary>
  );
}
