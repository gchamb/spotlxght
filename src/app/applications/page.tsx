import { db } from "~/server/db";
import { redirect } from "next/navigation";
import { getSession } from "~/lib/auth";
import { applications, events, timeslots, users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { columns } from "~/app/applications/components/columns";
import { DataTable } from "~/app/applications/components/data-table";

async function getApplications(userId: string) {
  return db
    .select()
    .from(events)
    .innerJoin(applications, eq(events.id, applications.eventId))
    .where(eq(applications.userId, userId))
    .innerJoin(users, eq(events.venueId, users.id))
    .innerJoin(timeslots, eq(events.id, timeslots.eventId));
}

export default async function Applications() {
  const session = await getSession();

  if (session === null) {
    return redirect("/musician/auth");
  }

  if (session.user.type !== "musician") {
    return redirect("/");
  }

  const data = await getApplications(session.user.id);

  return (
    <div className="mx-auto w-11/12 py-10 md:max-w-screen-xl">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
