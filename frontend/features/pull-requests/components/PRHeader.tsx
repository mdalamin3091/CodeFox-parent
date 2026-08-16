import { Button } from "@/components/ui/button";
import { GitPullRequest, ExternalLink, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
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

export function PRHeader({ pr }: { pr: PullRequest }) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-5 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                pr.merged
                  ? "bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400"
                  : pr.state === "open"
                  ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
              )}
            >
              <GitPullRequest className="h-3 w-3" />
              {pr.merged ? "Merged" : pr.state === "open" ? "Open" : "Closed"}
            </span>
            <span className="text-xs text-gray-400">#{pr.number}</span>
          </div>
          <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">{pr.title}</h1>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-400 flex-wrap">
            {pr.authorAvatarUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pr.authorAvatarUrl} alt={pr.authorLogin} className="h-4 w-4 rounded-full" />
            )}
            <span>{pr.authorLogin}</span>
            <span>{pr.headRef} → {pr.baseRef}</span>
            <span className="text-green-500">+{pr.additions}</span>
            <span className="text-red-400">−{pr.deletions}</span>
            <span>{pr.changedFiles} files</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> {timeAgo(pr.createdAt)}
            </span>
          </div>
        </div>
        <a href={pr.htmlUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <ExternalLink className="h-3 w-3" /> GitHub
          </Button>
        </a>
      </div>
    </div>
  );
}
