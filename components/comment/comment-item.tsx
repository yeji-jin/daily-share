"use client";
import Link from "next/link";
import { ProfileAvatar } from "../profile/profile-avatar";
import { NestedComment } from "@/types/comment";
import { formatTimeAgo } from "@/lib/time";
import { useUser } from "@/stores/session";
import { useState } from "react";
import CommentEditor from "./comment-editor";

type CommentItemProps = {
  comment: NestedComment;
  onDeleteClick: (commentId: number) => void;
};

export default function CommentItem({ comment, onDeleteClick }: CommentItemProps) {
  const user = useUser();
  const isMine = user?.id === comment.author_id;
  const isOverTwoLevels = comment.parent_comment_id !== comment.root_comment_id;
  const [isEditing, setIsEditing] = useState(false);
  const [isReply, setIsReply] = useState(false);

  const toggleEditing = () => setIsEditing(!isEditing);
  const toggleReply = () => setIsReply(!isReply);

  return (
    <div className="flex flex-col gap-8 pb-5">
      <div className="flex items-start gap-4">
        <Link href={`/profile/${comment.author_id}`}>
          <div className="flex h-full flex-col">
            <ProfileAvatar name={comment.author.nickname} avatarUrl={comment.author.avatar_url} />
          </div>
        </Link>
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="font-bold">{comment.author.nickname}</div>
            {isMine && (
              <span className="bg-muted-foreground text-muted rounded-xs px-1 py-0.5 text-sm font-bold">
                작성자
              </span>
            )}
          </div>
          {isEditing ? (
            <CommentEditor
              type={"EDIT"}
              commentId={comment.id}
              initialContent={comment.content}
              onClose={toggleEditing}
            />
          ) : (
            <div>
              {isOverTwoLevels && (
                <span className="pr-1 font-bold text-blue-500">
                  @{comment.parentComment?.author.nickname}
                </span>
              )}
              <span>{comment.content}</span>
            </div>
          )}
          <div className="text-muted-foreground flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <button
                onClick={toggleReply}
                className="cursor-pointer border-r pr-2 hover:underline"
              >
                답글
              </button>
              <div>{formatTimeAgo(comment.created_at)}</div>
            </div>
            {isMine && (
              <div className="flex items-center gap-2">
                <button onClick={toggleEditing} className="cursor-pointer hover:underline">
                  수정
                </button>
                <div className="bg-border h-3 w-0.5"></div>
                <button
                  onClick={() => onDeleteClick(comment.id)}
                  className="cursor-pointer hover:underline"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* reply */}
      {isReply && (
        <CommentEditor
          type={"REPLY"}
          postId={comment.post_id}
          parentCommentId={comment.id}
          rootCommentId={comment.root_comment_id || comment.id}
          onClose={toggleReply}
        />
      )}
      {comment.children.length > 0 && (
        <div className="ml-14 flex flex-col gap-8 divide-y">
          {comment.children.map((child) => (
            <CommentItem key={child.id} comment={child} onDeleteClick={onDeleteClick} />
          ))}
        </div>
      )}
    </div>
  );
}
