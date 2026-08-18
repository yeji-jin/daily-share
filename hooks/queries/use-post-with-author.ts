import { usePostData } from "@/hooks/queries/use-post-data";
import { useProfileData } from "@/hooks/queries/use-profile-data";

export function usePostWithAuthor({
  postId,
  type,
}: {
  postId?: number;
  type: "FEED" | "DETAIL";
}) {
  const { data: post } = usePostData({ postId, type });
  const { data: author } = useProfileData(post?.author_id);

  return { post, author };
}
