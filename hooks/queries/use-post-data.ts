import { QUERY_KEYS } from "@/lib/constants";
import { getPost } from "@/lib/services/post";
import { useQuery } from "@tanstack/react-query";

export function usePostData({ postId, type }: { postId?: number; type: "FEED" | "DETAIL" }) {
  return useQuery({
    queryKey: QUERY_KEYS.post.byId(postId!),
    queryFn: () => getPost(postId!),
    enabled: type === "DETAIL" && !!postId,
  });
}
