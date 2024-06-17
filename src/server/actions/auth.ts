"use server";

import { redirect } from "next/navigation";
import { type UserType } from "~/lib/types";
import { signIn } from "~/next-auth";
import { emailSignIn, emailSignUp, getSession } from "~/server/auth/lib";
import { type Credentials } from "~/types/zod";

export async function emailSignInAction(
  credentials: Credentials,
  userType: UserType,
) {
  const user = await emailSignIn(credentials);
  if (!user.type) {
    redirect(`/${userType}/onboarding`);
  } else {
    redirect("/profile");
  }
}

export async function googleSignIn(userType: UserType) {
  if (userType !== "venue" && userType !== "musician") {
    redirect("/");
    return;
  }

  const session = await getSession();
  if (!session?.user?.id) {
    await signIn("google");
  } else if (!session.user.type) {
    await signIn("google", { redirectTo: `/${userType}/onboarding` });
  } else {
    await signIn("google", { redirectTo: "/profile" });
  }
}

export async function emailSignInCredentialsAction(credentials: Credentials) {
  await emailSignIn(credentials);
}

export async function emailSignUpAction(
  credentials: Credentials & { type: UserType },
) {
  const { type, ...creds } = credentials;
  await emailSignUp(creds);

  redirect(`/${type}/onboarding`);
}
