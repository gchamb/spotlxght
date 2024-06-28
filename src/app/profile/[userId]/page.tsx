import Profile from "~/app/profile/components/profile";

export default async function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  return <Profile userId={params.userId} />;
}
