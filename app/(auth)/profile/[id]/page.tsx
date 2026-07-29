export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-1 items-center justify-center">
      <h1 className="text-2xl font-semibold">Profile {id}</h1>
    </div>
  );
}
