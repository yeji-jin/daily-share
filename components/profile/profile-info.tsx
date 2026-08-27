"use client";

import { useState } from "react";
import { useProfileData } from "@/hooks/queries/use-profile-data";
import { LoadingDotsFull } from "../ui/loading-dots";
import { ProfileAvatar } from "./profile-avatar";
import { useUser } from "@/stores/session";
import { Button } from "../ui/button";
import dynamic from "next/dynamic";

const ProfileEditorModal = dynamic(() => import("@/components/modal/profile-editor-modal"));

export default function ProfileInfo({ userId }: { userId: string }) {
  const user = useUser();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
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
            setIsEditorOpen(true);
          }}
        >
          프로필 수정
        </Button>
      )}
      {isEditorOpen && <ProfileEditorModal onClose={() => setIsEditorOpen(false)} />}
    </div>
  );
}
