import { QUERY_KEYS } from "@/lib/constants";
import { getComments } from "@/lib/services/comment";
import { useQuery } from "@tanstack/react-query";

export function useCommentsData(postId: number) {
  return useQuery({
    queryKey: QUERY_KEYS.comment.post(postId),
    queryFn: () => getComments(postId),
  });
}
