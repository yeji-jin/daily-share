import Link from "next/link";
import type { User } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./header/theme-toggle";
import { UserMenu } from "./header/user-menu";

export function Header({ user }: { user: User | null }) {
  return (
    <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold tracking-tight">
          daily-share
        </Link>
        <nav className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <UserMenu user={user} />
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
