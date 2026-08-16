import type { ReposSummaryResponse } from "./types";

export async function fetchReposSummary(): Promise<ReposSummaryResponse> {
  const res = await fetch("/api/repos?per_page=100&page=1");
  if (!res.ok) throw new Error("Failed to fetch repos summary");
  return (await res.json()).data;
}
