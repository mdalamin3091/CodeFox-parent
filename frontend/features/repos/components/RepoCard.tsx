"use client";

import Link from "next/link";
import {
  Star, GitFork, ExternalLink, ArrowRight,
  XCircle, GitBranch, Lock, Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { EmbeddingDot } from "./EmbeddingDot";
import type { Repo } from "../types";

const LANG_COLOR: Record<string, string> = {
  TypeScript: "#3178c6", JavaScript: "#f1e05a", Python: "#3572A5",
  Go: "#00ADD8", Rust: "#dea584", Java: "#b07219", "C++": "#f34b7d",
  Ruby: "#701516", PHP: "#4F5D95", Swift: "#F05138", Kotlin: "#A97BFF",
  CSS: "#563d7c", HTML: "#e34c26", Shell: "#89e051", Vue: "#41b883",
};

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days < 30 ? `${days}d ago` : `${Math.floor(days / 30)}mo ago`;
}

interface RepoCardProps {
  repo: Repo;
  onConnect: (id: string) => void;
  onRequestDisconnect: (repo: Repo) => void;
  isPending: boolean;
}

export function RepoCard({ repo, onConnect, onRequestDisconnect, isPending }: RepoCardProps) {
  const langColor = repo.language ? (LANG_COLOR[repo.language] ?? "#8b949e") : null;

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border bg-white dark:bg-gray-900 shadow-sm transition-all duration-150 hover:shadow-md",
        repo.connected
          ? "border-orange-200 dark:border-orange-900/50"
          : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
      )}
    >
      {/* Header */}
      <div className="p-4 flex-1 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <EmbeddingDot status={repo.embeddingStatus} />
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
              {repo.name}
            </p>
            {repo.private && <Lock className="h-3 w-3 text-gray-400 flex-shrink-0" />}
            {repo.connected && (
              <span className="flex-shrink-0 inline-flex h-1.5 w-1.5 rounded-full bg-orange-400" />
            )}
          </div>
          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-gray-300 hover:text-gray-600 dark:hover:text-gray-300 transition-colors flex-shrink-0"
            aria-label="Open on GitHub"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {repo.description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed">
            {repo.description}
          </p>
        )}

        {repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {repo.topics.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-block rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px] text-gray-500 dark:text-gray-400"
              >
                {t}
              </span>
            ))}
            {repo.topics.length > 3 && (
              <span className="text-[10px] text-gray-400">+{repo.topics.length - 3}</span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-3 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <div className="flex items-center gap-3">
            {langColor && (
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: langColor }}
                />
                {repo.language}
              </span>
            )}
            {repo.starCount > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {repo.starCount.toLocaleString()}
              </span>
            )}
            {repo.forkCount > 0 && (
              <span className="flex items-center gap-1">
                <GitFork className="h-3 w-3" />
                {repo.forkCount.toLocaleString()}
              </span>
            )}
          </div>
          {repo.pushedAt && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo(repo.pushedAt)}
            </span>
          )}
        </div>

        <div className="border-t border-gray-50 dark:border-gray-800 pt-2.5">
          {repo.connected ? (
            <div className="flex items-center gap-1">
              <Link href={`/repos/${repo.id}`} className="flex-1">
                <Button
                  size="sm"
                  className="h-8 w-full text-xs gap-1.5 bg-orange-500 hover:bg-orange-600 text-white"
                >
                  View details <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 px-2 text-xs text-gray-400 hover:text-destructive hover:bg-destructive/10"
                disabled={isPending}
                onClick={() => onRequestDisconnect(repo)}
                title="Disconnect webhook"
              >
                <XCircle className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-full text-xs gap-1.5"
              disabled={isPending}
              onClick={() => onConnect(repo.id)}
            >
              <GitBranch className="h-3 w-3" />
              Connect
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
