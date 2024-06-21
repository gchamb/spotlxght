import { eq, and, param } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getSession } from "~/lib/auth";
import { ApplicationStatus } from "~/lib/types";
import { db } from "~/server/db";
import { assets, events, users } from "~/server/db/schema";
import TimeslotTabs from "../components/timeslot-tabs";
import TimeslotSelect from "../components/timeslot-select";
import { getSaSUrl } from "~/lib/azure";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowRight, Home } from "lucide-react";

async function getEventData(id: string, userId: string) {
  // returns all the timeslots and applicants
  const event = await db.query.events.findFirst({
    where: and(eq(events.id, id), eq(events.venueId, userId)),
    with: {
      timeslots: true,
      applications: true,
    },
  });

  if (!event) return null;

  // get the applicants information like reviews and assets (like the first 3)
  const results = await Promise.allSettled(
    event.applications.map(async (applicant) => {
      return db.query.users.findFirst({
        where: eq(users.id, applicant.userId),
        columns: {
          id: true,
          name: true,
          profilePicImage: true,
        },
        with: {
          assets: {
            limit: 3,
            columns: {
              azureBlobKey: true,
              mimetype: true,
            },
            where: eq(assets.type, "audio"),
          },
        },
      });
    }),
  );

  const successfulUserResults: {
    id: string;
    name: string | null;
    profilePicImage: string | null;
    assets: {
      mimetype: string;
      azureBlobKey: string;
    }[];
    applicantData?: {
      userId: string;
      timeslotId: string;
      status: ApplicationStatus;
      eventId: string;
      appliedAt: Date;
    };
  }[] = [];

  for (const userResult of results) {
    if (userResult.status === "fulfilled") {
      if (userResult.value) {
        successfulUserResults.push(userResult.value);
      }
    }
  }

  const { applications, timeslots, ...rest } = event;

  // combination applicant data with successful query of user data
  for (const user of successfulUserResults) {
    // get applicant data
    const applicant = applications.find(({ userId }) => userId === user.id);

    if (!applicant) throw new Error("Unable to process this request.");

    user.applicantData = applicant;
  }

  return {
    eventDetails: {
      amount: rest.amount,
      date: rest.date,
      name: rest.name,
      status: rest.status,
    },
    applicants: successfulUserResults,
    timeslotData: timeslots.map(({ id, startTime, endTime, status }) => {
      return { id, startTime, endTime, status };
    }),
  };
}

export default async function EventDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();

  if (session === null) {
    return redirect("/venue/auth");
  }

  const event = await getEventData(params.id, session.userId);

  if (event === null) {
    return (
      <div className="max-screen2xl mx-auto flex h-4/5 flex-col items-center justify-center gap-4">
        <h1 className="text-7xl">404</h1>
        <div className="flex flex-col items-center">
          <h2 className="text-3xl font-semibold">
            This event doesn&apos;t exist.
          </h2>
          {session.user.type === "venue" ? (
            <Button variant="link" className="flex items-center gap-x-2">
              <Link href="/my-events">Return to your events.</Link>
              <ArrowRight />
            </Button>
          ) : (
            <Button variant="link" className="flex items-center gap-x-2">
              <Link href="/">Return back to home</Link>
              <Home />
            </Button>
          )}
        </div>
      </div>
    );
  }

  // convert blob keys into sas url

  const applicants = await Promise.all(
    event.applicants.map(async (applicant) => {
      const assets = await Promise.all(
        applicant.assets.map(
          async (asset): Promise<(typeof applicant)["assets"][number]> => {
            const sasUrl = await getSaSUrl(asset.azureBlobKey, "assets");

            return { ...asset, azureBlobKey: sasUrl };
          },
        ),
      );

      let profilePicSasUrl: string | null;
      if (
        applicant.profilePicImage &&
        !applicant.profilePicImage.includes("google")
      ) {
        profilePicSasUrl = await getSaSUrl(
          applicant.profilePicImage,
          "profile-pic",
        );
        applicant.profilePicImage = profilePicSasUrl;
      }

      return { ...applicant, assets };
    }),
  );

  event.applicants = applicants;

  return (
    <div className="mx-auto mx-auto w-11/12 py-10 md:max-w-screen-xl">
      <div className="flex flex-col gap-10">
        <h1 className="text-center text-3xl font-semibold">
          {event.eventDetails.name}
        </h1>

        <div className="flex flex-col gap-y-8 md:hidden">
          <div className="flex flex-col items-center gap-y-2">
            <h2 className="text-lg font-semibold">Date</h2>
            <span className="text-sm">
              {event.eventDetails.date.toLocaleDateString()}
            </span>
          </div>
          <div className="flex flex-col items-center gap-y-2">
            <h2 className="text-lg font-semibold">Pay Per Timeslot</h2>
            <span className="text-sm">${event.eventDetails.amount}</span>
          </div>
          <div className="flex flex-col items-center gap-y-2">
            <h2 className="text-lg font-semibold">Event Status</h2>
            <span className="text-sm">{event.eventDetails.status}</span>
          </div>
        </div>

        <div>
          <div className="hidden grid-cols-3 md:grid">
            <h2 className="text-center text-xl font-semibold">Date</h2>
            <h2 className="text-center text-xl font-semibold">
              Pay Per Timeslot
            </h2>
            <h2 className="text-center text-xl font-semibold">Event Status</h2>
          </div>
          <div className="hidden grid-cols-3 items-center justify-center md:grid">
            <span className="text-center text-lg">
              {event.eventDetails.date.toLocaleDateString()}
            </span>
            <span className="text-center text-lg">
              ${event.eventDetails.amount}
            </span>
            <span className="text-center text-lg">
              {event.eventDetails.status}
            </span>
          </div>
        </div>
      </div>

      <div className="my-10 flex flex-col  gap-y-10 ">
        <h2 className="text-center text-2xl">Applicants</h2>
        {/* client component */}
        {/* conditionally render timeslots */}
        <TimeslotSelect
          timeslots={event.timeslotData}
          applicants={event.applicants}
        />
        <TimeslotTabs
          timeslots={event.timeslotData}
          applicants={event.applicants}
        />
      </div>
    </div>
  );
}
