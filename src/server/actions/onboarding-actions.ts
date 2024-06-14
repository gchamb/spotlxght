"use server";
import { venueFormSchema, musicianFormSchema } from "~/lib/types";
import { bannerImagesContainer, profileImagesContainer } from "../azure";
import { db } from "../db";
import { genres, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export async function createProfile(data: FormData): Promise<void> {
  // NOTE: authenticate request by getting session cookie and checking what needs to be checked
  const userId = "29fe2ee2-979d-4af5-b957-b1f9fe92da79"; // use real userId

  const type = data.get("type");
  const venueName = data.get("venueName");
  const address = data.get("address");
  const bannerImage = data.get("bannerImage");
  const profileImage = data.get("profileImage");
  const name = data.get("name");
  const genreList = data.get("genres");

  if (type === null || (type !== "venue" && type !== "musician")) {
    throw new Error("Invalid Request");
  }
  // validate genres (will validate and refactor once we know all the genres we want in)
  if (genreList === null || typeof genreList !== "string") {
    throw new Error("Invalid request");
  }

  try {
    if (type === "venue") {
      const valid = venueFormSchema.safeParse({
        venueName,
        address,
        bannerImage,
      });

      if (!valid.success) {
        throw new Error(valid.error.errors[0]?.message);
      }

      const {
        venueName: validVenueName,
        address: validAddress,
        bannerImage: validBannerImage,
      } = valid.data;

      // upload images to azure
      let azureBannerName;
      if (validBannerImage) {
        azureBannerName = `${userId}.${validBannerImage.name.split(".")[1]}`;
        await bannerImagesContainer
          .getBlockBlobClient(azureBannerName)
          .uploadData(await validBannerImage.arrayBuffer());
      }

      // update name to venueName, address, their uploaded banner image, and genres
      await db
        .update(users)
        .set({
          name: validVenueName,
          profileBannerImage: azureBannerName ? azureBannerName : null,
          address: validAddress,
          type,
        })
        .where(eq(users.id, userId));
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

      const {
        bannerImage: validBannerImage,
        profileImage: validProfileImage,
        name: validName,
      } = valid.data;

      // upload images to azure
      let azureBannerName, azureProfileName;
      if (validBannerImage) {
        azureBannerName = `${userId}.${validBannerImage.name.split(".")[1]}`;
        await bannerImagesContainer
          .getBlockBlobClient(azureBannerName)
          .uploadData(await validBannerImage.arrayBuffer());
      }
      if (validProfileImage) {
        azureProfileName = `${userId}.${validProfileImage.name.split(".")[1]}`;
        await profileImagesContainer
          .getBlockBlobClient(azureProfileName)
          .uploadData(await validProfileImage.arrayBuffer());
      }

      // update name to musician name, their uploaded banner image, their uploaded profile image and genres
      await db
        .update(users)
        .set({
          name: validName,
          profileBannerImage: azureBannerName ? azureBannerName : null,
          profilePicImage: azureProfileName ? azureProfileName : null,
          type,
        })
        .where(eq(users.id, userId));
    }

    // add genres
    const genreInserts = genreList
      .split(",")
      .map((genre) => db.insert(genres).values({ genre, userId }));

    await Promise.allSettled(genreInserts);
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "Unable to handle this request. Try again.",
    );
  }

  if (type === "venue") {
    redirect(`/profile/${userId}`);
  }
}
