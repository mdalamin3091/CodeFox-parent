import Link from "next/link";
import { GitPullRequest, Loader2, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { VerdictBadge } from "./VerdictBadge";
import type { PullRequest } from "../types";

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days < 30 ? `${days}d ago` : `${Math.floor(days / 30)}mo ago`;
}

export function PRRow({ pr, repoId }: { pr: PullRequest; repoId: string }) {
  const verdict = pr.reviewData?.verdict;
  const issues  = pr.reviewData?.issues ?? [];
  const highs   = issues.filter((i) => i.severity === "high").length;

  return (
    <Link
      href={`/repos/${repoId}/pulls/${pr.number}`}
      className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all group"
    >
      <div
        className={cn(
          "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full",
          pr.merged
            ? "bg-purple-100 dark:bg-purple-900/30"
            : pr.state === "open"
            ? "bg-green-100 dark:bg-green-900/30"
            : "bg-red-100 dark:bg-red-900/30"
        )}
      >
        <GitPullRequest
          className={cn(
            "h-3 w-3",
            pr.merged
              ? "text-purple-600 dark:text-purple-400"
              : pr.state === "open"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          )}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {pr.title}
          </p>
          {verdict && <VerdictBadge verdict={verdict} />}
        </div>
        <div className="flex items-center gap-3 mt-0.5 text-[11px] text-gray-400">
          <span>#{pr.number}</span>
          <span className="text-green-500">+{pr.additions}</span>
          <span className="text-red-400">−{pr.deletions}</span>
          <span>{pr.changedFiles} files</span>
          {pr.reviewStatus === "processing" && (
            <span className="flex items-center gap-1 text-blue-500">
              <Loader2 className="h-3 w-3 animate-spin" /> Reviewing…
            </span>
          )}
          {pr.reviewStatus === "completed" && highs > 0 && (
            <span className="text-red-500">{highs} high issue{highs > 1 ? "s" : ""}</span>
          )}
          {pr.reviewStatus === "completed" && issues.length === 0 && (
            <span className="text-green-500">No issues</span>
          )}
          <span className="flex items-center gap-1 ml-auto">
            <Clock className="h-3 w-3" /> {timeAgo(pr.createdAt)}
          </span>
        </div>
      </div>

      <ArrowRight className="h-3.5 w-3.5 text-gray-200 dark:text-gray-700 group-hover:text-gray-400 transition-colors flex-shrink-0" />
    </Link>
  );
}
