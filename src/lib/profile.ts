import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { assets } from "~/server/db/schema";
import { getSasUrl } from "~/lib/azure";
import { type Asset, AzureBlobContainer, type UserProfile } from "~/lib/types";

export async function getUserAssets(userProfile: UserProfile) {
  const userAssets: (Asset & { sasUrl?: string })[] =
    await db.query.assets.findMany({
      where: eq(assets.userId, userProfile.id),
    });

  await Promise.all(
    userAssets.map(async (asset) => {
      asset.sasUrl = await getSasUrl(asset, AzureBlobContainer.ASSET);
      return Promise.resolve(asset);
    }),
  );
  return userAssets;
}
