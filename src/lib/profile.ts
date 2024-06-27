import { db } from "~/server/db";
import { desc, eq, sql } from "drizzle-orm";
import { assets, reviews } from "~/server/db/schema";
import { getSasUrl } from "~/lib/azure";
import {
  type Asset,
  AzureBlobContainer,
  type Rating,
  type UserProfile,
} from "~/lib/types";

export async function getUserAssets(userProfile: UserProfile) {
  const userAssets: (Asset & { sasUrl?: string })[] =
    await db.query.assets.findMany({
      where: eq(assets.userId, userProfile.id),
      orderBy: desc(assets.uploadedAt),
    });

  await Promise.all(
    userAssets.map(async (asset) => {
      asset.sasUrl = await getSasUrl(
        asset.azureBlobKey,
        AzureBlobContainer.ASSET,
      );
      return Promise.resolve(asset);
    }),
  );
  return userAssets;
}

export async function getUserRating(userId: string) {
  const queryResults = await db
    .select({
      avg: sql<number>`avg(${reviews.rating})`,
      count: sql<number>`count(${reviews.id})`,
    })
    .from(reviews)
    .where(eq(reviews.userId, userId));

  const reviewResults = queryResults[0];
  if (!reviewResults) throw new Error("Error getting reviews");
  if (!reviewResults?.count) return 5;
  return reviewResults.avg as Rating;
}
