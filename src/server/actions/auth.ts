"use server";

import { redirect } from "next/navigation";
import { type UserType } from "~/lib/types";
import { signIn } from "~/next-auth";
import {
  emailSignIn,
  emailSignInCredentials,
  getSession,
  signUp,
} from "~/server/auth/lib";
import { type Credentials } from "~/types/zod";

export async function emailSignInAction(credentials: Credentials) {
  const user = await emailSignIn(credentials);
  redirect(`/profile/${user.id}`);
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
    await signIn("google", { redirectTo: `/profile/${session.user.id}` });
  }
}

export async function emailSignInCredentialsAction(credentials: Credentials) {
  await emailSignInCredentials(credentials);
}

export async function emailSignUpAction(
  credentials: Credentials & { type: UserType },
) {
  const { type, ...creds } = credentials;
  await signUp(creds);

  redirect(`/${type}/onboarding`);
}
