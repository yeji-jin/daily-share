"use client";

import { LoadingDots, LoadingDotsFull } from "../ui/loading-dots";
import PostItem from "./post-item";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useInfinitePostsDate } from "@/hooks/queries/use-infinite-posts-data";

export default function PostFeed({ authorId }: { authorId?: string }) {
  const { data, isPending, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfinitePostsDate(authorId);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  if (isPending) return <LoadingDotsFull />;

  const posts = data?.pages.flatMap((page) => page) ?? [];

  if (posts.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 py-20 text-center">
        <p className="text-muted-foreground text-sm">
          등록된 게시글이 없어요
          <br />
          게시글을 작성해보세요 😉
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-10">
      {posts.map((postId) => (
        <PostItem key={postId} postId={postId} />
      ))}
      {isFetchingNextPage && <LoadingDots />}
      <div ref={ref} />
    </div>
  );
}
