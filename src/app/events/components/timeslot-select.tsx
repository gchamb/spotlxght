"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { TimeslotProps } from "./timeslot-tabs";
import { useState } from "react";
import ApplicantRow from "./applicant-row";

export default function TimeslotSelect({
  timeslots,
  applicants,
}: TimeslotProps) {
  const [timeslotId, setTimeslotId] = useState(timeslots[0]?.id);
  const [timeslotData, setTimeslotData] = useState<
    TimeslotProps["timeslots"][number] | undefined
  >(timeslots.find((t) => t.id === timeslotId));

  return (
    <div className="flex flex-col gap-y-8 md:hidden ">
      <Select
        defaultValue={timeslotId}
        onValueChange={(timeslotId) => {
          console.log(timeslotId);
          setTimeslotId(timeslotId);
          setTimeslotData(timeslots.find((t) => t.id === timeslotId));
        }}
      >
        <SelectTrigger className="mx-auto w-[180px]">
          <SelectValue placeholder="Timeslot" />
        </SelectTrigger>
        <SelectContent>
          {timeslots.map((timeslot) => {
            return (
              <SelectItem
                onClick={() => {
                  if (timeslot.id === timeslotId) {
                    return;
                  }
                  console.log(timeslotId);
                  setTimeslotId(timeslot.id);
                }}
                key={timeslot.id}
                value={timeslot.id}
              >
                {timeslot.startTime} - {timeslot.endTime}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <div>
        {applicants
          .filter(
            (applicant) => applicant.applicantData?.timeslotId === timeslotId,
          )
          .map((applicant) => {
            return (
              <ApplicantRow
                key={applicant.id}
                applicant={applicant}
                timeslotStatus={timeslotData?.status ?? "open"}
              />
            );
          })}
      </div>
    </div>
  );
}
