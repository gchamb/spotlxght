import { getSession } from "~/server/auth/lib";
import { SignInForm } from "~/components/sign-in-form";
import Home from "~/app/home/page";
import Onboarding from "~/app/onboarding/page";

export default async function HomePage() {
  const session = await getSession();
  console.log("home page session:");
  console.log(session);

  if (!session?.user) {
    return <SignInForm />;
  } else {
    if (session.user.type !== null) {
      return <Home />;
    } else {
      return <Onboarding />;
    }
  }
}
