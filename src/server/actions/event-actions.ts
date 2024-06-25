"use server";

import { redirect } from "next/navigation";
import { getSession } from "~/lib/auth";
import {
  ApplicationStatus,
  createEventSchema,
  SetApplicantStatusRequest,
  setApplicantStatusRequest,
} from "~/lib/types";
import { db } from "../db";
import { applications, events, timeslots } from "../db/schema";
import { revalidatePath } from "next/cache";
import { normalizeCreateEventData, validTimeslots } from "~/lib/utils";
import { and, eq } from "drizzle-orm";

export async function createEvent(data: FormData) {
  const session = await getSession();

  if (session === null) {
    return redirect("/venue/auth");
  }

  if (session.user.type !== "venue") {
    return redirect("/");
  }

  try {
    const normalizedData = normalizeCreateEventData(data);
    const valid = createEventSchema.safeParse(normalizedData);

    if (!valid.success) {
      const zodError = valid.error.errors[0];

      if (zodError?.path[0] === "timeslots") {
        throw new Error("You must select a valid time.");
      }

      throw new Error(zodError?.message);
    }

    const { name, date, pay, timeslots: dataTimeslots } = valid.data;

    const acceptableTimeslotRange: number[] = [];
    for (const { startTime, endTime } of dataTimeslots) {
      // make sure they're valid timeslots
      const timeslotsIndexRange = validTimeslots(startTime, endTime);

      // if valid append them to the acceptable ranges
      for (const timeslotIndex of timeslotsIndexRange) {
        // make sure they're not overlapping timeslots
        if (acceptableTimeslotRange.includes(timeslotIndex)) {
          throw new Error("Overlapping timeslots");
        }

        acceptableTimeslotRange.push(timeslotIndex);
      }
    }

    const eventId = crypto.randomUUID();
    await db.insert(events).values({
      id: eventId,
      venueId: session.userId,
      amount: pay,
      name,
      date,
    });

    await Promise.allSettled(
      dataTimeslots.map(async ({ startTime, endTime }) => {
        await db.insert(timeslots).values({ startTime, endTime, eventId });
      }),
    );

    revalidatePath("/my-events", "page");
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "Unable to process your request. Try again.",
    );
  }
}

export async function setEventApplicantStatus(data: SetApplicantStatusRequest) {
  const session = await getSession();

  if (session === null) return redirect("/venue/auth");

  if (session.user.type !== "venue") return redirect("/");

  try {
    // validate input
    const valid = setApplicantStatusRequest.safeParse(data);

    if (!valid.success) {
      const zodError = valid.error.errors[0];
      throw new Error(zodError?.message);
    }
    // make sure the current session user owns this event
    const { eventId, applicantId, timeslotId, status } = valid.data;

    const application = await db.query.applications.findFirst({
      where: and(
        eq(applications.timeslotId, timeslotId),
        eq(applications.userId, applicantId),
        eq(applications.eventId, eventId),
      ),
      with: {
        event: true,
      },
    });

    if (!application) throw new Error("Applicant doesn't exist.");

    if (application.event.venueId !== session.userId) {
      throw new Error("Unauthorized");
    }

    // make sure this timeslot doesn't already have an accepted applicant
    const acceptedApplication = await db.query.applications.findFirst({
      where: and(
        eq(applications.timeslotId, timeslotId),
        eq(applications.eventId, eventId),
        eq(applications.status, "accepted"),
      ),
    });
    console.log(acceptedApplication);
    if (status === "accepted" && acceptedApplication) {
      throw new Error("An applicant was already accepted for this timeslot.");
    }

    // set the status of the applicant
    await db
      .update(applications)
      .set({
        status,
      })
      .where(
        and(
          eq(applications.timeslotId, timeslotId),
          eq(applications.userId, applicantId),
          eq(applications.eventId, eventId),
        ),
      );

    // revalidate path
    revalidatePath(`/events/${eventId}`, "page");

    // send the email to the musician
  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Unable to handle this request.",
    );
  }
}
