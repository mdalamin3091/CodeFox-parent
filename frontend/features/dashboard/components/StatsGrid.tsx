"use client";

import { GitBranch, Plug, CheckCircle2 } from "lucide-react";
import { StatCard } from "./StatCard";
import { useDashboardData } from "../hooks/useDashboardData";

export function StatsGrid() {
  const { totalRepos, connectedRepos, indexedCount } = useDashboardData();

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <StatCard
        label="Total Repositories"
        value={totalRepos}
        icon={GitBranch}
        accent="bg-orange-50 dark:bg-orange-950/40 text-orange-500"
      />
      <StatCard
        label="Connected Repos"
        value={connectedRepos.length}
        icon={Plug}
        accent="bg-green-50 dark:bg-green-950/40 text-green-500"
      />
      <StatCard
        label="Indexed"
        value={indexedCount}
        icon={CheckCircle2}
        accent="bg-blue-50 dark:bg-blue-950/40 text-blue-500"
      />
    </div>
  );
}
