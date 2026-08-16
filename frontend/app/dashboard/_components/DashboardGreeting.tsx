"use client";

import { authClient } from "@/lib/auth-client";

export function DashboardGreeting() {
  const { data: session } = authClient.useSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "there";

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
        {greeting}, {firstName} 👋
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
        {new Date().toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      </p>
    </div>
  );
}
