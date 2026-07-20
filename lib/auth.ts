import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export async function signUp({ email, password }: { email: string; password: string }) {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw error;
  return data;
}
