import { Minus, Plus } from "lucide-react";
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
import { useState } from "react";
import { createEvent } from "~/server/actions/event-actions";
import { timeslotsTimes } from "~/lib/types";
import DatePicker from "./ui/date-picker";

export default function CreateEventDialog() {
  const [timeslots, setTimeslots] = useState([crypto.randomUUID()]);
  const [error, setError] = useState("");
  const [date, setDate] = useState<Date>(new Date());

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          setTimeslots([crypto.randomUUID()]);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="default">Create Event</Button>
      </DialogTrigger>
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
          action={async (data) => {
            try {
              await createEvent(data);
            } catch (err) {
              // console.log(err.message);
            }
          }}
        >
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
                Pay
              </Label>
              <Select name="pay">
                <SelectTrigger className="w-[200px] ">
                  <SelectValue placeholder="How much per timeslot" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Pay</SelectLabel>
                    <SelectItem value="50">$50</SelectItem>
                    <SelectItem value="75">$75</SelectItem>
                    <SelectItem value="100">$100</SelectItem>
                    <SelectItem value="125">$125</SelectItem>
                    <SelectItem value="150">$150</SelectItem>
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
                          variant="ghost"
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
                        variant="ghost"
                        onClick={() => {
                          if (timeslots.length === 4) {
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
            <Button className="w-full text-lg font-semibold" type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
