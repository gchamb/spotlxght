import { BlobSASPermissions } from "@azure/storage-blob";
import {
  blobServiceClient,
  assetsContainer,
  profileImagesContainer,
  bannerImagesContainer,
} from "~/server/azure";

export function getSaSUrl(
  blobKey: string,
  type: "banner-pic" | "profile-pic" | "assets",
) {
  const permissions = new BlobSASPermissions();
  permissions.read = true;
  permissions.add = false;
  permissions.delete = false;
  permissions.move = false;
  permissions.write = false;
  permissions.execute = false;

  return "";

  // be careful this is a cost per call so in dev mode it is recalled on every change
  if (type === "banner-pic") {
    return bannerImagesContainer.getBlobClient(blobKey).generateSasUrl({
      permissions,
      expiresOn: new Date(Date.now() + 60 * 60 * 100 * 10), // 1 hour
    });
  } else if (type === "profile-pic") {
    return profileImagesContainer.getBlobClient(blobKey).generateSasUrl({
      permissions,
      expiresOn: new Date(Date.now() + 60 * 60 * 100 * 10), // 1 hour
    });
  } else {
    return assetsContainer.getBlobClient(blobKey).generateSasUrl({
      permissions,
      expiresOn: new Date(Date.now() + 60 * 60 * 100 * 10), // 1 hour
    });
  }
}
