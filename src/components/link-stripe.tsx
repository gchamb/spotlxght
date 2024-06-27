"use client";

import {
  Link,
  CalendarCheck,
  LucideLockKeyhole,
  HandCoins,
  Loader2,
} from "lucide-react";
import { useTransition } from "react";
import { Button } from "~/components/ui/button";
import { onboardUser } from "~/server/actions/stripe";
import { toast } from "sonner";

export default function LinkStripe() {
  const [isPending, startTransition] = useTransition();

  const handleStripeLink = async () => {
    try {
      startTransition(async () => {
        await onboardUser();
      });
    } catch (err) {
      toast(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="max-screen-xl xl:gap-y-none mx-auto  flex h-full flex-col gap-y-8 ">
      <div className="mt-8 flex flex-col items-center gap-y-2 xl:mt-16 ">
        <h1 className="text-4xl font-semibold">Link Account</h1>
        <span className="text-sm">Securely fund your account</span>
      </div>

      <div className="max-screen-xl flex flex-col flex-wrap gap-8 md:my-auto md:flex-row">
        <div className="mx-auto flex max-w-[300px] flex-col items-center gap-y-8  text-center">
          <Link size={48} />

          <div className="flex flex-col gap-y-4">
            <h2 className="text-2xl font-semibold">Link Bank Account</h2>
            <p className="text-sm">
              Link your bank account via Stripe to receive funds for your
              completed events while ensuring your information remains
              protected.
            </p>
          </div>
        </div>
        <div className="mx-auto flex max-w-[300px] flex-col items-center gap-y-8  text-center">
          <CalendarCheck size={48} />

          <div className="flex flex-col gap-y-4">
            <h2 className="text-2xl font-semibold">Create Event</h2>
            <p className="text-sm">
              Browse the list of events and apply based on your availability
              within the provided time slots created by the venue.
            </p>
          </div>
        </div>
        <div className="mx-auto flex max-w-[300px] flex-col items-center gap-y-8  text-center">
          <LucideLockKeyhole size={48} />

          <div className="flex flex-col gap-y-4">
            <h2 className="text-2xl font-semibold">Escrow Funds</h2>
            <p className="text-sm">
              After the venue accepts you, funds are placed in escrow for
              security for both the venue and musician.
            </p>
          </div>
        </div>
        <div className="mx-auto flex max-w-[300px] flex-col items-center gap-y-8  text-center">
          <HandCoins size={48} />

          <div className="flex flex-col gap-y-4">
            <h2 className="text-2xl font-semibold">Musicians are paid</h2>
            <p className="text-sm">
              Upon the successful completion of an event, the venue can release
              the payment to the musician for their excellent performance.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-auto flex h-36 justify-center pb-4 ">
        <Button
          variant="default"
          className=" items-cente flex h-full max-h-[60px] w-full max-w-[600px] gap-x-2 text-3xl font-semibold"
          onClick={handleStripeLink}
          disabled={isPending}
        >
          {isPending && <Loader2 className="animate-spin" />}
          Link
        </Button>
      </div>
    </div>
  );
}
