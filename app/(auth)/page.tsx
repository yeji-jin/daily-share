"use client";

import { useIsUserLoaded, useUser } from "@/stores/session";
import { useProfileData } from "@/hooks/queries/use-profile-data";
import CreatePostButton from "@/components/post/create-post-button";
import PostFeed from "@/components/post/post-feed";

export default function Home() {
  const user = useUser();
  const isUserLoaded = useIsUserLoaded();
  const { data: profile, isLoading } = useProfileData(user?.id);

  const isProfileReady = isUserLoaded && !isLoading && !!profile;

  return (
    <div className="flex flex-1 flex-col items-center gap-10 bg-white font-sans dark:bg-black">
      {isProfileReady && (
        <>
          <p className="w-full text-lg font-bold">{profile.nickname}님 어서요세요! ☺️</p>
          <CreatePostButton />
        </>
      )}
      <PostFeed />
    </div>
  );
}
