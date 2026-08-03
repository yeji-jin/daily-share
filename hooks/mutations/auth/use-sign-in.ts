import { signInWithPassword } from "@/lib/services/auth";
import { UseMutationCallback } from "@/types/mutations";
import { useMutation } from "@tanstack/react-query";

export function useSignIn(callbacks?: UseMutationCallback) {
  return useMutation({
    mutationFn: signInWithPassword,
    onError: (error) => {
      console.log(error);
      if (callbacks?.onError) callbacks.onError(error);
    },
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
  });
}
