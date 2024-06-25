import { Loader2, Minus, Plus } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState, useTransition } from "react";
import { createEvent } from "~/server/actions/event-actions";
import { payArray, timeslotsTimes } from "~/lib/types";
import DatePicker from "./ui/date-picker";
import { toast } from "sonner";

export default function CreateEventDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [timeslots, setTimeslots] = useState([crypto.randomUUID()]);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [date, setDate] = useState<string>(new Date());

  const eventOnClose = () => {
    onClose();
    setTimeslots([crypto.randomUUID()]);
    setError("");
    setDate(new Date());
  };

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            Create an Event
          </DialogTitle>
          <DialogDescription className="text-center">
            Share your events for other musicians to book with you.
          </DialogDescription>
        </DialogHeader>
        <form
          action={(data) => {
            startTransition(async () => {
              try {
                if (error !== "") {
                  setError("");
                }

                await createEvent(data);
                eventOnClose();
              } catch (err) {
                const error = err as Error;
                setError(error.message);
              }
            });
          }}
        >
          {error !== "" && (
            <div className="flex justify-center">
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Event Name
              </Label>
              <Input
                name="name"
                id="name"
                placeholder="Jazz Night"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                hidden
                id="date"
                name="date"
                value={date.toUTCString()}
                className="hidden"
              />
              <DatePicker date={date} onSelect={setDate} />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="pay" className="text-right">
                Pay Per Slot
              </Label>
              <Select name="pay">
                <SelectTrigger className="w-[200px] ">
                  <SelectValue placeholder="How much per timeslot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Pay</SelectLabel>
                    {payArray.map((pay) => {
                      return (
                        <SelectItem key={pay} value={`${pay}`}>
                          ${pay}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4">
              <div className="flex w-[100px]  justify-end">
                <Label htmlFor="username" className="">
                  Timeslots
                </Label>
              </div>

              <div className="flex flex-col gap-y-2">
                {timeslots.map((timeslotId, idx) => {
                  return (
                    <div key={timeslotId} className="flex items-center gap-x-2">
                      <Select name={`timeslot-${idx}-start`}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Start Time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Timeslots</SelectLabel>
                            {timeslotsTimes.map((timeslot, idx) => {
                              return (
                                <SelectItem
                                  key={`${timeslotId}-timeslot-start-${idx}`}
                                  value={timeslot}
                                >
                                  {timeslot}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <Select name={`timeslot-${idx}-end`}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="End Time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Timeslots</SelectLabel>
                            {timeslotsTimes.map((timeslot, idx) => {
                              return (
                                <SelectItem
                                  key={`${timeslotId}-timeslot-end-${idx}`}
                                  value={timeslot}
                                >
                                  {timeslot}
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {timeslots.length > 1 && (
                        <Button
                          disabled={isPending}
                          variant="ghost"
                          type="button"
                          onClick={() => {
                            setTimeslots(
                              timeslots.filter((id) => id !== timeslotId),
                            );
                          }}
                        >
                          <Minus />
                        </Button>
                      )}

                      <Button
                        disabled={isPending}
                        variant="ghost"
                        type="button"
                        onClick={() => {
                          if (timeslots.length === 4) {
                            toast(
                              "You can only add up to 4 timeslots per event.",
                            );
                            return;
                          }

                          setTimeslots([...timeslots, crypto.randomUUID()]);
                        }}
                      >
                        <Plus />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={isPending}
              className="flex w-full items-center gap-x-2 text-lg font-semibold"
              onClick={eventOnClose}
              type="button"
            >
              Close
            </Button>
            <Button
              disabled={isPending}
              className="flex w-full items-center gap-x-2 text-lg font-semibold"
              type="submit"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Checkout
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
