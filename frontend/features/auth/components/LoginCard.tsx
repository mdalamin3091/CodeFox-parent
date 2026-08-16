"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const GITHUB_ICON = (
  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export function LoginCard() {
  async function handleGitHubSignIn() {
    const res = await authClient.signIn.social({
      provider: "github",
      callbackURL: "/dashboard",
    });
    const url = (res as { data?: { url?: string } })?.data?.url;
    if (url) window.location.href = url;
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-white text-xl font-bold shadow-lg">
          CF
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Welcome to CodeFox
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sign in to start reviewing your pull requests
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm space-y-4">
        <Button className="w-full gap-2 h-10" onClick={handleGitHubSignIn}>
          {GITHUB_ICON}
          Continue with GitHub
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100 dark:border-gray-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-gray-900 px-3 text-[11px] text-gray-400">
              Secure OAuth · No password stored
            </span>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
          By signing in you agree to our terms of service and privacy policy. Your code is never
          stored on our servers.
        </p>
      </div>

      <p className="text-center text-xs text-gray-400">
        <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
