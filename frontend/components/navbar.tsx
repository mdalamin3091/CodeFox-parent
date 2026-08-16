"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/user-menu";

export function Navbar() {
  const { data: session } = authClient.useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-primary">🦊</span>
          <span>CodeFox</span>
        </Link>
        <div className="flex items-center gap-4">
          {session?.user && (
            <nav className="hidden sm:flex items-center gap-1">
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-accent transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/repos"
                className="text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-accent transition-colors"
              >
                Repositories
              </Link>
            </nav>
          )}
          {session?.user ? (
            <UserMenu />
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
