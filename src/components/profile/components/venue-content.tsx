import { UserProfile } from "~/lib/types";
import VenueCard from "~/components/profile/components/venue-card";
import { getVenueEventListings } from "~/lib/events";

export default async function VenueContent({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  const venueEvents = await getVenueEventListings(userProfile.id);

  return (
    <div className="container min-w-full">
      <div className="grid grid-cols-1 place-content-center items-center justify-center gap-x-10 gap-y-14 lg:grid-cols-2 xl:grid-cols-3">
        {venueEvents.map((event) => (
          <VenueCard event={event} key={event.id} />
        ))}
      </div>
    </div>
  );
}
