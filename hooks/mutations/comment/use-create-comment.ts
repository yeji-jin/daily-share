import { useProfileData } from "@/hooks/queries/use-profile-data";
import { QUERY_KEYS } from "@/lib/constants";
import { createComment } from "@/lib/services/comment";
import { useUser } from "@/stores/session";
import type { CommentInfo } from "@/types/comment";
import { UseMutationCallback } from "@/types/mutations";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateComment(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();
  const user = useUser();
  const { data: profile } = useProfileData(user?.id);

  return useMutation({
    mutationFn: createComment,
    onSuccess: (newComment) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      queryClient.setQueryData<CommentInfo[]>(
        QUERY_KEYS.comment.post(newComment.post_id),
        (comments) => {
          if (!comments) throw new Error("댓글이 캐시데이터에 보관되어있지 않습니다");
          if (!profile) throw new Error("사용자의 프로필 정보를 찾을 수 없습니다");
          return [{ ...newComment, author: profile }, ...comments];
        },
      );
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
