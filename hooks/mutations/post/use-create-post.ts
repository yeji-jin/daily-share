import { createPostWithImages } from "@/lib/services/post";
import { UseMutationCallback } from "@/types/mutations";
import { useMutation } from "@tanstack/react-query";

export function useCreatePost(callbacks?: UseMutationCallback) {
  return useMutation({
    mutationFn: createPostWithImages,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
