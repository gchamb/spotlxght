"use server";

import { type Credentials, credentialsSchema } from "~/lib/types";
import { db } from "~/server/db";
import { sessions, users } from "~/server/db/schema";
import { eq, lt } from "drizzle-orm";
import { cookies } from "next/headers";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";

// TODO(future): Use server-side caching to speed up session retrieval?
// TODO(future): Handle client-side session caching
export async function getSession() {
  const userCookies = cookies();
  const sessionToken = userCookies.get("session-token")?.value;
  if (!sessionToken) return null;

  await invalidateExpiredSessions();
  const session = await db.query.sessions.findFirst({
    where: eq(sessions.sessionToken, sessionToken),
    with: { user: true },
  });
  if (!session) return null;
  return session;
}

export async function signOut() {
  const userCookies = cookies();
  const sessionToken = userCookies.get("session-token")?.value;

  if (sessionToken) {
    userCookies.delete("session-token");
    await db.delete(sessions).where(eq(sessions.sessionToken, sessionToken));
  }
  redirect("/");
}

export async function emailSignIn(credentials: Credentials) {
  const { email, password } = await credentialsSchema.parseAsync(credentials);
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
  const { email, password } = await credentialsSchema.parseAsync(credentials);

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
