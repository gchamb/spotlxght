import { getSession } from "~/lib/auth";

export async function GET() {
  const session = await getSession();

  if (session === null) {
    return Response.json(null);
  }

  //   only return the needed information
  const { user, ...rest } = session;
  const { type } = user;

  return Response.json({ ...rest, type });
}
