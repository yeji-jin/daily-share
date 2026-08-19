import { QUERY_KEYS } from "@/lib/constants";
import { updateComment } from "@/lib/services/comment";
import { CommentInfo } from "@/types/comment";
import { UseMutationCallback } from "@/types/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateComment(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComment,
    onSuccess: (updatedComment) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      queryClient.setQueryData<CommentInfo[]>(
        QUERY_KEYS.comment.post(updatedComment.post_id),
        (comments) => {
          if (!comments) throw new Error("댓글이 캐시데이터에 보관되어있지 않습니다");
          return comments.map((comment) => {
            if (comment.id === updatedComment.id) return { ...comment, ...updatedComment };
            return comment;
          });
        },
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
