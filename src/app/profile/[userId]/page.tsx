import { eq } from "drizzle-orm";
import { ResolvingMetadata, Metadata } from "next";
import Profile from "~/app/profile/components/profile";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export default async function ProfilePage({
  params,
}: {
  params: { userId: string };
}) {
  return <Profile userId={params.userId} />;
}

export async function generateMetadata(
  {
    params,
  }: {
    params: { userId: string };
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const id = params.userId;

  const user = await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: { name: true },
  });

  return {
    title: `${user?.name ?? "Spotlight"} Profile`,
  };
}
