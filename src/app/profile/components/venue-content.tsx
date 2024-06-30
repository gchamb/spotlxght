import { type UserProfile } from "~/lib/types";
import { getVenueEventListings } from "~/lib/events";
import TimeslotsButton from "~/app/profile/components/timeslots-button";

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
          <div
            key={event.id}
            className="mx-auto h-64 w-72 rounded-2xl bg-[#222222] shadow-2xl sm:w-80"
          >
            <div className="container flex h-full flex-col justify-between gap-8 pb-6 pt-10">
              <div className="flex justify-between gap-12">
                <h1 className="w-fit text-2xl">{event.name}</h1>
                <h1 className="w-fit pt-1 text-2xl font-bold">
                  ${event.amount}
                </h1>
              </div>
              <TimeslotsButton event={event} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
