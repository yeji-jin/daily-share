import { redirect } from "next/navigation";
import { fetchProfile } from "@/lib/services/profile";
import ProfileInfo from "@/components/profile/profile-info";
import PostFeed from "@/components/post/post-feed";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const profile = await fetchProfile(id);
  if (!profile) redirect("/");

  return (
    <div className="flex flex-1 flex-col justify-center gap-10">
      <ProfileInfo userId={id} />
      <div className="border-b" />
      <PostFeed authorId={id} />
    </div>
  );
}
