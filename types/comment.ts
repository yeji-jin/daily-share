import type { Tables } from "@/types/database.types";
import { Profile } from "./profile";

export type Comment = Tables<"comment">;

export type CommentInfo = Comment & { author: Profile };

export type NestedComment = CommentInfo & {
  parentComment?: CommentInfo;
  children: NestedComment[];
};

export type CommentForm = {
  content: string;
};

export type CreateMode = {
  type: "CREATE";
  postId: number;
};

export type EditMode = {
  type: "EDIT";
  commentId: number;
  initialContent: string;
  onClose: () => void;
};

export type ReplyMode = {
  type: "REPLY";
  postId: number;
  parentCommentId: number;
  rootCommentId: number;
  onClose: () => void;
};

export type CommentMode = CreateMode | EditMode | ReplyMode;
