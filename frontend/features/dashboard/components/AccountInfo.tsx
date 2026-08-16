"use client";

import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";

export function AccountInfo() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  if (!user) return null;

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Account</h2>
      <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 divide-y divide-gray-50 dark:divide-gray-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs text-gray-500">Name</span>
          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs text-gray-500">Email</span>
          <span className="text-xs font-medium text-gray-900 dark:text-gray-100">{user.email}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-xs text-gray-500">Auth provider</span>
          <Badge variant="secondary" className="text-[10px]">GitHub OAuth</Badge>
        </div>
      </div>
    </div>
  );
}
