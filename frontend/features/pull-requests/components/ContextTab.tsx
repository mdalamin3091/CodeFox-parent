import { FileCode, FileSearch } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextFile {
  filePath: string;
  score: number;
}

export function ContextTab({ files }: { files: ContextFile[] }) {
  if (files.length === 0) {
    return (
      <div className="py-12 text-center">
        <FileSearch className="mx-auto h-7 w-7 text-gray-300 dark:text-gray-600 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">No context files found</p>
        <p className="text-xs text-gray-400 mt-1">
          Context files appear after repository indexing completes.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm divide-y divide-gray-50 dark:divide-gray-800">
      {files.map((f, i) => {
        const pct = Math.round(f.score * 100);
        return (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
          >
            <FileCode className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
            <span className="text-xs font-mono text-gray-600 dark:text-gray-400 flex-1 truncate">
              {f.filePath}
            </span>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-16 h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full",
                    pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-orange-400" : "bg-gray-400"
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 w-8 text-right">{pct}%</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
