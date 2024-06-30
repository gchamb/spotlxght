"use client";

import { useSession } from "~/hooks/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MoveRight } from "lucide-react";
import ApplyDialog from "~/components/apply-dialog";
import { type EventListing } from "~/lib/types";

export default function TimeslotsButton({ event }: { event?: EventListing }) {
  const router = useRouter();
  const session = useSession();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => {
          if (!event) {
            router.push("/listings");
          } else if (session.data) {
            if (session.data?.type === "musician") {
              handleOpen();
            } else {
              router.push(`/events/${event.id}`);
            }
          } else {
            router.push("/");
          }
        }}
        className="group flex items-end justify-between rounded-2xl py-4"
      >
        <h1 className="my-auto w-fit">Timeslots</h1>
        <MoveRight size={30} />
      </button>
      {event && (
        <ApplyDialog
          open={open}
          onClose={handleClose}
          timeslots={event.timeslots}
          eventName={event.name}
        />
      )}
    </>
  );
}
