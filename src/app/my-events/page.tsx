import { db } from "~/server/db";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { auth } from "~/auth";
import { redirect } from "next/navigation";
import { type MyEvents } from "~/lib/types";
import { DataTablePagination } from "~/components/data-table-pagination";

async function getData(userId: string): Promise<MyEvents[]> {
  return db.query.events.findMany({
    where: (events, { eq }) => eq(events.venueId, userId),
  });
}

export default async function MyEvents() {
  const session = await auth();

  if (!session.user) {
    return redirect("/venue/auth");
  }

  if (session.user.type !== "venue") {
    return redirect("/");
  }

  const data = await getData(session.user.id);

  return (
    <div className="mx-auto w-11/12 md:max-w-screen-xl py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
