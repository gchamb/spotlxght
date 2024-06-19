import Profile from "~/components/profile/profile";

export default async function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  return <Profile userId={params.userId} />;
}
