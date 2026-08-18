import { usePostData } from "@/hooks/queries/use-post-data";
import { useProfileData } from "@/hooks/queries/use-profile-data";

export function usePostWithAuthor({
  postId,
  type,
}: {
  postId?: number;
  type: "FEED" | "DETAIL";
}) {
  const { data: post, isPending: isPostPending } = usePostData({ postId, type });
  const { data: author, isPending: isAuthorPending } = useProfileData(post?.author_id);

  const isPending = isPostPending || (!!post && isAuthorPending);

  return { post, author, isPending };
}
