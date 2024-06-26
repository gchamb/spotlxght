import { getSession, getUserProfile } from "~/lib/auth";
import { getUserAssets } from "~/lib/profile";
import type { Asset, Review, User } from "~/lib/types";
import { getUserReviews } from "~/server/actions/profile";
import ProfileBanner from "~/components/profile/components/profile-banner";
import SideNav from "~/components/profile/components/side-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import VenueContent from "~/components/profile/components/venue-content";
import MusicianContent from "~/components/profile/components/musician-content";
import Reviews from "~/components/profile/components/reviews";

export const revalidate = 3000;

export default async function Profile({ userId }: { userId: string }) {
  const userProfile = await getUserProfile(userId);
  if (!userProfile) {
    return <div>User not found</div>;
  }
  const session = await getSession();
  const isCurrentUser = session?.user.id === userProfile?.id;

  // For both user types
  const userReviews: ({ review: Review } & { user: User })[] =
    await getUserReviews(userProfile.id);
  userReviews.sort(
    (a, b) => b.review.reviewedAt.getTime() - a.review.reviewedAt.getTime(),
  );

  // For musicians
  const userAssets =
    userProfile?.type === "musician" ? await getUserAssets(userProfile) : [];
  const content: (Asset & { sasUrl?: string })[] = [];
  const songs: (Asset & { sasUrl?: string })[] = [];
  userAssets.forEach((asset) => {
    if (asset.mimetype.includes("audio")) {
      songs.push(asset);
    } else if (asset.mimetype.includes("video")) {
      content.push(asset);
    }
  });

  return (
    <>
      <ProfileBanner userProfile={userProfile} isCurrentUser={isCurrentUser} />

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
                  content={content}
                  userId={userProfile.id}
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
    </>
  );
}
