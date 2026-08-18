"use client";

import { useProfileData } from "@/hooks/queries/use-profile-data";
import { LoadingDotsFull } from "../ui/loading-dots";
import { ProfileAvatar } from "./profile-avatar";
import { useUser } from "@/stores/session";
import { Button } from "../ui/button";
import { useModal } from "@/stores/modal";

export default function ProfileInfo({ userId }: { userId: string }) {
  const user = useUser();
  const { open } = useModal();
  const { data: profile, isPending: isFetchingProfilePending } = useProfileData(userId);

  if (isFetchingProfilePending) return <LoadingDotsFull />;

  const isMine = user?.id === userId;

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <ProfileAvatar name={profile?.nickname} avatarUrl={profile?.avatar_url} className="size-36" />
      <div className="flex flex-col items-center gap-2">
        <div className="text-xl font-bold">{profile?.nickname}</div>
        <div className="text-muted-foreground">{profile?.bio}</div>
      </div>
      {isMine && (
        <Button
          size={"lg"}
          className="cursor-pointer"
          onClick={() => {
            open("profileEditor");
          }}
        >
          프로필 수정
        </Button>
      )}
    </div>
  );
}
