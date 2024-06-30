import { BlobServiceClient } from "@azure/storage-blob";
import { env } from "~/env";

// azure blob client
export const blobServiceClient = BlobServiceClient.fromConnectionString(
  env.AZURE_STORAGE_ACCOUNT_CONNECTION,
);

export const bannerImagesContainer =
  blobServiceClient.getContainerClient("banner-images");

export const profileImagesContainer =
  blobServiceClient.getContainerClient("profile-images");

export const assetsContainer = blobServiceClient.getContainerClient("assets");
