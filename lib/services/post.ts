import { supabase } from "@/lib/supabase/client";
import { uploadImage } from "./image";
import { Post } from "@/types/post";

export async function getPosts() {
  const { data, error } = await supabase
    .from("post")
    .select("* , author: profile!author_id (*)")
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;
  return data;
}

export async function createPost(content: string) {
  const { data, error } = await supabase
    .from("post")
    .insert({
      content,
    })
    .select()
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
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePost(id: number) {
  const { data, error } = await supabase.from("post").delete().eq("id", id).select().single();

  if (error) throw error;
  return data;
}
