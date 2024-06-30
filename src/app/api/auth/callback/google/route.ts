import { eq } from "drizzle-orm";
import { OAuth2Client } from "google-auth-library";
import { cookies } from "next/headers";
import { env } from "~/env";
import { type GoogleInfo } from "~/lib/types";
import { db } from "~/server/db";
import { accounts, sessions, users } from "~/server/db/schema";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const cookieState = cookies().get("verifier");
  const userType = cookies().get("user-type");
  let redirect = "/";

  // make sure the authorization token is there, the verifier, and the state
  if (code === null || state === null || cookieState === undefined) {
    return new Response(null, {
      status: 401,
    });
  }

  // make sure the state matchers the verifier
  if (cookieState.value !== state) {
    return new Response(null, {
      status: 401,
    });
  }

  // get the access token
  const oAuth2Client = new OAuth2Client(
    env.AUTH_GOOGLE_ID,
    env.AUTH_GOOGLE_SECRET,
    `${url.origin}/api/auth/callback/google`,
  );
  const { tokens } = await oAuth2Client.getToken(code);

  // fetch the google user details
  const fetchUserResponse = await fetch(
    `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokens.access_token}`,
  );

  if (!fetchUserResponse.ok) {
    return new Response(null, {
      status: 400,
    });
  }

  //  check if user already exist
  const googleInfo = (await fetchUserResponse.json()) as GoogleInfo;
  let user = await db.query.users.findFirst({
    where: eq(users.email, googleInfo.email),
  });

  if (userType === undefined) {
    return new Response(null, {
      status: 400,
    });
  }

  if (user === undefined) {
    // create user
    await db.insert(users).values({
      email: googleInfo.email,
      profilePicImage: googleInfo.picture,
    });

    // get the user id
    user = await db.query.users.findFirst({
      where: eq(users.email, googleInfo.email),
    });

    if (user === undefined) {
      return new Response(null, {
        status: 500,
      });
    }

    // create account
    await db.insert(accounts).values({
      userId: user.id,
      provider: "google",
      providerAccountId: googleInfo.id,
      refresh_token: tokens.refresh_token,
      access_token: tokens.access_token,
      expires_at: tokens.expiry_date,
      token_type: tokens.token_type,
      scope: tokens.scope,
      type: "oidc",
    });

    // pass in user type onboarding
    redirect = `${url.origin}/${userType.value}/onboarding`;
  } else {
    // redirect to profile if this user already exist
    if (user.type) {
      if (user.type == "musician") {
        if (user.stripeAccountId) {
          redirect = `${url.origin}/profile/${user.id}`;
        } else {
          redirect = `${url.origin}/linking`;
        }
      } else {
        // venues don't need a stripe account
        redirect = `${url.origin}/profile/${user.id}`;
      }
    } else {
      redirect = `${url.origin}/${userType.value}/onboarding`;
    }
  }

  // create session
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  const sessionToken = crypto.randomUUID();
  await db.insert(sessions).values({ expires, sessionToken, userId: user.id });
  cookies().set("session-token", sessionToken, {
    secure: true,
    httpOnly: true,
    expires,
  });

  // clean up intermediate user type cookie
  cookies().delete("user-type");

  return Response.redirect(redirect);
}
