"use server";
import { venueFormSchema, musicianFormSchema } from "~/lib/types";

export async function createProfile(data: FormData) {
  // NOTE: authenticate request by getting session cookie and checking what needs to be checked

  const type = data.get("type");

  if (type === null || (type !== "venue" && type !== "musician")) {
    throw new Error("Invalid Request");
  }

  const venueName = data.get("venueName");
  const address = data.get("address");
  const bannerImage = data.get("bannerImage");
  const profileImage = data.get("profileImage");
  const name = data.get("name");

  if (type === "venue") {
    const valid = venueFormSchema.safeParse({
      venueName,
      address,
      bannerImage,
    });

    if (!valid.success) {
      throw new Error(valid.error.errors[0]?.message);
    }

    // validate address

    // upload images to azure

    // update
  } else {
    const valid = musicianFormSchema.safeParse({
      name,
      address,
      profileImage,
      bannerImage,
    });

    if (!valid.success) {
      throw new Error(valid.error.errors[0]?.message);
    }

    // validate address

    // upload images to azure

    // update
  }
}
