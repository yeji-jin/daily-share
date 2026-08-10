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

export async function deleteImage(filePath: string) {
  const { error } = await supabase.storage.from(BUCKET_NAMES).remove([filePath]);
  if (error) throw error;
}

// public URL에서 버킷 기준 상대 경로(filePath)를 역추출
export function getImagePathFromUrl(url: string) {
  const marker = `/object/public/${BUCKET_NAMES}/`;
  const index = url.indexOf(marker);
  return index === -1 ? null : url.slice(index + marker.length);
}
