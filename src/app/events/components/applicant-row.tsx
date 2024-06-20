import { Check, Music, User, X } from "lucide-react";
import { TimeslotProps } from "./timeslot-tabs";
import { Button } from "~/components/ui/button";
import Ratings from "~/components/ui/ratings";
import Chip from "~/components/ui/chip";
import Link from "next/link";
import { useState } from "react";
import AssetsDialog from "./assets-dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

type ApplicantRowProps = {
  applicant: TimeslotProps["applicants"][number];
};

export default function ApplicantCard({ applicant }: ApplicantRowProps) {
  const [viewPerformances, setViewPerformances] = useState(false);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-center gap-1">
          <div className="mx-auto h-[75px] w-[75px] lg:m-0">
            <img
              className="h-full w-full rounded object-cover"
              src={applicant.profilePicImage ?? "/images/default-profile2.png"}
            />
          </div>

          <span className="text-center">{applicant.name}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative grid grid-rows-3 gap-y-2 items-center rounded-2xl">
          {/* will add later */}
          {/* <div className="flex justify-center">
          <Ratings rating={3} />
        </div> */}

          <div className="flex flex-col items-center justify-center gap-1">
            <span className="text-lg font-semibold">Status</span>
            <Chip
              text={applicant.applicantData?.status ?? ""}
              color={
                applicant.applicantData?.status === "requested"
                  ? "gray"
                  : applicant.applicantData?.status === "accepted"
                    ? "green"
                    : applicant.applicantData?.status === "rejected"
                      ? "red"
                      : "gray"
              }
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="text-lg font-semibold">Applied At</span>
            <span className="text-center">
              {applicant.applicantData?.appliedAt.toISOString()}
            </span>
          </div>
          {applicant.applicantData?.status === "requested" && (
            <div className="flex flex-col items-center justify-center gap-1">
              <span className="text-center text-lg font-semibold">Options</span>
              <div className="flex justify-center gap-x-2">
                <Button variant="ghost">
                  <Check className="text-green-500" />
                </Button>
                <Button variant="ghost">
                  <X className="text-red-500" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button variant="ghost">
          <Link
            className="flex items-center gap-x-2"
            href={`/profile/${applicant.applicantData?.userId}`}
          >
            <User />
            View Profile
          </Link>
        </Button>
        <AssetsDialog name={applicant.name ?? ""} assets={applicant.assets} />
      </CardFooter>
    </Card>
  );
}
