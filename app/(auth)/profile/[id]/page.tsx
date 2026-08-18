import { notFound } from "next/navigation";
import { fetchProfile } from "@/lib/services/profile";
import ProfileInfo from "@/components/profile/profile-info";
import PostFeed from "@/components/post/post-feed";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID_REGEX.test(id)) notFound();

  const profile = await fetchProfile(id);
  if (!profile) notFound();

  return (
    <div className="flex flex-1 flex-col justify-center gap-10">
      <ProfileInfo userId={id} />
      <div className="border-b" />
      <PostFeed authorId={id} />
    </div>
  );
}
