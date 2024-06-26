import {
  type Asset,
  type Review,
  Session,
  type User,
  type UserProfile,
} from "~/lib/types";
import { getUserAssets } from "~/lib/profile";
import SideNav from "~/components/profile/components/side-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Reviews from "~/components/profile/components/reviews";
import { getUserReviews } from "~/server/actions/profile";
import ProfileBanner from "~/components/profile/components/profile-banner";
import MainContent from "~/components/profile/components/main-content";

export default async function MusicianProfile({
  userProfile,
  session,
  isCurrentUser,
}: {
  userProfile: UserProfile;
  session: Session;
  isCurrentUser: boolean;
}) {
  const userAssets = await getUserAssets(userProfile);
  const content: (Asset & { sasUrl?: string })[] = [];
  const songs: (Asset & { sasUrl?: string })[] = [];
  userAssets.forEach((asset) => {
    if (asset.mimetype.includes("audio")) {
      songs.push(asset);
    } else if (asset.mimetype.includes("video")) {
      content.push(asset);
    }
  });
  const userReviews: ({ review: Review } & { user: User })[] =
    await getUserReviews(userProfile.id);

  return (
    <>
      <ProfileBanner userProfile={userProfile} isCurrentUser={isCurrentUser} />

      <div className="my-16 w-full justify-between gap-20 xl:flex">
        <SideNav
          userId={userProfile.id}
          userSongs={songs}
          userReviews={userReviews.slice(0, 3)}
          isCurrentUser={isCurrentUser}
        />
        <div className="align-center col-span-2 mx-auto mt-16 flex w-[708px] max-w-full flex-col gap-12 rounded-2xl xl:mt-0">
          <Tabs defaultValue="performances">
            <div className="mb-12 flex justify-center">
              <TabsList className="p grid w-[400px] grid-cols-2">
                <TabsTrigger value="performances">Performances</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="performances">
              <MainContent
                content={content}
                userProfile={userProfile}
                isCurrentUser={isCurrentUser}
              />
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
