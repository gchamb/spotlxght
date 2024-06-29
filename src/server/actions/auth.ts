"use server";

import { redirect } from "next/navigation";
import { type Credentials, type UserType } from "~/lib/types";
import { emailSignIn, emailSignUp } from "~/lib/auth";
import { randomUUID } from "crypto";
import { cookies, headers } from "next/headers";
import { OAuth2Client } from "google-auth-library";
import { env } from "~/env";

export async function emailSignInAction(
  credentials: Credentials & { type: UserType },
) {
  let user: Awaited<ReturnType<typeof emailSignIn>> | null = null;
  try {
    user = await emailSignIn(credentials);
  } catch (err) {
    return {
      message:
        err instanceof Error ? err.message : "Unable to process this request",
    };
  }

  const { type: userType } = credentials;
  if (user) {
    if (user.type) {
      if (user.type == "musician") {
        if (user.stripeAccountId) {
          redirect(`/profile/${user.id}`);
        } else {
          redirect(`/${userType}/onboarding?slide=3`);
        }
      } else {
        // venues don't need a stripe account
        redirect(`/profile/${user.id}`);
      }
    } else {
      redirect(`/${userType}/onboarding`);
    }
  }
  // else if !user, stay on same page (authenticated pages should handle getSession() and redirecting)
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

export async function emailSignUpAction(
  credentials: Credentials & { type: UserType },
) {
  let user: Awaited<ReturnType<typeof emailSignIn>> | null = null;
  const { type, ...creds } = credentials;
  try {
    user = await emailSignUp(creds);
  } catch (err) {
    return {
      message:
        err instanceof Error ? err.message : "Unable to process this request",
    };
  }

  if (user) {
    redirect(`/${type}/onboarding`);
  }
}
