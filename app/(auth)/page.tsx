"use client";

import { useUser } from "@/stores/session";
import { useProfileData } from "@/hooks/queries/use-profile-data";
import { LoadingDots } from "@/components/ui/loading-dots";

export default function Home() {
  const user = useUser();
  const { data: profile, isLoading } = useProfileData(user?.id);

  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <LoadingDots />
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <h2>root</h2>
      {profile && <p>{profile.nickname}</p>}
    </div>
  );
}
