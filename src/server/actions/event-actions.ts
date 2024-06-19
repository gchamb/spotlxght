"use server";

import { CreateEvent, createEventSchema } from "~/lib/types";

function normalize(data: FormData) {
  const normalizedData: { [key: string]: unknown } = {};

  const timeslotsArray: { startTime?: string; endTime?: string }[] = [];
  for (const [name, value] of data.entries()) {
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
          timeslot.startTime = value.toString();
        } else {
          timeslot.endTime = value.toString();
        }
      } else {
        if (timeType === "start") {
          timeslotsArray[index] = {
            startTime: value.toString(),
          };
        } else {
          timeslotsArray[index] = {
            endTime: value.toString(),
          };
        }
      }
    } else {
      normalizedData[name] = value;
    }
  }

  normalizedData["timeslots"] = timeslotsArray;

  return normalizedData;
}

export async function createEvent(data: FormData) {
  const normalizedData = normalize(data);
  console.log(normalizedData);
  // try {
  //   const { name, date, pay, timeslots } =
  //     await createEventSchema.parseAsync(normalizedData);
  // } catch (err) {
  //   console.log(err);
  // }
}
