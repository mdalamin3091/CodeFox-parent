import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EmbeddingStatus } from "../types";

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return days < 30 ? `${days}d ago` : `${Math.floor(days / 30)}mo ago`;
}

interface EmbeddingBannerProps {
  status: EmbeddingStatus | null;
  embeddedAt: string | null;
}

export function EmbeddingBanner({ status, embeddedAt }: EmbeddingBannerProps) {
  if (!status) return null;

  const configs = {
    pending: {
      icon: <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />,
      label: "Indexing queued",
      sub: "Your repository is waiting to be indexed for AI analysis.",
      cls: "border-blue-100 bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-400",
    },
    processing: {
      icon: <Loader2 className="h-4 w-4 animate-spin flex-shrink-0" />,
      label: "Indexing in progress…",
      sub: "Embedding repository files for AI-powered code analysis. This may take a few minutes.",
      cls: "border-blue-100 bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-400",
    },
    completed: {
      icon: <CheckCircle2 className="h-4 w-4 flex-shrink-0" />,
      label: "Repository indexed · AI reviews active",
      sub: embeddedAt ? `Indexed ${timeAgo(embeddedAt)}` : undefined,
      cls: "border-green-100 bg-green-50 text-green-700 dark:bg-green-950/20 dark:border-green-900 dark:text-green-400",
    },
    failed: {
      icon: <XCircle className="h-4 w-4 flex-shrink-0" />,
      label: "Indexing failed",
      sub: "AI reviews will still run but may lack full context.",
      cls: "border-red-100 bg-red-50 text-red-700 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400",
    },
  } as const;

  const c = configs[status];

  return (
    <div className={cn("flex items-start gap-3 rounded-xl border px-4 py-3 text-sm", c.cls)}>
      {c.icon}
      <div>
        <p className="font-medium">{c.label}</p>
        {c.sub && <p className="text-xs opacity-75 mt-0.5">{c.sub}</p>}
      </div>
    </div>
  );
}
