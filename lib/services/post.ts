import { supabase } from "@/lib/supabase/client";
import { deleteImage, deleteImagesInFolder, getImagePathFromUrl, uploadImage } from "./image";
import { Post } from "@/types/post";

export async function getPosts({
  from,
  to,
  userId,
  authorId,
}: {
  from: number;
  to: number;
  userId: string;
  authorId?: string;
}) {
  const request = supabase
    .from("post")
    .select("* , author: profile!author_id (*), myLiked:like!post_id (*)")
    .eq("like.user_id", userId)
    .order("created_at", {
      ascending: false,
    })
    .range(from, to);

  if (authorId) request.eq("author_id", authorId);

  const { data, error } = await request;

  if (error) throw error;
  return data.map((post) => ({
    ...post,
    isLiked: post.myLiked && post.myLiked.length > 0,
  }));
}

export async function getPost({ postId, userId }: { postId: number; userId: string }) {
  const { data, error } = await supabase
    .from("post")
    .select("* , author: profile!author_id (*), myLiked:like!post_id (*)")
    .eq("like.user_id", userId)
    .eq("id", postId)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return {
    ...data,
    isLiked: data.myLiked && data.myLiked.length > 0,
  };
}

export async function createPost(content: string) {
  const { data, error } = await supabase
    .from("post")
    .insert({
      content,
    })
    .select("* , author: profile!author_id (*)")
    .single();

  if (error) throw error;
  return data;
}

export async function createPostWithImages({
  content,
  images,
  userId,
}: {
  content: string;
  images: File[];
  userId: string;
}) {
  // create post
  const post = await createPost(content);
  if (images.length === 0) return post;

  try {
    // image upload
    const imageUrls = await Promise.all(
      images.map((image) => {
        const fileExtension = image.name.split(".").pop() || "webp";
        const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
        const filePath = `${userId}/${post.id}/${fileName}`;

        return uploadImage({
          file: image,
          filePath,
        });
      }),
    );

    // post table update
    const updatedPost = await updatePost({
      id: post.id,
      image_urls: imageUrls,
    });

    return updatedPost;
  } catch (error) {
    // upload or update 도중 error 처리
    await deletePost(post.id);
    throw error;
  }
}

export async function updatePost(post: Partial<Post> & { id: number }) {
  const { data, error } = await supabase
    .from("post")
    .update(post)
    .eq("id", post.id)
    .select("* , author: profile!author_id (*)")
    .single();

  if (error) throw error;
  return data;
}

export async function updatePostWithImages({
  id,
  content,
  userId,
  newImages,
  keptImageUrls,
  removedImageUrls,
}: {
  id: number;
  content: string;
  userId: string;
  newImages: File[];
  keptImageUrls: string[];
  removedImageUrls: string[];
}) {
  const uploadedUrls = await Promise.all(
    newImages.map((image) => {
      const fileExtension = image.name.split(".").pop() || "webp";
      const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;
      const filePath = `${userId}/${id}/${fileName}`;

      return uploadImage({ file: image, filePath });
    }),
  );

  // DB를 먼저 업데이트해서 참조가 항상 유효한 이미지만 가리키게 한다.
  // 이후 storage 삭제가 실패해도 orphan 파일만 남을 뿐 포스트 데이터는 안전하다.
  const updatedPost = await updatePost({
    id,
    content,
    image_urls: [...keptImageUrls, ...uploadedUrls],
  });

  await Promise.all(
    removedImageUrls.map(async (url) => {
      const filePath = getImagePathFromUrl(url);
      if (!filePath) return;
      try {
        await deleteImage(filePath);
      } catch (error) {
        console.error("기존 이미지 삭제 실패:", filePath, error);
      }
    }),
  );

  return updatedPost;
}

export async function deletePost(id: number) {
  const { data, error } = await supabase.from("post").delete().eq("id", id).select().single();

  if (error) throw error;
  return data;
}

export async function deletePostWithImages({ id, userId }: { id: number; userId: string }) {
  const deletedPost = await deletePost(id);

  try {
    await deleteImagesInFolder(`${userId}/${id}`);
  } catch (error) {
    console.error("게시글 이미지 폴더 삭제 실패:", `${userId}/${id}`, error);
  }

  return deletedPost;
}

export async function togglePostLike({ postId, userId }: { postId: number; userId: string }) {
  const { data, error } = await supabase.rpc("toggle_post_like", {
    p_post_id: postId,
    p_user_id: userId,
  });

  if (error) throw error;
  return data;
}
