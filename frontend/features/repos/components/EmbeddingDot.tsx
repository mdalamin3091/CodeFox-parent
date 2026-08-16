import { cn } from "@/lib/utils";
import type { EmbeddingStatus } from "../types";

const STATUS_MAP: Record<EmbeddingStatus, string> = {
  pending:    "bg-amber-400",
  processing: "bg-blue-400 animate-pulse",
  completed:  "bg-green-400",
  failed:     "bg-red-400",
};

export function EmbeddingDot({ status }: { status: EmbeddingStatus | null }) {
  if (!status) return null;
  return (
    <span
      className={cn("inline-block h-1.5 w-1.5 rounded-full flex-shrink-0", STATUS_MAP[status])}
      title={`Indexing: ${status}`}
    />
  );
}
