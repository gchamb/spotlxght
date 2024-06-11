"use server";
import { venueFormSchema, musicianFormSchema } from "~/lib/types";

export async function createProfile(data: FormData) {
  // NOTE: authenticate request by getting session cookie and checking what needs to be checked

  const type = data.get("type");

  if (type === null || (type !== "venue" && type !== "musician")) {
    return; // NOTE send error;
  }

  const venueName = data.get("venueName");
  const location = data.get("location");
  const bannerImage = data.get("bannerImage");
  const profileImage = data.get("profileImage");
  const name = data.get("name");

  if (type === "venue") {
    const valid = venueFormSchema.safeParse({
      venueName,
      location,
      bannerImage,
    });

    if (!valid.success) {
      return; // RETURN ERROR
    }

    // validate location

    // update
  } else {
    const valid = venueFormSchema.safeParse({
      venueName,
      location,
      bannerImage,
    });

    if (!valid.success) {
      return; // RETURN ERROR
    }

    // validate location

    // update
  }
}
