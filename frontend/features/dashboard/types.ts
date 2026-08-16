export interface DashboardRepo {
  id: string;
  name: string;
  fullName: string;
  language: string | null;
  connected: boolean;
  embeddingStatus: string | null;
}

export interface ReposSummaryResponse {
  repos: DashboardRepo[];
  pagination: { total: number };
}
