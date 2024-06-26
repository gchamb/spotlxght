import { db } from "~/server/db";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { redirect } from "next/navigation";
import { type MyEvent } from "~/lib/types";
import { getSession } from "~/lib/auth";

async function getEvents(userId: string): Promise<MyEvent[]> {
  return db.query.events.findMany({
    where: (events, { eq }) => eq(events.venueId, userId),
  });
}

export default async function MyEvents() {
  const session = await getSession();

  if (session === null) {
    return redirect("/venue/auth");
  }

  if (session.user.type !== "venue") {
    return redirect("/");
  }

  const data = await getEvents(session.user.id);

  return (
    <div className="mx-auto w-11/12 py-10 md:max-w-screen-xl">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
