"use client";

import { Suspense, useState, useCallback } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, GitBranch, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { queryKeys } from "@/lib/query-keys";
import { fetchRepos } from "@/features/repos/api";
import {
  RepoCard,
  DisconnectDialog,
  useSyncRepos,
  useConnectRepo,
  useDisconnectRepo,
  type Repo,
} from "@/features/repos";

type SortOption = "updated" | "stars" | "forks" | "name";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "updated", label: "Recent" },
  { value: "stars",   label: "Stars" },
  { value: "forks",   label: "Forks" },
  { value: "name",    label: "A–Z" },
];

function GridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="h-44 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
      ))}
    </div>
  );
}

interface ReposGridProps {
  params: URLSearchParams;
  search: string;
  page: number;
  setPage: (fn: (p: number) => number) => void;
  onConnect: (id: string) => void;
  onRequestDisconnect: (r: Repo) => void;
  isPending: boolean;
}

function ReposGrid({
  params,
  search,
  page,
  setPage,
  onConnect,
  onRequestDisconnect,
  isPending,
}: ReposGridProps) {
  const { data, isFetching } = useSuspenseQuery({
    queryKey: queryKeys.repos(params.toString()),
    queryFn: () => fetchRepos(params),
    staleTime: 2 * 60_000,
    refetchInterval: (q) => {
      const busy = (q.state.data?.repos ?? []).some(
        (r) => r.embeddingStatus === "pending" || r.embeddingStatus === "processing"
      );
      return busy ? 5000 : false;
    },
  });

  if (!data.repos.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-16 text-center">
        <GitBranch className="mx-auto h-8 w-8 text-gray-300 dark:text-gray-600 mb-3" />
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
          No repositories found
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {search ? "Try a different search" : 'Click "Sync" to import from GitHub'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 transition-opacity",
          isFetching ? "opacity-60" : "opacity-100"
        )}
      >
        {data.repos.map((repo) => (
          <RepoCard
            key={repo.id}
            repo={repo}
            onConnect={onConnect}
            onRequestDisconnect={onRequestDisconnect}
            isPending={isPending}
          />
        ))}
      </div>

      {data.pagination.total_pages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-gray-400">
            Page {data.pagination.page} / {data.pagination.total_pages}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm" variant="outline" className="h-8 text-xs"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm" variant="outline" className="h-8 text-xs"
              disabled={page >= data.pagination.total_pages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export function ReposPageClient() {
  const [search, setSearch]           = useState("");
  const [sort, setSort]               = useState<SortOption>("updated");
  const [showForks, setShowForks]     = useState<"all" | "true" | "false">("all");
  const [showPrivate, setShowPrivate] = useState<"all" | "true" | "false">("all");
  const [page, setPage]               = useState(1);
  const [disconnectTarget, setDisconnectTarget] = useState<Repo | null>(null);

  const params = new URLSearchParams({
    page: String(page), per_page: "24",
    sort, order: sort === "name" ? "asc" : "desc",
    fork: showForks, private: showPrivate,
    ...(search && { search }),
  });

  const syncMutation       = useSyncRepos();
  const connectMutation    = useConnectRepo();
  const disconnectMutation = useDisconnectRepo(() => setDisconnectTarget(null));

  const isPending    = connectMutation.isPending || disconnectMutation.isPending;
  const connectError = connectMutation.error?.message ?? disconnectMutation.error?.message ?? null;

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 space-y-5">
      {/* Header — always visible */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400 mt-0.5">Your GitHub repositories</p>
        <Button
          size="sm"
          variant="outline"
          className="gap-2 h-8 text-xs"
          onClick={() => syncMutation.mutate()}
          disabled={syncMutation.isPending}
        >
          <RefreshCw className={cn("h-3 w-3", syncMutation.isPending && "animate-spin")} />
          {syncMutation.isPending ? "Syncing…" : "Sync"}
        </Button>
      </div>

      {/* Banners — always visible */}
      {syncMutation.isSuccess && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900 px-3 py-2 text-xs text-green-700 dark:text-green-400">
          <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
          Synced {syncMutation.data?.synced} repositories.
        </div>
      )}
      {connectError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900 px-3 py-2 text-xs text-red-700 dark:text-red-400">
          <XCircle className="h-3.5 w-3.5 flex-shrink-0" />
          {connectError}
        </div>
      )}

      {/* Filters — always visible */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search repositories…"
          value={search}
          onChange={handleSearch}
          className="h-8 text-xs sm:max-w-56 bg-white dark:bg-gray-900"
        />
        <div className="flex items-center gap-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setSort(opt.value); setPage(1); }}
              className={cn(
                "text-xs px-3 py-1.5 rounded-lg border transition-colors",
                sort === opt.value
                  ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100"
                  : "bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:ml-auto">
          <select
            value={showPrivate}
            onChange={(e) => { setShowPrivate(e.target.value as "all" | "true" | "false"); setPage(1); }}
            className="text-xs h-8 px-2 rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300"
          >
            <option value="all">All</option>
            <option value="false">Public</option>
            <option value="true">Private</option>
          </select>
          <select
            value={showForks}
            onChange={(e) => { setShowForks(e.target.value as "all" | "true" | "false"); setPage(1); }}
            className="text-xs h-8 px-2 rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300"
          >
            <option value="all">All repos</option>
            <option value="false">Sources</option>
            <option value="true">Forks</option>
          </select>
        </div>
      </div>

      {/* Disconnect dialog */}
      {disconnectTarget && (
        <DisconnectDialog
          repoName={disconnectTarget.fullName}
          isPending={disconnectMutation.isPending}
          onConfirm={(keepContext) =>
            disconnectMutation.mutate({ id: disconnectTarget.id, keepContext })
          }
          onClose={() => {
            if (!disconnectMutation.isPending) setDisconnectTarget(null);
          }}
        />
      )}

      {/* Grid — suspends only this section while data loads */}
      <Suspense fallback={<GridSkeleton />}>
        <ReposGrid
          params={params}
          search={search}
          page={page}
          setPage={setPage}
          onConnect={(id) => connectMutation.mutate(id)}
          onRequestDisconnect={(r) => setDisconnectTarget(r)}
          isPending={isPending}
        />
      </Suspense>
    </div>
  );
}
