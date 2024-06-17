import { getUser } from "~/lib/utils";
import MusicianProfile from "~/components/profile/musician-profile";
import VenueProfile from "~/components/profile/venue-profile";
import { redirect } from "next/navigation";

export default async function Profile() {
  const user = await getUser();
  console.log("profile user");
  console.log(user);
  if (!user.type) {
    redirect("/onboarding");
  }

  if (user.type === "musician") {
    return <MusicianProfile user={user} />;
  } else {
    return <VenueProfile user={user} />;
  }
}
