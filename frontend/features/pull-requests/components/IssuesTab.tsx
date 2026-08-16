import { CheckCircle2 } from "lucide-react";
import { SeverityPill } from "./SeverityPill";
import type { ReviewIssue } from "../types";

export function IssuesTab({ issues }: { issues: ReviewIssue[] }) {
  if (issues.length === 0) {
    return (
      <div className="py-12 text-center">
        <CheckCircle2 className="mx-auto h-7 w-7 text-green-400 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">No issues found</p>
      </div>
    );
  }

  const highs = issues.filter((i) => i.severity === "high").length;
  const mids  = issues.filter((i) => i.severity === "medium").length;
  const lows  = issues.length - highs - mids;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 pt-1">
        {highs > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500 flex-shrink-0" />
            {highs} High
          </span>
        )}
        {mids > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900 px-3 py-1.5 text-xs font-semibold text-orange-700 dark:text-orange-400">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0" />
            {mids} Medium
          </span>
        )}
        {lows > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-100 dark:border-yellow-900 px-3 py-1.5 text-xs font-semibold text-yellow-700 dark:text-yellow-400">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
            {lows} Low
          </span>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm divide-y divide-gray-50 dark:divide-gray-800">
        {issues.map((issue, i) => (
          <div
            key={i}
            className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
          >
            <SeverityPill severity={issue.severity} />
            <div className="min-w-0">
              <p className="text-[11px] font-mono text-gray-400 dark:text-gray-500 truncate">
                {issue.file}
                {issue.line != null && (
                  <span className="text-gray-300 dark:text-gray-600">:{issue.line}</span>
                )}
              </p>
              {issue.comment && (
                <p className="text-xs text-gray-700 dark:text-gray-300 mt-0.5 leading-relaxed">
                  {issue.comment}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
