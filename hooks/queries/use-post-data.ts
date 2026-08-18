import { QUERY_KEYS } from "@/lib/constants";
import { getPost } from "@/lib/services/post";
import { useUser } from "@/stores/session";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function usePostData({ postId, type }: { postId?: number; type: "FEED" | "DETAIL" }) {
  const user = useUser();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: QUERY_KEYS.post.byId(postId!),
    queryFn: async () => {
      const post = await getPost({
        postId: postId!,
        userId: user!.id,
      });
      if (post) queryClient.setQueryData(QUERY_KEYS.profile.byId(post.author.id), post.author);
      return post;
    },
    enabled: type === "DETAIL" && postId !== undefined && !!user,
  });
}
