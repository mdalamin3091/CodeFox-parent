import type { PullRequest } from "./types";

export async function fetchPullRequests(repoId: string): Promise<PullRequest[]> {
  const res = await fetch(`/api/repos/${repoId}/pull-requests`);
  if (!res.ok) throw new Error("Failed to fetch pull requests");
  return (await res.json()).data.pullRequests;
}
