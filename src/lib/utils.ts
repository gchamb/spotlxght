import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TimeslotTimes, timeslotsTimes } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenOrNot(word: string, maxLength = 25) {
  if (word.length < maxLength) {
    return word;
  }

  return `${word.substring(0, maxLength)}...`;
}

export function normalizeCreateEventData(data: FormData) {
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
export function validTimeslots(startTime: TimeslotTimes, endTime: TimeslotTimes) {
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