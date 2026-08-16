import { cn } from "@/lib/utils";
import type { Severity } from "../types";

const SEVERITY_STYLES: Record<Severity, string> = {
  high:   "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  medium: "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
  low:    "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
};

export function SeverityPill({ severity }: { severity: Severity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide flex-shrink-0",
        SEVERITY_STYLES[severity]
      )}
    >
      {severity}
    </span>
  );
}
