import VenueCard from "~/components/profile/components/venue-card";

export default function VenueContent() {
  return (
    <div className="container min-w-full">
      <div className="grid grid-cols-1 place-content-center items-center justify-center gap-x-10 gap-y-14 lg:grid-cols-2 xl:grid-cols-3">
        <VenueCard title="Jazz Night at The Bar with Jim" />
        <VenueCard title="Jazz Night at The Bar" />
        <VenueCard title="Jazz Night at The Bar" />
        <VenueCard title="Jazz Night at The Bar" />
        <VenueCard title="Jazz Night at The Bar" />
        <VenueCard title="Jazz Night at The Bar" />
      </div>
    </div>
  );
}
