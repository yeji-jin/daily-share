import { usePostsData } from "@/hooks/mutations/post/use-posts-data";
import { LoadingDots } from "../ui/loading-dots";
import PostItem from "./post-item";

export default function PostFeed() {
  const { data: posts, isPending } = usePostsData();

  if (isPending) return <LoadingDots />;

  if (!posts || posts.length === 0) {
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
      {posts.map((post) => (
        <PostItem key={post.id} {...post} />
      ))}
    </div>
  );
}
