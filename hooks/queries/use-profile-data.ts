import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { createProfile, fetchProfile } from "@/lib/profile";
import { PostgrestError } from "@supabase/supabase-js";
import { useUser } from "@/stores/session";

export function useProfileData(userId?: string) {
  const session = useUser();
  const isMine = userId === session?.id;

  return useQuery({
    queryKey: QUERY_KEYS.profile.byId(userId!),
    queryFn: async () => {
      try {
        const profile = await fetchProfile(userId!);
        return profile;
      } catch (error) {
        if (isMine && (error as PostgrestError).code === "PGRST116") {
          return await createProfile(userId!);
        }
        throw error;
      }
    },
    enabled: !!userId,
  });
}
