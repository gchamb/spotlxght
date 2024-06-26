import { type Review, Session, type User, type UserProfile } from "~/lib/types";
import ProfileBanner from "~/components/profile/components/profile-banner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import MainContent from "~/components/profile/components/main-content";
import Reviews from "~/components/profile/components/reviews";
import { getUserReviews } from "~/server/actions/profile";

export default async function VenueProfile({
  userProfile,
  session,
  isCurrentUser,
}: {
  userProfile: UserProfile;
  session: Session;
  isCurrentUser: boolean;
}) {
  const userReviews: ({ review: Review } & { user: User })[] =
    await getUserReviews(userProfile.id);
  userReviews.sort(
    (a, b) => b.review.reviewedAt.getTime() - a.review.reviewedAt.getTime(),
  );

  return (
    <>
      <ProfileBanner userProfile={userProfile} isCurrentUser={isCurrentUser} />

      <div className="my-16">
        <Tabs defaultValue="events">
          <div className="mb-12 flex justify-center">
            <TabsList className="p grid w-[400px] grid-cols-2">
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="events">
            <MainContent
              userProfile={userProfile}
              isCurrentUser={isCurrentUser}
            />
          </TabsContent>
          <TabsContent value="reviews">
            <Reviews userReviews={userReviews} />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
