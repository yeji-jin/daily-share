import { togglePostLike } from "@/lib/services/post";
import { QUERY_KEYS } from "@/lib/constants";
import { UseMutationCallback } from "@/types/mutations";
import { type PostWithMeta } from "@/types/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useTogglePostLike(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: togglePostLike,
    onMutate: async ({ postId }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.post.byId(postId) });

      const previousPost = queryClient.getQueryData<PostWithMeta>(QUERY_KEYS.post.byId(postId));

      queryClient.setQueryData<PostWithMeta>(QUERY_KEYS.post.byId(postId), (old) => {
        if (!old) return old;
        const isLiked = !old.isLiked;
        return { ...old, isLiked, like_count: old.like_count + (isLiked ? 1 : -1) };
      });

      return { previousPost };
    },
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error, { postId }, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(QUERY_KEYS.post.byId(postId), context.previousPost);
      }
      if (callbacks?.onError) callbacks?.onError(error);
    },
  });
}
