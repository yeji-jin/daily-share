"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { ProfileAvatar } from "@/components/profile/profile-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/services/auth";
import { useProfileData } from "@/hooks/queries/use-profile-data";

export function UserMenu({ user }: { user: User }) {
  const router = useRouter();
  const { data: profile } = useProfileData(user.id);

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <ProfileAvatar name={profile?.nickname} avatarUrl={profile?.avatar_url} className="size-8" />
        <span className="sr-only">사용자 메뉴 열기</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="font-bold **:data-[slot=dropdown-menu-item]:py-2">
        <DropdownMenuItem asChild>
          <Link href={`/profile/${user.id}`}>프로필</Link>
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
