import { Check, Music, User, X } from "lucide-react";
import { TimeslotProps } from "./timeslot-tabs";
import { Button } from "~/components/ui/button";
import Ratings from "~/components/ui/ratings";
import Chip from "~/components/ui/chip";
import Link from "next/link";
import { useState } from "react";
import AssetsDialog from "./assets-dialog";

type ApplicantRowProps = {
  applicant: TimeslotProps["applicants"][number];
};

export default function ApplicantRow({ applicant }: ApplicantRowProps) {
  const [viewPerformances, setViewPerformances] = useState(false);

  return (
    <div className="relative grid grid-rows-5 items-center rounded-2xl bg-underground-dark-grey p-4 drop-shadow-lg lg:grid-cols-5  lg:grid-rows-none lg:gap-4">
      <div className="flex flex-col items-center gap-1">
        <div className="mx-auto h-[75px] w-[75px] lg:m-0">
          <img
            className="rounded w-full h-full object-cover"
            src={applicant.profilePicImage ?? "/images/default-profile2.png"}
          />
        </div>

        <span className="text-center">{applicant.name}</span>
      </div>

      {/* will add later */}
      {/* <div className="flex justify-center">
          <Ratings rating={3} />
        </div> */}

      <div className="flex justify-center">
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
      <span className="text-center">
        {applicant.applicantData?.appliedAt.toISOString()}
      </span>
      {applicant.applicantData?.status === "requested" && (
        <div className="flex justify-center gap-x-2">
          <Button variant="ghost">
            <Check className="text-green-500" />
          </Button>
          <Button variant="ghost">
            <X className="text-red-500" />
          </Button>
        </div>
      )}
      <div className="absolute bottom-2 left-0 right-0  flex justify-center gap-x-2 lg:right-2 lg:justify-end ">
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
      </div>
    </div>
  );
}
