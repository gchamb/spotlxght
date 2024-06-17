import { SignOutButton } from "~/components/sign-out-button";
import { redirect } from "next/navigation";
import { getSession } from "~/server/auth/lib";

export default async function Home() {
  const session = await getSession();
  console.log("home session:");
  console.log(session);

  if (!session?.user) {
    redirect("/");
  }
  if (session.user.type === null) {
    redirect("/onboarding");
  }

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to underground, {session.user.email}</p>
      <SignOutButton />
    </div>
  );
}
