import VenueProfile from "~/components/profile/venue-profile";
import { getSession, getUserProfile } from "~/lib/auth";
import MusicianProfile from "~/components/profile/musician-profile";

export const revalidate = 3000;

export default async function Profile({ userId }: { userId: string }) {
  const userProfile = await getUserProfile(userId);
  const currentUser = await getSession();
  let isCurrentUser = false;
  if (currentUser?.user.id === userProfile?.id) {
    isCurrentUser = true;
  }

  if (!userProfile) {
    return <div>User not found</div>;
  } else if (userProfile.type === "musician") {
    return <MusicianProfile userProfile={userProfile} isCurrentUser={true} />;
  } else {
    return <VenueProfile userProfile={userProfile} isCurrentUser={true} />;
  }
}
