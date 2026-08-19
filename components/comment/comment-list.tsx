"use client";

import { useState } from "react";
import CommentItem from "@/components/comment/comment-item";
import { useCommentsData } from "@/hooks/mutations/comment/use-comments-data";
import { useDeleteComment } from "@/hooks/mutations/comment/use-delete-comment";
import { showErrorToast } from "@/lib/error";
import AlertModal from "@/components/modal/alert-modal";
import { LoadingDots } from "../ui/loading-dots";

export default function CommentList({ postId }: { postId: number }) {
  const { data: comments, isPending: isPendingComments } = useCommentsData(postId);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const { mutate: deleteComment } = useDeleteComment({
    onSuccess: () => setDeleteTargetId(null),
    onError: (error) => showErrorToast(error, "댓글을 삭제하지 못했습니다"),
  });

  if (isPendingComments) return <LoadingDots />;
  return (
    <div className="flex flex-col gap-5">
      {comments?.map((comment) => (
        <CommentItem
          key={comment.id}
          {...comment}
          onDeleteClick={() => setDeleteTargetId(comment.id)}
        />
      ))}
      <AlertModal
        open={deleteTargetId !== null}
        onOpenChange={(open) => !open && setDeleteTargetId(null)}
        title="댓글을 삭제할까요?"
        description="삭제한 댓글은 다시 되돌릴 수 없어요."
        confirmText="삭제"
        onConfirm={() => {
          if (deleteTargetId !== null) deleteComment(deleteTargetId);
        }}
      />
    </div>
  );
}
