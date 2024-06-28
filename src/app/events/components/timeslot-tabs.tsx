"use client";

import { Check, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ApplicationStatus, EventStatus } from "~/lib/types";
import ApplicantRow from "./applicant-row";

export type TimeslotProps = {
  timeslots: {
    id: string;
    startTime: string;
    endTime: string;
    status: EventStatus;
  }[];

  applicants: {
    id: string;
    name: string | null;
    profilePicImage: string | null;
    assets: {
      mimetype: string;
      azureBlobKey: string;
    }[];
    applicantData?: {
      userId: string;
      timeslotId: string;
      status: ApplicationStatus;
      eventId: string;
      appliedAt: Date;
    };
  }[];
};

export default function TimeslotTabs({ timeslots, applicants }: TimeslotProps) {
  console.log(applicants[0]?.assets);
  return (
    <Tabs
      defaultValue={timeslots[0]?.id}
      className="hidden text-center md:block "
    >
      <TabsList>
        {timeslots.map((timeslot) => {
          return (
            <TabsTrigger key={`${timeslot.id}-trigger`} value={timeslot.id}>
              {timeslot.startTime} - {timeslot.endTime}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {timeslots.map((timeslot) => {
        return (
          <TabsContent
            className="grid grid-cols-3 gap-4 py-4 md:grid-cols-2 2xl:grid-cols-3"
            key={`${timeslot.id}-content`}
            value={timeslot.id}
          >
            {applicants
              .filter(
                (applicant) =>
                  applicant.applicantData?.timeslotId === timeslot.id,
              )
              .map((applicant) => {
                return (
                  <ApplicantRow
                    key={applicant.id}
                    applicant={applicant}
                    timeslotStatus={timeslot.status}
                  />
                );
              })}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
