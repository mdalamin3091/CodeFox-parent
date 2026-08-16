import { cn } from "@/lib/utils";

interface Tab {
  key: string;
  label: string;
  icon: React.ElementType;
  count?: number;
}

interface TabBarProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
}

export function TabBar({ tabs, active, onChange }: TabBarProps) {
  return (
    <div className="flex items-center gap-0.5 border-b border-gray-100 dark:border-gray-800">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              "relative flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors focus-visible:outline-none",
              isActive
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            )}
          >
            <Icon className="h-3.5 w-3.5 flex-shrink-0" />
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold min-w-[18px]",
                  isActive
                    ? "bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900"
                    : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-orange-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}
