"use client";

import { useProfileData } from "@/hooks/queries/use-profile-data";
import { LoadingDotsFull } from "../ui/loading-dots";
import { UserAvatar } from "./user-avatar";

export default function ProfileInfo({ userId }: { userId: string }) {
  const { data: profile, isPending: isFetchingProfilePending } = useProfileData(userId);

  if (isFetchingProfilePending) return <LoadingDotsFull />;

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <UserAvatar name={profile?.nickname} avatarUrl={profile?.avatar_url} className="size-36" />
      <div className="flex flex-col items-center gap-2">
        <div className="text-lg font-bold">{profile?.nickname}</div>
        <div className="text-muted-foreground">{profile?.bio}</div>
      </div>
    </div>
  );
}
