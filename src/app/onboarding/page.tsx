import { SignOutButton } from "~/components/sign-out-button";
import { getSession } from "~/server/auth/lib";
import { redirect } from "next/navigation";

export default async function Onboarding() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/");
  }

  return (
    <div>
      <h1>Welcome to onboarding, {session.user.email}</h1>
      <SignOutButton />
    </div>
  );
}
