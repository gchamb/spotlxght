import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useSession } from "~/hooks/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ApplyDialog from "~/components/apply-dialog";
import { EventListing } from "~/lib/types";
import { Button } from "~/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export default function Actions({
  eventDetails,
}: {
  eventDetails: EventListing;
}) {
  const [open, setOpen] = useState(false);
  const { data } = useSession();
  const router = useRouter();

  return (
    <>
      <ApplyDialog
        open={open}
        onClose={() => setOpen(false)}
        eventName={eventDetails.venueName}
        timeslots={eventDetails.timeslots.map((timeslot) => {
          return {
            id: timeslot.id,
            startTime: timeslot.startTime,
            endTime: timeslot.endTime,
            eventId: timeslot.eventId,
          };
        })}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => {
              if (data === undefined || data === null) {
                router.replace("/musician/auth");
                return;
              }

              setOpen(true);
            }}
          >
            Apply for this event
          </DropdownMenuItem>
          {/* <DropdownMenuSeparator /> */}
          <DropdownMenuItem>
            <Link href={`/profile/${eventDetails.venueId}`}>
              View the venue&apos;s profile
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
