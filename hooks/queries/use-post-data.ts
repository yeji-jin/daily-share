import { QUERY_KEYS } from "@/lib/constants";
import { getPost } from "@/lib/services/post";
import { useUser } from "@/stores/session";
import { useQuery } from "@tanstack/react-query";

export function usePostData({ postId, type }: { postId?: number; type: "FEED" | "DETAIL" }) {
  const user = useUser();
  return useQuery({
    queryKey: QUERY_KEYS.post.byId(postId!),
    queryFn: () =>
      getPost({
        postId: postId!,
        userId: user!.id,
      }),
    enabled: type === "DETAIL" && !!postId,
  });
}
