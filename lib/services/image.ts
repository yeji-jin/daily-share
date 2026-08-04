import { supabase } from "@/lib/supabase/client";
import { BUCKET_NAMES } from "../constants";

export async function uploadImage({ file, filePath }: { file: File; filePath: string }) {
  const { data, error } = await supabase.storage.from(BUCKET_NAMES).upload(filePath, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET_NAMES).getPublicUrl(data.path);
  return publicUrl;
}
