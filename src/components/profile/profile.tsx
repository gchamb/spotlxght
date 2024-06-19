import MusicianProfile from "~/components/profile/musician-profile";
import VenueProfile from "~/components/profile/venue-profile";
import { getUserProfile } from "~/lib/auth";

export default async function Profile({ userId }: { userId: string }) {
  const userProfile = await getUserProfile(userId);

  if (!userProfile) {
    return <div>User not found</div>;
  } else if (userProfile.type === "musician") {
    return <MusicianProfile userProfile={userProfile} />;
  } else {
    return <VenueProfile userProfile={userProfile} />;
  }
}
