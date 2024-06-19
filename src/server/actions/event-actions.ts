"use server";

import { redirect } from "next/navigation";
import { getSession } from "~/lib/auth";
import { createEventSchema, timeslotsTimes, TimeslotTimes } from "~/lib/types";
import { db } from "../db";
import { events, timeslots } from "../db/schema";
import { revalidatePath } from "next/cache";

function normalize(data: FormData) {
  const normalizedData: Record<string, unknown> = {};

  const timeslotsArray: { startTime?: string; endTime?: string }[] = [];
  for (const [name, value] of data.entries()) {
    const currentValue = value.toString();

    if (name.includes("timeslot")) {
      const nameSplit = name.split("-");
      const indexStr = nameSplit[1];
      const timeType = nameSplit[2];

      if (!indexStr) {
        throw new Error("Invalid Request");
      }

      if (timeType !== "end" && timeType !== "start") {
        throw new Error("Invalid Request");
      }

      const index = parseInt(indexStr);

      const timeslot = timeslotsArray[index];
      if (timeslot) {
        if (timeType === "start") {
          timeslot.startTime = currentValue;
        } else {
          timeslot.endTime = currentValue;
        }
      } else {
        if (timeType === "start") {
          timeslotsArray[index] = {
            startTime: currentValue,
          };
        } else {
          timeslotsArray[index] = {
            endTime: currentValue,
          };
        }
      }
    }

    if (name === "date") {
      const createDateObj = new Date(currentValue);
      normalizedData[name] = createDateObj;
    }

    if (name === "pay") {
      const castedPay = parseInt(currentValue);
      normalizedData[name] = castedPay;
    }

    if (name === "name") {
      normalizedData[name] = currentValue;
    }
  }

  normalizedData.timeslots = timeslotsArray;

  return normalizedData;
}

/**
 *
 * @param startTime
 * @param endTime
 * @returns an array of indexes ranging from but not including startTime to endTime
 */
function validTimeslots(startTime: TimeslotTimes, endTime: TimeslotTimes) {
  const startTimeIndex = timeslotsTimes.indexOf(startTime);
  const endTimeIndex = timeslotsTimes.indexOf(endTime);
  const acceptableIndexes: number[] = [];

  for (let i = startTimeIndex + 1; i < startTimeIndex + 13; i++) {
    if (i >= timeslotsTimes.length) {
      acceptableIndexes.push(i % timeslotsTimes.length);
    } else {
      acceptableIndexes.push(i);
    }
  }

  if (!acceptableIndexes.includes(endTimeIndex)) {
    throw new Error("Invalid end time.");
  }

  return acceptableIndexes.filter((_, index) => {
    return index <= acceptableIndexes.indexOf(endTimeIndex);
  });
}

export async function createEvent(data: FormData) {
  const session = await getSession();

  if (session === null) {
    return redirect("/");
  }

  if (session.user.type !== "venue") {
    return redirect("/");
  }

  try {
    const normalizedData = normalize(data);
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
