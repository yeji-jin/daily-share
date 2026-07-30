import { createClient } from "@/lib/supabase/client";
import { getRandomNickname } from "./utils";

const supabase = createClient();

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profile")
    .select("id, nickname, bio, avatar_url, created_at")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
}

export async function createProfile(userId: string) {
  const { data, error } = await supabase
    .from("profile")
    .insert({
      id: userId,
      nickname: getRandomNickname(),
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
