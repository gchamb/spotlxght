"use server";

import { type AzureBlobContainer } from "~/lib/types";
import { revalidatePath } from "next/cache";
import { assetsContainer } from "~/server/azure";
import { db } from "~/server/db";
import { assets, reviews, users } from "~/server/db/schema";
import { desc, eq } from "drizzle-orm";

export async function uploadFile(
  userId: string,
  formData: FormData,
  azureBlobContainer: AzureBlobContainer,
  title: string,
  description?: string | null,
) {
  const file = formData.get("uploadItem") as File;
  if (!file) {
    throw new Error("No file found");
  }

  console.log("uploading file");
  console.log(file);
  console.log(azureBlobContainer);
  console.log(title);
  console.log(description);

  const azureBlobKey = `${userId}_${file.name.replace(/\s/g, "-")}`;
  const azureResponse = await assetsContainer
    .getBlockBlobClient(azureBlobKey)
    .uploadData(await file.arrayBuffer());
  if (azureResponse._response.status !== 201) {
    throw new Error("Error uploading file");
  }
  console.log("uploaded to azure");

  await db.insert(assets).values({
    userId: userId,
    title,
    description,
    mimetype: file.type,
    azureBlobContainer,
    azureBlobKey,
  });
  console.log("inserted into db");

  revalidatePath(`/profile/${userId}`);
}

export async function getUserReviews(userId: string) {
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.userId, userId))
    .innerJoin(users, eq(reviews.reviewerId, users.id))
    .orderBy(desc(reviews.reviewedAt));
}

export async function deleteAsset(assetId: string, userId: string) {
  await db.delete(assets).where(eq(assets.id, assetId));
  revalidatePath(`/profile/${userId}`);
}
