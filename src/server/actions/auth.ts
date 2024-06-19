"use server";

import { redirect } from "next/navigation";
import { type UserType } from "~/lib/types";
import { emailSignIn, emailSignInCredentials, signUp } from "~/lib/auth";
import { type Credentials } from "~/lib/types";
import { OAuth2Client } from "google-auth-library";
import { randomUUID } from "crypto";
import { cookies, headers } from "next/headers";
import { env } from "~/env";

export async function emailSignInAction(credentials: Credentials) {
  const user = await emailSignIn(credentials);
  redirect(`/profile/${user.id}`);
}

export async function googleSignIn(userType: UserType) {
  const referer = headers().get("referer");

  const url = new URL(referer ?? "");

  const oAuth2Client = new OAuth2Client(
    env.AUTH_GOOGLE_ID,
    env.AUTH_GOOGLE_SECRET,
    `${url.origin}/api/auth/callback/google`,
  );

  const verifier = randomUUID();
  cookies().set("verifier", verifier, {
    httpOnly: true,
    secure: true,
  });
  cookies().set("user-type", userType, {
    httpOnly: true,
    secure: true,
  });

  // Generate the url that will be used for the consent dialog.
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
    state: verifier,
  });

  return redirect(authorizeUrl);
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
