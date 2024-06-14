import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "~/server/db";
import { sessions } from "~/server/db/schema";

export async function authenticate() {
  const cookiesObject = cookies();
  const sessionToken = cookiesObject.get("authjs.session-token");

  if (sessionToken === undefined) {
    throw new Error("Unauthorized.");
  }

  // check if the session in the db
  const session = await db.query.sessions.findFirst({
    where: (sessions, { eq }) => eq(sessions.sessionToken, sessionToken.value),
  });

  if (session === undefined) {
    throw new Error("Unauthorized.");
  }

  if (session.expires < new Date()) {
    // delete the session
    db.delete(sessions).where(eq(sessions.sessionToken, sessionToken.value));

    throw new Error("Unauthorized.");
  }

  return session.userId;
}
