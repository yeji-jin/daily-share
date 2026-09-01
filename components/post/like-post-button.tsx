"use client";

import useTogglePostLike from "@/hooks/mutations/post/use-toggle-post-like";
import { showErrorToast } from "@/lib/error";
import { useUser } from "@/stores/session";
import { HeartIcon } from "lucide-react";

type LikeButtonProps = {
  id: number;
  likeCount: number;
  isLiked: boolean;
};

export default function LikePostButton({ id, likeCount, isLiked }: LikeButtonProps) {
  const user = useUser();
  const { mutate: togglePostLike } = useTogglePostLike({
    onError: (error) => showErrorToast(error),
  });

  const handleLikeClick = () => {
    if (!user) return;
    togglePostLike({ postId: id, userId: user.id });
  };

  return (
    <div
      onClick={handleLikeClick}
      className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-xl border p-2 px-4 text-sm"
    >
      <HeartIcon className={`h-4 w-4 ${isLiked && "fill-foreground border-foreground"}`} />
      <span>{likeCount}</span>
    </div>
  );
}
