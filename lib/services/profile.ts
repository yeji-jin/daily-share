import { supabase } from "@/lib/supabase/client";
import { getRandomNickname } from "@/lib/utils";
import { deleteImage, getImagePathFromUrl, uploadImage } from "./image";

export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from("profile")
    .select("id, nickname, bio, avatar_url, created_at")
    .eq("id", userId)
    .maybeSingle();

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

export async function updateProfile({
  userId,
  nickname,
  bio,
  avatarFile,
  previousAvatarUrl,
}: {
  userId: string;
  nickname: string;
  bio?: string;
  // File: 새 이미지로 교체, null: 기존 이미지 삭제, undefined: 변경 없음
  avatarFile?: File | null;
  previousAvatarUrl: string | null;
}) {
  const AVATAR_PATH = `${userId}/avatar`;
  let newAvatarImageUrl: string | null | undefined;

  if (avatarFile) {
    // 1-A. 새 이미지로 교체하는 경우: 먼저 업로드
    const fileExtension = avatarFile.name.split(".").pop() || "webp";
    const filePath = `${AVATAR_PATH}/${new Date().getTime()}-${crypto.randomUUID()}.${fileExtension}`;

    newAvatarImageUrl = await uploadImage({
      file: avatarFile,
      filePath,
    });
  } else if (avatarFile === null) {
    // 1-B. 기존 이미지를 삭제하기로 한 경우: DB엔 null로 반영
    newAvatarImageUrl = null;
  }

  // 2. profile 테이블 업데이트 (참조가 항상 유효한 이미지만 가리키게 함)
  const { data, error } = await supabase
    .from("profile")
    .update({
      nickname,
      bio,
      avatar_url: newAvatarImageUrl,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  // 3. DB 반영이 끝난 뒤, 이전 아바타 파일 삭제
  if (avatarFile !== undefined && previousAvatarUrl) {
    const previousFilePath = getImagePathFromUrl(previousAvatarUrl);
    if (previousFilePath) {
      try {
        await deleteImage(previousFilePath);
      } catch (error) {
        console.error("기존 아바타 이미지 삭제 실패:", previousFilePath, error);
      }
    }
  }

  return data;
}
