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

export function getInitials(name: string) {
  const nameSplit = name.split(" ");

  if (nameSplit.length == 0) {
    return "UG"; // underground initials
  }

  // first and last night
  if (nameSplit.length > 1) {
    return `${nameSplit[0]?.charAt(0)}${nameSplit[1]?.charAt(0)}`.toUpperCase();
  }

  // just first name
  return nameSplit[0]?.charAt(0).toUpperCase();
}

export function getRandomColorPair() {
  // Helper function to generate a random integer between min and max (inclusive)
  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Helper function to convert RGB to hex
  function rgbToHex(r: number, g: number, b: number) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  // Helper function to lighten a color
  function lightenColor(color: string, percent: number) {
    const num = parseInt(color.slice(1), 16),
      amt = Math.round(2.55 * percent),
      R = (num >> 16) + amt,
      G = ((num >> 8) & 0x00ff) + amt,
      B = (num & 0x0000ff) + amt;
    return rgbToHex(R < 255 ? R : 255, G < 255 ? G : 255, B < 255 ? B : 255);
  }

  // Generate a random darker color
  const darkColor = rgbToHex(
    getRandomInt(0, 100),
    getRandomInt(0, 100),
    getRandomInt(0, 100),
  );

  // Generate a lighter version of the dark color (e.g., 50% lighter)
  const lightColor = lightenColor(darkColor, 50);

  return { darkColor, lightColor };
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
export function validTimeslots(
  startTime: TimeslotTimes,
  endTime: TimeslotTimes,
) {
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
