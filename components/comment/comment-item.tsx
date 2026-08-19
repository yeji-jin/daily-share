"use client";
import Link from "next/link";
import { ProfileAvatar } from "../profile/profile-avatar";
import { CommentInfo } from "@/types/comment";
import { formatTimeAgo } from "@/lib/time";
import { useUser } from "@/stores/session";
import { useState } from "react";
import CommentEditor from "./comment-editor";

type CommentItemProps = CommentInfo & { onDeleteClick: () => void };

export default function CommentItem({ onDeleteClick, ...comment }: CommentItemProps) {
  const user = useUser();
  const isMine = user?.id === comment.author_id;
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditing = () => setIsEditing(!isEditing);

  return (
    <div className={"flex flex-col gap-8 border-b pb-5"}>
      <div className="flex items-start gap-4">
        <Link href={""}>
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
            <div>{comment.content}</div>
          )}
          <div className="text-muted-foreground flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <div>{formatTimeAgo(comment.created_at)}</div>
            </div>
            {isMine && (
              <div className="flex items-center gap-2">
                <button onClick={toggleEditing} className="cursor-pointer hover:underline">
                  수정
                </button>
                <div className="bg-border h-3 w-0.5"></div>
                <button onClick={onDeleteClick} className="cursor-pointer hover:underline">
                  삭제
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
