export default async function UserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-1 items-center justify-center">
      <h1 className="text-2xl font-semibold">User {id}</h1>
    </div>
  );
}
