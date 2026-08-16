export type Severity = "high" | "medium" | "low";
export type Verdict = "APPROVE" | "REQUEST_CHANGES" | "COMMENT";

export interface ReviewIssue {
  file: string;
  line?: number;
  severity: Severity;
  comment?: string;
}

export interface InlineComment {
  path: string;
  line: number;
  severity: Severity;
  title: string;
  body: string;
  proposedFix?: string;
  suggestion?: string;
  agentPrompt?: string;
}

export interface ReviewData {
  summary: string;
  verdict: Verdict;
  issues: ReviewIssue[];
  inlineComments: InlineComment[];
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  state: string;
  merged: boolean;
  htmlUrl: string;
  headRef: string;
  baseRef: string;
  authorLogin: string;
  authorAvatarUrl: string | null;
  additions: number;
  deletions: number;
  changedFiles: number;
  analysisStatus: string | null;
  relevantFiles: Array<{ filePath: string; score: number }> | null;
  reviewStatus: string | null;
  reviewBody: string | null;
  reviewData: ReviewData | null;
  reviewError: string | null;
  githubReviewId: string | null;
  createdAt: string;
  mergedAt: string | null;
  closedAt: string | null;
}
