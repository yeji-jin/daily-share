import CommentEditor from "@/components/comment/comment-editor";
import CommentList from "@/components/comment/comment-list";
import PostItem from "@/components/post/post-item";

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);

  return (
    <div className="flex flex-1 flex-col">
      <PostItem postId={postId} type="DETAIL" />
      <div className="flex flex-col gap-4">
        <p className="font-medium">댓글</p>
        <CommentEditor type="CREATE" postId={postId} />
      </div>
      <CommentList postId={postId} />
    </div>
  );
}
