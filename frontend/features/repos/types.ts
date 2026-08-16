export type EmbeddingStatus = "pending" | "processing" | "completed" | "failed";

export interface Repo {
  id: string;
  githubId: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  private: boolean;
  fork: boolean;
  language: string | null;
  starCount: number;
  forkCount: number;
  openIssues: number;
  defaultBranch: string;
  topics: string[];
  pushedAt: string | null;
  connected: boolean;
  connectedAt: string | null;
  embeddingStatus: EmbeddingStatus | null;
  embeddedAt: string | null;
  embeddingError: string | null;
}

export interface ReposResponse {
  repos: Repo[];
  pagination: { total: number; page: number; per_page: number; total_pages: number };
}
