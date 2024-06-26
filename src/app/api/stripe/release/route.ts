import { stripe } from "~/server/stripe";
import { releaseFundsRequest } from "~/lib/types";
import { db } from "~/server/db";
import { and, eq } from "drizzle-orm";
import { applications, stripeTransfers, timeslots } from "~/server/db/schema";

// release the funds from account to a stripe connected account
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // validate the request
    const valid = releaseFundsRequest.safeParse(data);
    if (!valid.success) {
      const zodError = valid.error.errors[0];
      throw new Error(zodError?.message);
    }

    const { eventId, userId, timeslotId } = valid.data;

    // validate if this applicant is accepted and has a stripe account id
    const applicant = await db.query.applications.findFirst({
      where: and(
        eq(applications.eventId, eventId),
        eq(applications.userId, userId),
        eq(applications.timeslotId, timeslotId),
        eq(applications.status, "accepted"),
      ),
      with: {
        user: {
          columns: {
            stripeAccountId: true,
          },
        },
        event: {
          columns: {
            amount: true,
          },
        },
        timeslot: {
          columns: {
            status: true,
          },
        },
      },
    });

    if (applicant === undefined) {
      return Response.json(null, { status: 400 });
    }

    if (applicant.user.stripeAccountId === null) {
      // NOTE: email user so they can get paid
      return Response.json(null, { status: 400 });
    }

    if (applicant.timeslot.status !== "completed") {
      return Response.json(null, { status: 400 });
    }

    // transfer funds to the stripe connect account
    const transfer = await stripe.transfers.create({
      amount: applicant.event.amount * 100, // have to convert to cents
      currency: "usd",
      destination: applicant.user.stripeAccountId,
      transfer_group: eventId,
    });

    // write the transfer to the db
    await db.insert(stripeTransfers).values({
      id: transfer.id,
      destination: applicant.user.stripeAccountId,
      currency: transfer.currency,
      balanceTransaction: transfer.balance_transaction as string,
      transferGroup: eventId,
      amount: transfer.amount,
      reversed: transfer.reversed,
      timeslotId: timeslotId,
      userId,
    });

    // update the timeslot status to closed.
    await db
      .update(timeslots)
      .set({ status: "closed" })
      .where(eq(timeslots.eventId, eventId));

    return Response.json(null, { status: 200 });
  } catch (err) {
    console.log(err);
    return Response.json(
      { error: "Unable to process this request." },
      { status: 500 },
    );
  }
}
