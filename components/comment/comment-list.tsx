"use client";

import { useState } from "react";
import CommentItem from "@/components/comment/comment-item";
import { useCommentsData } from "@/hooks/mutations/comment/use-comments-data";
import { useDeleteComment } from "@/hooks/mutations/comment/use-delete-comment";
import { showErrorToast } from "@/lib/error";
import AlertModal from "@/components/modal/alert-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { CommentInfo, NestedComment } from "@/types/comment";
import { MessageCircle } from "lucide-react";

function CommentItemSkeleton() {
  return (
    <div className="flex items-start gap-4 pb-5">
      <Skeleton className="size-8 shrink-0 rounded-full" />
      <div className="flex w-full flex-col gap-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-14" />
      </div>
    </div>
  );
}

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

  if (isPendingComments)
    return (
      <div className="flex flex-col gap-5 divide-y">
        {Array.from({ length: 3 }).map((_, i) => (
          <CommentItemSkeleton key={i} />
        ))}
      </div>
    );
  if (!comments || comments.length === 0)
    return (
      <div className="text-muted-foreground flex flex-col items-center gap-3 pt-10 text-center">
        <MessageCircle className="size-10" strokeWidth={1.5} />
        <p>등록된 댓글이 없습니다</p>
      </div>
    );

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
