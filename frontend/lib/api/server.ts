import { cookies } from "next/headers";
import type { ReposResponse, Repo } from "@/features/repos";
import type { ReposSummaryResponse } from "@/features/dashboard";
import type { PullRequest } from "@/features/pull-requests";

async function serverFetch<T>(path: string): Promise<T | null> {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("better-auth.session_token");
  const baseUrl = process.env.API_URL ?? "http://localhost:4000";

  const res = await fetch(`${baseUrl}${path}`, {
    headers: {
      ...(sessionToken && {
        Cookie: `better-auth.session_token=${sessionToken.value}`,
      }),
    },
    cache: "no-store",
  });

  if (res.status === 401) return null;
  if (!res.ok) throw new Error(`Server fetch failed: ${res.status} ${path}`);
  return (await res.json()).data as T;
}

export async function serverFetchReposSummary(): Promise<ReposSummaryResponse | null> {
  return serverFetch<ReposSummaryResponse>("/api/repos?per_page=100&page=1");
}

export async function serverFetchRepos(
  params: URLSearchParams
): Promise<ReposResponse | null> {
  return serverFetch<ReposResponse>(`/api/repos?${params}`);
}

export async function serverFetchRepo(id: string): Promise<Repo | null> {
  const data = await serverFetch<{ repo: Repo }>(`/api/repos/${id}`);
  return data?.repo ?? null;
}

export async function serverFetchPullRequests(
  repoId: string
): Promise<PullRequest[] | null> {
  const data = await serverFetch<{ pullRequests: PullRequest[] }>(
    `/api/repos/${repoId}/pull-requests`
  );
  return data?.pullRequests ?? null;
}
