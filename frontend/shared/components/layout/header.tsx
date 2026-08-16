"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { UserMenu } from "@/shared/components/user-menu";
import { ThemeToggle } from "./theme-toggle";

function resolveTitle(pathname: string): string {
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname === "/repos") return "Repositories";
  if (/^\/repos\/[^/]+\/pulls\/\d+/.test(pathname)) return "Pull Request Review";
  if (/^\/repos\/[^/]+/.test(pathname)) return "Repository";
  return "CodeFox";
}

export function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 lg:px-5">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-100 transition-colors lg:hidden"
        >
          <Menu className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {resolveTitle(pathname)}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
