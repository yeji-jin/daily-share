"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileAvatar } from "@/components/profile/profile-avatar";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { LoadingDots } from "@/components/ui/loading-dots";
import { usePostWithAuthor } from "@/hooks/queries/use-post-with-author";
import { formatTimeAgo } from "@/lib/time";
import { useModal } from "@/stores/modal";
import { useUser } from "@/stores/session";
import LikePostButton from "./like-post-button";
import Link from "next/link";

type PostItemProps = {
  postId: number;
  type?: "FEED" | "DETAIL";
};

export default function PostItem({ postId, type = "FEED" }: PostItemProps) {
  const { open } = useModal();
  const user = useUser();
  const { post, author, isPending } = usePostWithAuthor({ postId, type });

  if (isPending) return <LoadingDots />;
  if (!post)
    return <p className="text-muted-foreground py-10 text-center">게시글을 찾을 수 없어요</p>;

  const isMine = user?.id === post.author_id;

  const handleEditPost = () => {
    open("postEditor", { mode: "edit", postId: post.id });
  };
  const handleDeletePost = () => {
    open("deletePostConfirm", { postId: post.id, userId: post.author_id, type });
  };

  return (
    <div className={`flex flex-col gap-4 pb-8 ${type === "FEED" ? "border-b" : "border-0"}`}>
      <div className="flex justify-between">
        {/* user info */}
        <div className="flex items-start gap-4">
          <Link href={`/profile/${post.author_id}`}>
            <ProfileAvatar name={author?.nickname} avatarUrl={author?.avatar_url} size="lg" />
          </Link>
          <div>
            <div className="font-bold">{author?.nickname}</div>
            <div className="text-muted-foreground text-sm">{formatTimeAgo(post.created_at)}</div>
          </div>
        </div>

        {/* edit, delete */}
        {isMine && (
          <div className="text-muted-foreground flex text-sm">
            <Button onClick={handleEditPost} className="cursor-pointer" variant={"ghost"}>
              수정
            </Button>
            <Button onClick={handleDeletePost} className="cursor-pointer" variant={"ghost"}>
              삭제
            </Button>
          </div>
        )}
      </div>

      {/* contents */}
      <div className={`flex flex-col gap-5 ${type === "FEED" ? "cursor-pointer" : ""}`}>
        {/*content */}
        {type === "FEED" ? (
          <Link href={`/post/${post.id}`}>
            <div className="line-clamp-6 wrap-break-word whitespace-pre-wrap">{post.content}</div>
          </Link>
        ) : (
          <div className="wrap-break-word whitespace-pre-wrap">{post.content}</div>
        )}
        {/* images */}
        <Carousel>
          <CarouselContent>
            {post.image_urls?.map((url, index) => (
              <CarouselItem className="basis-3/5" key={index}>
                <div className="overflow-hidden rounded-xl border shadow-sm">
                  <img src={url} alt="" className="h-full max-h-87.5 w-full object-cover" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      {/* buttons */}
      <div className="flex gap-2">
        {/* like button */}
        <LikePostButton id={post.id} likeCount={post.like_count} isLiked={post.isLiked} />
        {/* comment button */}
        {type === "FEED" && (
          <Link href={`/post/${post.id}`}>
            <div className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded-xl border p-2 px-4 text-sm">
              <MessageCircle className="h-4 w-4" />
              <span>댓글 달기</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
