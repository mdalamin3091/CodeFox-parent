import { CheckCircle2, AlertTriangle, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Verdict } from "../types";

const VERDICT_CONFIG: Record<Verdict, { icon: React.ReactNode; label: string; cls: string }> = {
  APPROVE: {
    icon: <CheckCircle2 className="h-5 w-5" />,
    label: "Approved",
    cls: "border-green-100 bg-green-50 text-green-700 dark:bg-green-950/20 dark:border-green-900 dark:text-green-400",
  },
  REQUEST_CHANGES: {
    icon: <AlertTriangle className="h-5 w-5" />,
    label: "Changes Requested",
    cls: "border-red-100 bg-red-50 text-red-700 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400",
  },
  COMMENT: {
    icon: <MessageSquare className="h-5 w-5" />,
    label: "Commented",
    cls: "border-blue-100 bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-400",
  },
};

export function VerdictCard({ verdict, summary }: { verdict: Verdict; summary: string }) {
  const { icon, label, cls } = VERDICT_CONFIG[verdict];
  return (
    <div className={cn("flex items-start gap-3 rounded-xl border px-4 py-3", cls)}>
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="font-semibold text-sm">{label}</p>
        <p className="text-sm mt-1 leading-relaxed opacity-85">{summary}</p>
      </div>
    </div>
  );
}
