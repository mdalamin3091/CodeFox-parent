"use client";

import Link from "next/link";
import { GitBranch, GitPullRequest, ArrowRight, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useDashboardData } from "../hooks/useDashboardData";

export function ConnectedReposList() {
  const { connectedRepos } = useDashboardData();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          Connected Repositories
        </h2>
        <Button asChild variant="ghost" size="sm" className="h-7 text-xs gap-1">
          <Link href="/repos">
            View all <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>

      {connectedRepos.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6 py-10 text-center">
          <GitPullRequest className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            No repositories connected yet
          </p>
          <p className="text-xs text-gray-400 mt-1 mb-4">
            Connect a repository to start receiving AI-powered PR reviews.
          </p>
          <Button asChild size="sm" className="gap-2">
            <Link href="/repos">
              Connect a repository <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {connectedRepos.slice(0, 5).map((repo) => (
            <Link
              key={repo.id}
              href={`/repos/${repo.id}`}
              className="flex items-center justify-between rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-100 dark:bg-gray-800 shrink-0">
                  <GitBranch className="h-3.5 w-3.5 text-gray-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {repo.name}
                  </p>
                  {repo.language && (
                    <p className="text-xs text-gray-400 truncate">{repo.language}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {repo.embeddingStatus === "processing" && (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-500" />
                )}
                {repo.embeddingStatus === "completed" && (
                  <Badge className="text-[10px] bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400 border-green-200 dark:border-green-800 hover:bg-green-50">
                    Indexed
                  </Badge>
                )}
                <ArrowRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
