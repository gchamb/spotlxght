"use server";

import { type Credentials, credentialsSchema } from "~/types/zod";
import { db } from "~/server/db";
import { sessions, users } from "~/server/db/schema";
import { eq, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import { auth, signOut as authJsSignOut } from "~/next-auth";
import bcrypt from "bcrypt";

export type Provider = "google" | "email";

export type Options = {
  redirectTo?: string;
  redirect?: boolean;
  email?: string;
  password?: string;
} & Record<string, unknown>;

// TODO: Avoid duplicate session creation
export async function signIn(provider: Provider, options?: Options) {
  console.log("Signing in...");

  // const user

  switch (provider) {
    case "google":
      await googleSignIn();
      break;
    case "email":
      const { email, password } = await credentialsSchema.parseAsync(options);
      await emailSignIn({ email, password });
      break;
  }
}

// TODO(future): Use server-side caching to speed up session retrieval?
// TODO(future): Handle client-side session caching
export async function getSession() {
  console.log("Getting session...");

  // 1. Get session token from cookies
  const userCookies = cookies();
  const customSessionToken = userCookies.get("session-token")?.value;
  const authJsSessionToken = userCookies.get("authjs.session-token")?.value;
  if (!customSessionToken && !authJsSessionToken) return null;

  let session;
  if (authJsSessionToken) {
    console.log("Using authjs session...");
    session = auth();
  } else if (customSessionToken) {
    // 2. Invalidate expired sessions
    await invalidateExpiredSessions();

    // 3. Find valid session in database
    session = await db.query.sessions.findFirst({
      where: eq(sessions.sessionToken, customSessionToken),
      with: { user: true },
    });
    if (!session) return null;

    // 4. Update session expiration
    await db
      .update(sessions)
      .set({ expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) })
      .where(eq(sessions.sessionToken, customSessionToken));
  }

  return session;
}

async function googleSignIn() {
  console.log("Google sign in...");
  // TODO: Avoid duplicate accounts (duplicate sessions are allowed)
  //   - Keep the last account only
}

export async function emailSignIn(credentials: Credentials) {
  console.log("Email sign in...");

  const { email, password } = await credentialsSchema.parseAsync({
    email: credentials.email,
    password: credentials.password,
  });
  if (!email || !password) throw new Error("Invalid email or password");

  // 1. Find user in database
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) throw new Error("Invalid email or password");

  if (user.password === null) throw new Error("No password for this account.");

  // 2. Compare password
  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) throw new Error("Invalid email or password");

  // 3. Invalidate expired sessions
  await invalidateExpiredSessions();

  // 4. Create session
  const session = {
    sessionToken: crypto.randomUUID(),
    userId: user.id,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
  };

  // 5. Create session or update existing session
  await db.insert(sessions).values(session);

  // 6. Set session token in cookies
  const userCookies = cookies();
  userCookies.set("session-token", session.sessionToken, {
    expires: session.expires,
    httpOnly: true,
    secure: true,
  });

  // 7. Return user
  return user;
}

export async function emailSignInCredentials(credentials: Credentials) {
  console.log("Email sign in...");
  const { email, password } = await credentialsSchema.parseAsync(credentials);
  if (!email || !password) throw new Error("Invalid email or password");

  // 1. Find user in database
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });
  if (!user) throw new Error("Invalid email or password");

  // 2. Compare password
  const passwordsMatch = await bcrypt.compare(password, user.password!);
  if (!passwordsMatch) throw new Error("Invalid email or password");

  // 3. Invalidate expired sessions
  await invalidateExpiredSessions();

  // 4. Create session
  const session = {
    sessionToken: crypto.randomUUID(),
    userId: user.id,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
  };

  // 5. Create session or update existing session
  await db.insert(sessions).values(session);

  // 6. Set session token in cookies
  const userCookies = cookies();
  userCookies.set("session-token", session.sessionToken, {
    expires: session.expires,
    httpOnly: true,
    secure: true,
  });

  // 7. Return user
  return user;
}

async function invalidateExpiredSessions() {
  console.log("Invalidating expired sessions...");
  await db
    .delete(sessions)
    .where(
      lt(sessions.expires, new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)),
    );
}

export async function signUp(credentials: Credentials) {
  // TODO: Add email verification
  const { email: formEmail, password: formPassword } = credentials;

  console.log("Signing up...");
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

export async function signOut() {
  console.log("Signing out...");
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
