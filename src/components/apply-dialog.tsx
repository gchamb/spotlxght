import { TimeslotProps } from "~/app/events/components/timeslot-tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { TimeslotTimes } from "~/lib/types";
import { Button } from "./ui/button";
import { useState, useTransition } from "react";
import { applyToTimeslot } from "~/server/actions/event-actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type TimeslotApplyDialogProps = {
  open: boolean;
  onClose: () => void;
  timeslots: {
    id: string;
    startTime: TimeslotTimes;
    endTime: TimeslotTimes;
    eventId: string;
  }[];
  eventName: string;
};

export default function ApplyDialog({
  open,
  onClose,
  timeslots,
  eventName,
}: TimeslotApplyDialogProps) {
  const [selectedTimeslot, setSelectedTimeslot] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const applyForTimeslot = () => {
    if (selectedTimeslot === null) {
      setError("You need to select a timeslot.");
      return;
    }

    if (timeslots.length === 0) {
      setError("There's no timeslots to apply to.");
      return;
    }

    if (error !== "") {
      setError("");
    }

    startTransition(async () => {
      const error = await applyToTimeslot({
        eventId: timeslots[0]!.eventId,
        timeslotId: selectedTimeslot,
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSelectedTimeslot(null);
      onClose();
    });
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            {eventName} Timeslots
          </DialogTitle>
          <DialogDescription className="text-center">
            Select one timeslot for this event.
          </DialogDescription>
        </DialogHeader>

        {error !== "" && (
          <span className="text-center text-sm text-red-600">{error}</span>
        )}

        <div
          className={`grid grid-cols-${timeslots.length === 4 ? 2 : timeslots.length} gap-2`}
        >
          {timeslots.map((timeslot) => {
            return (
              <Button
                key={timeslot.id}
                variant="outline"
                className={`${timeslot.id === selectedTimeslot && "border-green-500"}`}
                onClick={() => {
                  if (timeslot.id === selectedTimeslot) {
                    setSelectedTimeslot(null);
                    return;
                  }

                  setSelectedTimeslot(timeslot.id);
                }}
              >
                <span>
                  {timeslot.startTime} - {timeslot.endTime}
                </span>
              </Button>
            );
          })}
        </div>
        <DialogFooter>
          <div className="flex w-full flex-col gap-2">
            <div className="flex gap-2 ">
              <Button
                disabled={isPending}
                onClick={() => {
                  setError("");
                  setSelectedTimeslot(null);
                  onClose();
                }}
                className="w-full text-2xl font-semibold"
              >
                Close
              </Button>
              <form className="w-full" action={applyForTimeslot}>
                <Button
                  disabled={selectedTimeslot === null || isPending}
                  className="flex w-full items-center gap-x-2 text-2xl font-semibold"
                  type="submit"
                >
                  {isPending && <Loader2 className="animate-spin" />}
                  Apply
                </Button>
              </form>
            </div>
            <div>
              <p className="text-center text-sm text-muted-foreground">
                Once timeslot is completed, platform fee is 5%
              </p>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
