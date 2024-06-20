"use server";

import { type AzureBlobContainer, type UserProfile } from "~/lib/types";
import { revalidatePath } from "next/cache";
import { assetsContainer } from "~/server/azure";
import { db } from "~/server/db";
import { assets } from "~/server/db/schema";

export async function uploadFile(
  userProfile: UserProfile,
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

  const azureBlobKey = `${userProfile.id}_${file.name.replace(/\s/g, "-")}`;
  const azureResponse = await assetsContainer
    .getBlockBlobClient(azureBlobKey)
    .uploadData(await file.arrayBuffer());
  if (azureResponse._response.status !== 201) {
    throw new Error("Error uploading file");
  }
  console.log("uploaded to azure");

  await db.insert(assets).values({
    userId: userProfile.id,
    title,
    description,
    mimetype: file.type,
    azureBlobContainer,
    azureBlobKey,
  });
  console.log("inserted into db");

  revalidatePath(`/profile/${userProfile.id}`);
}
