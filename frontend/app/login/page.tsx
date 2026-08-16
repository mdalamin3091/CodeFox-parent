import Link from "next/link";
import { LoginCard } from "@/features/auth";
import { ThemeToggle } from "@/shared/components/layout/theme-toggle";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
      {/* Minimal nav */}
      <nav className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4">
        <div className="mx-auto flex h-14 max-w-5xl items-center">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500 text-white text-xs font-bold">
                CF
              </div>
              <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                CodeFox
              </span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Centered card */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <LoginCard />
      </div>
    </div>
  );
}
