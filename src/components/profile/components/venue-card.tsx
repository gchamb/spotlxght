"use client";

import { MoveRight } from "lucide-react";
import { useState } from "react";
import { EventListing } from "~/lib/types";
import ApplyDialog from "~/components/profile/components/apply-dialog";
import { useRouter } from "next/navigation";
import { useSession } from "~/hooks/auth";

export default function VenueCard({ event }: { event: EventListing }) {
  const router = useRouter();
  const session = useSession();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    console.log("pressed closed");
    setOpen(false);
  };

  return (
    <div className="mx-auto h-64 w-72 rounded-2xl bg-[#222222] shadow-2xl sm:w-80">
      <div className="container flex h-full flex-col justify-between gap-8 pb-6 pt-10">
        <div className="flex justify-between gap-12">
          <h1 className="w-fit text-2xl">{event.name}</h1>
          <h1 className="w-fit pt-1 text-2xl font-bold">$50</h1>
        </div>
        <div
          onClick={() => {
            console.log(session.data?.type);
            if (session.data?.type === "musician") {
              handleOpen();
            } else {
              router.push(`/events/${event.id}`);
            }
          }}
          className="group flex items-end justify-between rounded-2xl py-4 hover:cursor-pointer"
        >
          <h1 className="my-auto w-fit group-hover:font-bold">Timeslots</h1>
          <MoveRight
            size={30}
            className="group-hover:h-9 group-hover:w-9 group-hover:font-bold"
          />
        </div>
        <ApplyDialog
          open={open}
          onClose={handleClose}
          timeslots={event.timeslots}
          eventName={event.name}
        />
      </div>
    </div>
  );
}
