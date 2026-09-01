import { QUERY_KEYS } from "@/lib/constants";
import { deleteComment } from "@/lib/services/comment";
import { CommentInfo } from "@/types/comment";
import type { PostWithMeta } from "@/types/post";
import { UseMutationCallback } from "@/types/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useDeleteComment(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteComment,
    onSuccess: (deletedComment) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      queryClient.setQueryData<CommentInfo[]>(
        QUERY_KEYS.comment.post(deletedComment.post_id),
        (comments) => {
          if (!comments) throw new Error("댓글이 캐시데이터에 보관되어있지 않습니다");
          return comments.filter((comment) => comment.id !== deletedComment.id);
        },
      );
      queryClient.setQueryData<PostWithMeta>(
        QUERY_KEYS.post.byId(deletedComment.post_id),
        (post) => (post ? { ...post, commentCount: post.commentCount - 1 } : post),
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
