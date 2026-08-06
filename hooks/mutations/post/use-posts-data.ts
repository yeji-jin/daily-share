import { QUERY_KEYS } from "@/lib/constants";
import { getPosts } from "@/lib/services/post";
import { useQuery } from "@tanstack/react-query";

export function usePostsData() {
  return useQuery({
    queryKey: QUERY_KEYS.post.list,
    queryFn: () => getPosts(),
    throwOnError: true,
  });
}
