"use server";

import { redirect } from "next/navigation";
import { UserType } from "~/lib/types";
import { signIn } from "~/next-auth";
import {
  emailSignIn,
  emailSignInCredentials,
  getSession,
  signUp,
} from "~/server/auth/lib";
import { type Credentials } from "~/types/zod";

export async function emailSignInAction(credentials: Credentials) {
  await emailSignIn(credentials);
}

export async function googleSignIn(userType: UserType) {
  const session = await getSession();

  if (
    session === null ||
    session === undefined ||
    session.user?.type === undefined ||
    session.user.type === null
  ) {
    const redirectTo = `/${userType}/onboarding`;
    await signIn("google", { redirectTo });
    return;
  }

  await signIn("google", { redirectTo: `/profile/${session.user?.id}` });
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
