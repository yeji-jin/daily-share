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

// folderPath 안에 실제로 남아있는 파일을 전부 조회해서 한꺼번에 삭제
export async function deleteImagesInFolder(folderPath: string) {
  const { data: files, error: listError } = await supabase.storage
    .from(BUCKET_NAMES)
    .list(folderPath);
  if (listError) throw listError;
  if (!files || files.length === 0) return;

  const filePaths = files.map((file) => `${folderPath}/${file.name}`);
  const { error: removeError } = await supabase.storage.from(BUCKET_NAMES).remove(filePaths);
  if (removeError) throw removeError;
}

// public URL에서 버킷 기준 상대 경로(filePath)를 역추출
export function getImagePathFromUrl(url: string) {
  const marker = `/object/public/${BUCKET_NAMES}/`;
  const index = url.indexOf(marker);
  return index === -1 ? null : url.slice(index + marker.length);
}
