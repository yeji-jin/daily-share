import { signUp } from "@/lib/services/auth";
import { UseMutationCallback } from "@/types/mutations";
import { useMutation } from "@tanstack/react-query";

export function useSignUp(callbacks?: UseMutationCallback) {
  return useMutation({
    mutationFn: signUp,
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
  });
}
