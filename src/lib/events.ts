import { EventListing } from "~/lib/types";
import { db } from "~/server/db";
import { and, desc, eq } from "drizzle-orm";
import { events } from "~/server/db/schema";

export async function getEventListings(): Promise<EventListing[]> {
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

  const eventListings: EventListing[] = [];
  for (const listing of listings) {
    const { applications, user, ...rest } = listing;
    const eventListing: EventListing = {
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

export async function getVenueEventListings(
  venueId: string,
): Promise<EventListing[]> {
  const listings = await db.query.events.findMany({
    where: and(eq(events.venueId, venueId), eq(events.status, "open")),
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

  const eventListings: EventListing[] = [];
  for (const listing of listings) {
    const { applications, user, ...rest } = listing;
    const eventListing: EventListing = {
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
