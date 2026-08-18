import { QUERY_KEYS } from "@/lib/constants";
import { updateProfile } from "@/lib/services/profile";
import { UseMutationCallback } from "@/types/mutations";
import type { Profile } from "@/types/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateProfile(callbacks?: UseMutationCallback) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedProfile) => {
      if (callbacks?.onSuccess) callbacks.onSuccess();
      queryClient.setQueryData<Profile>(QUERY_KEYS.profile.byId(updatedProfile.id), updatedProfile);
    },
    onError: (error) => {
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
