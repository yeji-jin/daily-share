"use client";

import { useState } from "react";
import CommentItem from "@/components/comment/comment-item";
import { useCommentsData } from "@/hooks/mutations/comment/use-comments-data";
import { useDeleteComment } from "@/hooks/mutations/comment/use-delete-comment";
import { showErrorToast } from "@/lib/error";
import AlertModal from "@/components/modal/alert-modal";
import { LoadingDots } from "../ui/loading-dots";
import { CommentInfo, NestedComment } from "@/types/comment";

function toNestedComments(comments: CommentInfo[]): NestedComment[] {
  const result: NestedComment[] = [];
  comments.forEach((comment) => {
    if (!comment.root_comment_id) {
      result.push({ ...comment, children: [] });
    } else {
      const rootCommentIdx = result.findIndex((item) => item.id === comment.root_comment_id);
      const parentComment = comments.find((item) => item.id === comment.parent_comment_id);

      if (rootCommentIdx === -1) return;
      if (!parentComment) return;

      result[rootCommentIdx].children.push({
        ...comment,
        children: [],
        parentComment,
      });
    }
  });
  return result;
}

export default function CommentList({ postId }: { postId: number }) {
  const { data: comments, isPending: isPendingComments } = useCommentsData(postId);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const { mutate: deleteComment } = useDeleteComment({
    onSuccess: () => setDeleteTargetId(null),
    onError: (error) => showErrorToast(error, "댓글을 삭제하지 못했습니다"),
  });

  if (isPendingComments) return <LoadingDots />;
  if (!comments || comments.length === 0)
    return <p className="pt-10 text-center">등록된 댓글이 없습니다</p>;

  const nestedComments = toNestedComments(comments);
  return (
    <div className="flex flex-col gap-5 divide-y">
      {nestedComments?.map((comment) => (
        <CommentItem key={comment.id} comment={comment} onDeleteClick={setDeleteTargetId} />
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
