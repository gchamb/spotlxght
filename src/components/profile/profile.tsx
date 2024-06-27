import { getSession } from "~/lib/auth";
import { getUserAssets } from "~/lib/profile";
import { type Asset, type Review, type User } from "~/lib/types";
import { getUserReviews } from "~/server/actions/profile";
import ProfileBanner from "~/components/profile/components/profile-banner";
import SideNav from "~/components/profile/components/side-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import VenueContent from "~/components/profile/components/venue-content";
import MusicianContent from "~/components/profile/components/musician-content";
import Reviews from "~/components/profile/components/reviews";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { users } from "~/server/db/schema";
import { getSasUrl } from "~/lib/azure";
import UserNotFound from "~/components/profile/components/user-not-found";

export const revalidate = 3000;

async function getUserProfile(userId: string) {
  return db.query.users.findFirst({
    where: eq(users.id, userId),
    with: {
      genres: true,
      reviews: true,
      assets: true,
    },
  });
}

export default async function Profile({ userId }: { userId: string }) {
  const userProfile = await getUserProfile(userId);
  if (!userProfile) {
    return <UserNotFound />;
  }
  const session = await getSession();
  const isCurrentUser = session?.user.id === userProfile?.id;

  // For both user types
  const profilePictureSasUrl = userProfile.profilePicImage
    ? (await getSasUrl(userProfile.profilePicImage, "profile-pic")) ||
      "/images/default-profile.png"
    : "/images/default-profile.png";

  const userReviews: ({ review: Review } & { user: User })[] =
    await getUserReviews(userProfile.id);
  userReviews.sort(
    (a, b) => b.review.reviewedAt.getTime() - a.review.reviewedAt.getTime(),
  );

  // For musicians
  const userAssets =
    userProfile?.type === "musician" ? await getUserAssets(userProfile) : [];
  const videos: (Asset & { sasUrl?: string })[] = [];
  const songs: (Asset & { sasUrl?: string })[] = [];
  userAssets.forEach((asset) => {
    if (asset.mimetype.includes("audio")) {
      songs.push(asset);
    } else if (asset.mimetype.includes("video")) {
      videos.push(asset);
    }
  });

  return (
    <div className="container mt-10 max-w-screen-xl px-4">
      <ProfileBanner
        userProfile={userProfile}
        profilePictureSasUrl={profilePictureSasUrl}
        isCurrentUser={isCurrentUser}
      />

      <div className="my-16 w-full justify-between gap-20 xl:flex">
        {userProfile.type === "musician" && (
          <SideNav
            userId={userProfile.id}
            userSongs={songs}
            isCurrentUser={isCurrentUser}
          />
        )}
        <div
          className={`align-center ${userProfile.type === "musician" ? "col-span-2" : ""} mx-auto mt-16 flex ${userProfile.type === "musician" ? "w-[708px]" : ""} w-full flex-col gap-12 rounded-2xl xl:mt-0`}
        >
          <Tabs
            defaultValue={`${userProfile.type === "venue" ? "events" : "performances"}`}
          >
            <div className="mb-12 flex justify-center">
              <TabsList className="p grid w-[400px] grid-cols-2">
                <TabsTrigger
                  value={`${userProfile.type === "venue" ? "events" : "performances"}`}
                >
                  {userProfile.type === "venue" ? "Events" : "Performances"}
                </TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent
              value={`${userProfile.type === "venue" ? "events" : "performances"}`}
            >
              {userProfile.type === "venue" ? (
                <VenueContent userProfile={userProfile} />
              ) : (
                <MusicianContent
                  videos={videos}
                  userId={userProfile.id}
                  profilePictureSasUrl={profilePictureSasUrl}
                  isCurrentUser={isCurrentUser}
                />
              )}
            </TabsContent>
            <TabsContent value="reviews">
              <Reviews userReviews={userReviews} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
