import { db } from "~/server/db";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { EventListings, type MyEvents } from "~/lib/types";
import { events } from "~/server/db/schema";
import { desc, eq } from "drizzle-orm";

async function getEventListings(): Promise<EventListings[]> {
  const listings = await db.query.events.findMany({
    where: eq(events.status, "open"),
    orderBy: [desc(events.createdAt)],
    with: {
      timeslots: true,
      applications: true,
      user: {
        columns: {
          id: true,
          name: true,
        },
        with: {
          genres: true,
        },
      },
    },
  });

  const eventListings: EventListings[] = [];
  for (const listing of listings) {
    const { applications, user, ...rest } = listing;
    const eventListing: EventListings = {
      ...rest,
      venueName: user.name ?? "",
      venueId: user.id,
      genres: user.genres.map(({ userId, ...rest }) => rest),
      totalApplicants: applications.length,
      totalTimeslots: rest.timeslots.length,
    };

    eventListings.push(eventListing);
  }

  return eventListings;
}

export default async function Listings() {
  const data = await getEventListings();

  return (
    <div className="mx-auto flex w-11/12 flex-col gap-y-8 py-10 md:max-w-screen-xl">
      <div>
        <h1 className="text-5xl ">Event Listings</h1>
        <span className="text-sm text-muted-foreground">Book with our wonderful venues</span>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
