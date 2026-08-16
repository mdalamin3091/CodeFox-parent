import { cn } from "@/lib/utils";
import type { Verdict } from "../types";

const VERDICT_MAP: Record<Verdict, string> = {
  APPROVE:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800",
  REQUEST_CHANGES:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800",
  COMMENT:
    "bg-gray-50 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700",
};

const VERDICT_LABEL: Record<Verdict, string> = {
  APPROVE: "Approved",
  REQUEST_CHANGES: "Changes requested",
  COMMENT: "Commented",
};

export function VerdictBadge({ verdict }: { verdict: Verdict }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium",
        VERDICT_MAP[verdict]
      )}
    >
      {VERDICT_LABEL[verdict]}
    </span>
  );
}
