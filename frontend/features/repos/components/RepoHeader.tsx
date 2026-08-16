import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, GitFork, ExternalLink } from "lucide-react";
import type { Repo } from "../types";

export function RepoHeader({ repo }: { repo: Repo }) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-5 py-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base font-bold text-gray-900 dark:text-gray-100">
              {repo.fullName}
            </h1>
            {repo.private && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">Private</Badge>
            )}
            {repo.fork && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">Fork</Badge>
            )}
          </div>
          {repo.description && (
            <p className="text-xs text-gray-400 mt-1">{repo.description}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
            {repo.language && <span>{repo.language}</span>}
            {repo.starCount > 0 && (
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" /> {repo.starCount.toLocaleString()}
              </span>
            )}
            {repo.forkCount > 0 && (
              <span className="flex items-center gap-1">
                <GitFork className="h-3 w-3" /> {repo.forkCount.toLocaleString()}
              </span>
            )}
            {repo.topics.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-[10px]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <a href={repo.htmlUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
            <ExternalLink className="h-3 w-3" /> GitHub
          </Button>
        </a>
      </div>
    </div>
  );
}
