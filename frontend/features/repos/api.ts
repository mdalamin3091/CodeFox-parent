import type { Repo, ReposResponse } from "./types";

export async function fetchRepos(params: URLSearchParams): Promise<ReposResponse> {
  const res = await fetch(`/api/repos?${params}`);
  if (!res.ok) throw new Error("Failed to fetch repositories");
  return (await res.json()).data;
}

export async function fetchRepo(id: string): Promise<Repo> {
  const res = await fetch(`/api/repos/${id}`);
  if (!res.ok) throw new Error("Repository not found");
  return (await res.json()).data.repo;
}

export async function syncRepos(): Promise<{ synced: number }> {
  const res = await fetch("/api/repos/sync", { method: "POST" });
  if (!res.ok) throw new Error("Sync failed");
  return (await res.json()).data;
}

export async function connectRepo(id: string): Promise<void> {
  const res = await fetch(`/api/repos/${id}/connect`, { method: "POST" });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error((json as { message?: string }).message ?? "Failed to connect");
  }
}

export async function disconnectRepo(id: string, keepContext: boolean): Promise<void> {
  const res = await fetch(`/api/repos/${id}/connect`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keepContext }),
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error((json as { message?: string }).message ?? "Failed to disconnect");
  }
}
