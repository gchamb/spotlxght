import { db } from "~/server/db";
import { redirect } from "next/navigation";
import { getSession } from "~/lib/auth";
import { applications, events, timeslots } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { DataTable } from "~/app/bookings/components/data-table";
import { columns } from "~/app/bookings/components/columns";

async function getBookings(userId: string) {
  return db
    .select()
    .from(events)
    .innerJoin(applications, eq(events.id, applications.eventId))
    .where(eq(applications.userId, userId))
    .innerJoin(timeslots, eq(events.id, timeslots.eventId));
}

export default async function Bookings() {
  const session = await getSession();

  if (session === null) {
    return redirect("/musician/auth");
  }

  if (session.user.type !== "musician") {
    return redirect("/");
  }

  const data = await getBookings(session.user.id);

  return (
    <div className="container w-11/12 max-w-screen-xl py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
