"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Loader2, ChevronLeft, GitPullRequest, AlertCircle,
  AlertTriangle, MessageSquare, FileSearch,
} from "lucide-react";
import { queryKeys } from "@/lib/query-keys";
import { fetchPullRequests } from "@/features/pull-requests/api";
import {
  PRHeader,
  VerdictCard,
  TabBar,
  IssuesTab,
  CommentsTab,
  ContextTab,
} from "@/features/pull-requests";

type TabKey = "issues" | "comments" | "context";

interface Props {
  repoId: string;
  prNumber: number;
}

export function PRReviewClient({ repoId, prNumber }: Props) {
  const [activeTab, setActiveTab] = useState<TabKey>("issues");

  const { data: prs } = useSuspenseQuery({
    queryKey: queryKeys.pullRequests(repoId),
    queryFn: () => fetchPullRequests(repoId),
    refetchInterval: (q) => {
      const busy = (q.state.data ?? []).some(
        (pr) => pr.reviewStatus === "processing" || pr.analysisStatus === "processing"
      );
      return busy ? 5000 : false;
    },
  });

  const pr = prs?.find((p) => p.number === prNumber);

  if (!pr) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6 lg:px-6">
        <p className="text-sm text-gray-400">Pull request not found.</p>
        <Link href={`/repos/${repoId}`}>
          <Button variant="outline" size="sm" className="mt-4">Back</Button>
        </Link>
      </div>
    );
  }

  const issues         = pr.reviewData?.issues ?? [];
  const inlineComments = pr.reviewData?.inlineComments ?? [];
  const contextFiles   = pr.relevantFiles ?? [];

  const tabs = [
    { key: "issues",   label: "Issues",   icon: AlertTriangle, count: issues.length },
    { key: "comments", label: "Comments", icon: MessageSquare, count: inlineComments.length },
    { key: "context",  label: "Context",  icon: FileSearch,    count: contextFiles.length },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 lg:px-6 space-y-5">
      <Link
        href={`/repos/${repoId}`}
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
      >
        <ChevronLeft className="h-3.5 w-3.5" /> Back to repository
      </Link>

      <PRHeader pr={pr} />

      {pr.reviewStatus === "processing" && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 dark:bg-blue-950/20 dark:border-blue-900 px-4 py-3 text-sm text-blue-700 dark:text-blue-400">
          <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />
          AI review in progress…
        </div>
      )}

      {pr.reviewStatus === "failed" && (
        <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50 dark:bg-red-950/20 dark:border-red-900 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          Review failed: {pr.reviewError ?? "unknown error"}
        </div>
      )}

      {!pr.reviewStatus && (
        <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-10 text-center">
          <GitPullRequest className="mx-auto h-7 w-7 text-gray-300 dark:text-gray-600 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No review yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Reviews are generated automatically when a PR is opened.
          </p>
        </div>
      )}

      {pr.reviewData && (
        <VerdictCard verdict={pr.reviewData.verdict} summary={pr.reviewData.summary} />
      )}

      {pr.reviewStatus === "completed" && (
        <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <TabBar
            tabs={tabs}
            active={activeTab}
            onChange={(k) => setActiveTab(k as TabKey)}
          />
          <div className="p-4">
            {activeTab === "issues"   && <IssuesTab   issues={issues} />}
            {activeTab === "comments" && <CommentsTab inlineComments={inlineComments} />}
            {activeTab === "context"  && <ContextTab  files={contextFiles} />}
          </div>
        </div>
      )}
    </div>
  );
}
