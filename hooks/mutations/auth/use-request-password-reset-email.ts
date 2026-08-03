import { requestPasswordResetEmail } from "@/lib/services/auth";
import { UseMutationCallback } from "@/types/mutations";
import { useMutation } from "@tanstack/react-query";

export function useRequestPasswordResetEmail(callbacks?: UseMutationCallback) {
  return useMutation({
    mutationFn: requestPasswordResetEmail,
    onSuccess: () => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
