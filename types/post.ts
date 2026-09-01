import type { Tables } from "@/types/database.types";

export type Post = Tables<"post">;

export type PostWithMeta = Post & { isLiked: boolean; commentCount: number };
