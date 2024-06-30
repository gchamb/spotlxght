import { type Metadata } from "next";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { getEventListings } from "~/lib/events";

export const metadata: Metadata = {
  title: "Listings",
};

export default async function Listings() {
  const data = await getEventListings();

  return (
    <div className="mx-auto flex w-11/12 flex-col gap-y-8 py-10 md:container md:max-w-screen-xl">
      <div>
        <h1 className="text-5xl ">Event Listings</h1>
        <span className="text-sm text-muted-foreground">
          Book with our wonderful venues
        </span>
      </div>

      <DataTable columns={columns} data={data} />
    </div>
  );
}
