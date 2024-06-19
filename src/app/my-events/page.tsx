import { db } from "~/server/db";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { redirect } from "next/navigation";
import { type MyEvents } from "~/lib/types";
import { DataTablePagination } from "~/components/data-table-pagination";
import { getSession } from "~/lib/auth";

async function getEvents(userId: string): Promise<MyEvents[]> {
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