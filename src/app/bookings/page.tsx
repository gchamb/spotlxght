import { db } from "~/server/db";
import { redirect } from "next/navigation";
import { getSession } from "~/lib/auth";
import { applications, events } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { DataTable } from "~/app/bookings/components/data-table";
import { columns } from "~/app/bookings/components/columns";

async function getEvents(userId: string) {
  return db
    .select()
    .from(events)
    .innerJoin(applications, eq(events.id, applications.eventId))
    .where(eq(applications.userId, userId));
}

export default async function Bookings() {
  const session = await getSession();

  if (session === null) {
    return redirect("/musician/auth");
  }

  if (session.user.type !== "musician") {
    return redirect("/");
  }

  const data = await getEvents(session.user.id);

  return (
    <div className="mx-auto w-11/12 py-10 md:max-w-screen-xl">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
