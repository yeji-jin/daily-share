import Link from "next/link";
import type { User } from "@supabase/supabase-js";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Header({ user }: { user: User | null }) {
  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          daily-share
        </Link>

        <nav className="flex items-center gap-1">
          <ThemeToggle />
          {user ? (
            <Link href="/profile/me">
              <Avatar className="size-8">
                <AvatarFallback>{user.email?.[0]?.toUpperCase() ?? "U"}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Go to profile</span>
            </Link>
          ) : (
            <Button asChild variant="ghost">
              <Link href="/signin">로그인</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
