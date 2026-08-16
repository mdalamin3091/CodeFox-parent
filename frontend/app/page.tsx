"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GitPullRequest,
  Zap,
  Shield,
  GitBranch,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";

// ─── Feature card data (DRY) ──────────────────────────────────────────────────

const FEATURES = [
  {
    icon: Zap,
    title: "Instant AI Reviews",
    description:
      "Every pull request is automatically reviewed by Gemini AI within seconds of opening.",
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    icon: Shield,
    title: "Security Analysis",
    description:
      "Detects XSS, SQL injection, hardcoded secrets, and other OWASP vulnerabilities automatically.",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: GitBranch,
    title: "Deep Code Context",
    description:
      "Semantic search over your entire codebase gives AI reviewers full context beyond the diff.",
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/30",
  },
];

const CHECKLIST = [
  "Inline comments with fix suggestions",
  "Severity-ranked issue list",
  "Approve / Request Changes verdict",
  "Works on any language",
  "GitHub webhook integration",
  "No password required",
];

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  bg,
}: (typeof FEATURES)[number]) {
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3 shadow-sm hover:shadow-md transition-shadow">
      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const { data: session } = authClient.useSession();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Minimal nav */}
      <nav className="border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-orange-500 text-white text-xs font-bold">
              CF
            </div>
            <span className="font-semibold text-sm tracking-tight text-gray-900 dark:text-gray-100">
              CodeFox
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session?.user ? (
              <Button asChild size="sm">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <Button asChild size="sm" variant="outline">
                <Link href="/login">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <Badge
          variant="secondary"
          className="mb-6 gap-1.5 px-3 py-1 text-xs font-medium"
        >
          <GitPullRequest className="h-3 w-3" />
          AI-Powered Code Review
        </Badge>
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-50 sm:text-6xl">
          Code review,{" "}
          <span className="text-orange-500">supercharged</span>
          <br />
          by AI
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-500 dark:text-gray-400">
          CodeFox connects to your GitHub repositories and automatically reviews
          every pull request — finding bugs, security issues, and improvements
          in seconds.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          {session?.user ? (
            <Button asChild size="lg" className="gap-2 px-8">
              <Link href="/dashboard">
                Go to Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild size="lg" className="gap-2 px-8">
                <Link href="/login">
                  Get started free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="text-sm text-gray-400">
                Sign in with GitHub · No credit card
              </p>
            </>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-4 pb-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </div>
      </section>

      {/* Checklist */}
      <section className="border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-gray-100 mb-10">
            Everything you need to ship better code
          </h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto">
            {CHECKLIST.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                <CheckCircle2 className="h-4 w-4 text-orange-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Ready to review smarter?
        </h2>
        <p className="mt-3 text-gray-500 dark:text-gray-400">
          Connect your first repository in under a minute.
        </p>
        <Button asChild size="lg" className="mt-8 gap-2 px-8">
          <Link href="/login">
            Start for free <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800 py-6 text-center text-xs text-gray-400 dark:text-gray-600">
        © {new Date().getFullYear()} CodeFox · AI-powered code review
      </footer>
    </div>
  );
}
