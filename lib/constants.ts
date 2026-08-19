export const QUERY_KEYS = {
  profile: {
    all: ["profile"],
    list: ["profile", "list"],
    byId: (userId: string) => ["profile", "byId", userId],
  },
  post: {
    all: ["post"],
    list: (authorId?: string) => ["post", "list", authorId ?? null],
    byId: (postId: number) => ["post", "byId", postId],
  },
  comment: {
    all: ["comment"],
    post: (postId: number) => ["comment", "post", postId],
  },
};

export const BUCKET_NAMES = "uploads";
