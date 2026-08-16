import { cn } from "@/lib/utils";

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 text-center shadow-sm">
      <p className={cn("text-2xl font-bold", accent)}>{value}</p>
      <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

interface PRStatsGridProps {
  total: number;
  open: number;
  reviewed: number;
}

export function PRStatsGrid({ total, open, reviewed }: PRStatsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatCard label="Total PRs"   value={total}    accent="text-gray-900 dark:text-gray-100" />
      <StatCard label="Open"        value={open}     accent="text-green-600 dark:text-green-400" />
      <StatCard label="AI Reviewed" value={reviewed} accent="text-orange-500" />
    </div>
  );
}
