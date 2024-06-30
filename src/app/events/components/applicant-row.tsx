import { Check, HandCoins, Loader, Loader2, User, X } from "lucide-react";
import { TimeslotProps } from "./timeslot-tabs";
import { Button } from "~/components/ui/button";
// import Ratings from "~/components/ui/ratings";
import Chip from "~/components/ui/chip";
import Link from "next/link";
import { useState, useTransition } from "react";
import AssetsDialog from "./assets-dialog";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { setEventApplicantStatus } from "~/server/actions/event-actions";
import { toast } from "sonner";
import {
  EventStatus,
  ReleaseFundsRequest,
  SetApplicantStatusRequest,
} from "~/lib/types";
import { transfer } from "~/server/actions/stripe";

type ApplicantRowProps = {
  applicant: TimeslotProps["applicants"][number];
  timeslotStatus: EventStatus;
};

export default function ApplicantCard({
  applicant,
  timeslotStatus,
}: ApplicantRowProps) {
  const [isPending, startTransition] = useTransition();
  const [selectedStatus, setSelectedStatus] =
    useState<SetApplicantStatusRequest["status"]>();

  const setApplicantStatus = (status: SetApplicantStatusRequest["status"]) => {
    startTransition(async () => {
      setSelectedStatus(status);
      const error = await setEventApplicantStatus({
        eventId: applicant.applicantData?.eventId ?? "",
        applicantId: applicant.applicantData?.userId ?? "",
        timeslotId: applicant.applicantData?.timeslotId ?? "",
        status,
      });

      if (error) {
        toast(error.message);
      }

      setSelectedStatus(undefined);
    });
  };

  const releaseFunds = (data: ReleaseFundsRequest) => {
    if (data.eventId === "" || data.userId === "" || data.timeslotId === "") {
      toast("Unable to release funds");
      return;
    }

    startTransition(async () => {
      const error = await transfer(data);
      if (error) {
        toast(error.message);
      } else {
        toast("Successfully released the funds.");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-center gap-1">
          <div className="mx-auto h-[75px] w-[75px] lg:m-0">
            <img
              className="h-full w-full rounded object-cover"
              src={applicant.profilePicImage ?? "/images/default-profile2.png"}
              alt="profile picture"
            />
          </div>

          <span className="text-center">{applicant.name}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative grid grid-rows-3 items-center gap-y-2 rounded-2xl">
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

          <div className="flex flex-col items-center">
            <Button variant="ghost">
              <Link
                className="flex items-center gap-x-2"
                href={`/profile/${applicant.applicantData?.userId}`}
              >
                <User />
                View Profile
              </Link>
            </Button>
            <AssetsDialog
              name={applicant.name ?? ""}
              assets={applicant.assets}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="relative justify-center">
        {applicant.applicantData?.status === "requested" && (
          <div className="flex flex-col items-center justify-center gap-1">
            <span className="text-center text-lg font-semibold">Options</span>
            <div className="flex justify-center gap-x-2">
              <form action={() => setApplicantStatus("accepted")}>
                <Button
                  className="flex items-center gap-x-2"
                  disabled={isPending}
                  variant="ghost"
                >
                  Accept
                  {selectedStatus === "accepted" && isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <Check className="text-green-500" />
                  )}
                </Button>
              </form>
              <form action={() => setApplicantStatus("rejected")}>
                <Button
                  className="flex items-center gap-x-2"
                  disabled={isPending}
                  variant="ghost"
                >
                  Reject
                  {selectedStatus === "rejected" && isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <X className="text-red-500" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        )}

        {applicant.applicantData?.status === "accepted" &&
          timeslotStatus === "completed" && (
            <div>
              <Button
                disabled={isPending}
                onClick={() =>
                  releaseFunds({
                    eventId: applicant.applicantData?.eventId ?? "",
                    userId: applicant.applicantData?.userId ?? "",
                    timeslotId: applicant.applicantData?.timeslotId ?? "",
                  })
                }
                className="flex items-center gap-x-2"
              >
                {isPending && <Loader2 className="animate-spin" />}
                <HandCoins />
                Release Funds
              </Button>
            </div>
          )}
      </CardFooter>
    </Card>
  );
}
