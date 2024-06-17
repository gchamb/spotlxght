"use server";

import { type Credentials, credentialsSchema } from "~/types/zod";
import { db } from "~/server/db";
import { sessions, users } from "~/server/db/schema";
import { eq, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { auth, signOut as authJsSignOut } from "~/next-auth";
import bcrypt from "bcrypt";

// export type Provider = "google" | "email";
//
// export type Options = {
//   redirectTo?: string;
//   redirect?: boolean;
//   email?: string;
//   password?: string;
// } & Record<string, unknown>;
//
// // TODO: Avoid duplicate session creation
// export async function signIn(provider: Provider, options?: Options) {
//   console.log("Signing in...");
//
//   // const user
//
//   switch (provider) {
//     case "google":
//       await googleSignIn();
//       break;
//     case "email":
//       const { email, password } = await credentialsSchema.parseAsync(options);
//       await emailSignIn({ email, password });
//       break;
//   }
// }

// TODO(future): Use server-side caching to speed up session retrieval?
// TODO(future): Handle client-side session caching
export async function getSession() {
  const userCookies = cookies();
  const customSessionToken = userCookies.get("session-token")?.value;
  const authJsSessionToken = userCookies.get("authjs.session-token")?.value;
  if (!customSessionToken && !authJsSessionToken) return null;

  let session;
  if (authJsSessionToken) {
    session = auth();
  } else if (customSessionToken) {
    await invalidateExpiredSessions();
    session = await db.query.sessions.findFirst({
      where: eq(sessions.sessionToken, customSessionToken),
      with: { user: true },
    });
  }

  return session;
}

export async function signOut() {
  const userCookies = cookies();
  const customSessionToken = userCookies.get("session-token")?.value;
  const authJsSessionToken = userCookies.get("authjs.session-token")?.value;

  if (customSessionToken) {
    userCookies.delete("session-token");
    await db
      .delete(sessions)
      .where(eq(sessions.sessionToken, customSessionToken));
  }
  if (authJsSessionToken) {
    await authJsSignOut();
  }
}

// async function googleSignIn() {
//   console.log("Google sign in...");
//   // TODO: Avoid duplicate accounts (duplicate sessions are allowed)
//   //   - Keep the last account only
// }

export async function emailSignIn(credentials: Credentials) {
  const { email, password } = await credentialsSchema.parseAsync({
    email: credentials.email,
    password: credentials.password,
  });
  if (!email || !password) throw new Error("Invalid email or password");

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) throw new Error("Invalid email or password");
  if (user.password === null) throw new Error("No password for this account.");
  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) throw new Error("Invalid email or password");

  await invalidateExpiredSessions();
  const session = {
    sessionToken: crypto.randomUUID(),
    userId: user.id,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
  };
  await db.insert(sessions).values(session);

  const userCookies = cookies();
  userCookies.set("session-token", session.sessionToken, {
    expires: session.expires,
    httpOnly: true,
    secure: true,
  });

  return user;
}

export async function emailSignUp(credentials: Credentials) {
  // TODO: Add email verification
  const { email: formEmail, password: formPassword } = credentials;

  const { email, password } = await credentialsSchema.parseAsync({
    email: formEmail,
    password: formPassword,
  });

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.insert(users).values({
    email,
    password: hashedPassword,
  });
  const createdUser = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!createdUser) throw new Error("User could not be created");

  const session = {
    sessionToken: crypto.randomUUID(),
    userId: createdUser.id,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
  };
  await db.insert(sessions).values(session);

  const userCookies = cookies();
  userCookies.set("session-token", session.sessionToken, {
    expires: session.expires,
    httpOnly: true,
    secure: true,
  });

  return createdUser;
}

async function invalidateExpiredSessions() {
  await db
    .delete(sessions)
    .where(
      lt(sessions.expires, new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)),
    );
}

