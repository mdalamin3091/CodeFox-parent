"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/repos",     icon: GitBranch,        label: "Repositories" },
] as const;

function NavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
        active
          ? "bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 flex-shrink-0 transition-colors",
          active ? "text-orange-500" : "text-gray-400 dark:text-gray-500"
        )}
      />
      {label}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <aside className="flex h-full w-60 flex-col bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800">
      <div className="flex h-14 items-center gap-3 border-b border-gray-100 dark:border-gray-800 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500 text-white text-xs font-bold flex-shrink-0">
          CF
        </div>
        <span className="font-semibold text-sm tracking-tight text-gray-900 dark:text-gray-100">
          CodeFox
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-600">
          Menu
        </p>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            active={pathname === item.href || pathname.startsWith(item.href + "/")}
          />
        ))}
      </nav>

      {user && (
        <div className="border-t border-gray-100 dark:border-gray-800 p-3">
          <div className="flex items-center gap-2.5 rounded-lg px-2 py-2">
            <Avatar className="h-6 w-6 flex-shrink-0">
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
              <AvatarFallback className="text-[10px] bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-xs font-medium truncate text-gray-900 dark:text-gray-100">
                {user.name}
              </p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
