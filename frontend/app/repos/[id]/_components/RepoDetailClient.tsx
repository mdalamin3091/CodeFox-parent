"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GitPullRequest, ChevronLeft } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import { fetchRepo } from "@/features/repos/api";
import { fetchPullRequests } from "@/features/pull-requests/api";
import { RepoHeader, EmbeddingBanner } from "@/features/repos";
import { PRRow, PRStatsGrid } from "@/features/pull-requests";

interface Props {
  id: string;
}

export function RepoDetailClient({ id }: Props) {
  const { data: repo } = useSuspenseQuery({
    queryKey: queryKeys.repo(id),
    queryFn: () => fetchRepo(id),
    refetchInterval: (q) => {
      const s = q.state.data?.embeddingStatus;
      return s === "pending" || s === "processing" ? 5000 : false;
    },
  });

  const { data: prs } = useSuspenseQuery({
    queryKey: queryKeys.pullRequests(id),
    queryFn: () => fetchPullRequests(id),
    refetchInterval: (q) => {
      const busy = (q.state.data ?? []).some(
        (pr) => pr.reviewStatus === "processing" || pr.analysisStatus === "processing"
      );
      return busy ? 5000 : false;
    },
  });

  // repo is guaranteed non-null for authenticated users (middleware protects route)
  if (!repo) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6">
        <p className="text-sm text-gray-400">Repository not found.</p>
        <Link href="/repos">
          <Button variant="outline" size="sm" className="mt-4">Back</Button>
        </Link>
      </div>
    );
  }

  const totalPrs    = prs?.length ?? 0;
  const openPrs     = prs?.filter((p) => p.state === "open").length ?? 0;
  const reviewedPrs = prs?.filter((p) => p.reviewStatus === "completed").length ?? 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6 space-y-5">
      <Link
        href="/repos"
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> All repositories
      </Link>

      <RepoHeader repo={repo} />
      <EmbeddingBanner status={repo.embeddingStatus} embeddedAt={repo.embeddedAt} />
      <PRStatsGrid total={totalPrs} open={openPrs} reviewed={reviewedPrs} />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Pull Requests</h2>
          {totalPrs > 0 && <span className="text-xs text-gray-400">{totalPrs} total</span>}
        </div>

        {!prs?.length ? (
          <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-10 text-center">
            <GitPullRequest className="mx-auto h-7 w-7 text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No pull requests yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Open a PR on GitHub and it will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {prs.map((pr) => (
              <PRRow key={pr.id} pr={pr} repoId={id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
