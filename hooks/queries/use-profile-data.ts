import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { createProfile, fetchProfile } from "@/lib/services/profile";
import { useUser } from "@/stores/session";

export function useProfileData(userId?: string) {
  const session = useUser();
  const isMine = userId === session?.id;

  return useQuery({
    queryKey: QUERY_KEYS.profile.byId(userId!),
    queryFn: async () => {
      const profile = await fetchProfile(userId!);
      if (profile) return profile;
      if (isMine) return await createProfile(userId!);
      throw new Error(`프로필을 찾을 수 없습니다: ${userId}`);
    },
    enabled: !!userId,
  });
}
