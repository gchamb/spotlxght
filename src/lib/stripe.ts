import { stripe } from "~/server/stripe";
import crypto from "crypto";
import { eq } from "drizzle-orm";
import { db } from "~/server/db";
import { events, stripeCheckouts, stripePayouts } from "~/server/db/schema";
import Stripe from "stripe";

/**
 *
 * @param amount
 * @param userId
 * @param redirect
 * @returns Stripe object
 *
 */
export function createCheckoutSession(
  amount: number,
  redirect: string,
  productDescription?: string,
  metadata?: Record<string, string>,
) {
  const platformFee = amount * 0.05;

  return stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name:
              productDescription ?? "Creating an event for musicians to apply.",
          },
          unit_amount: (amount + platformFee) * 100,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      transfer_group: metadata?.eventId,
    },
    metadata: {
      ...metadata,
    },
    mode: "payment",
    success_url: redirect,
  });
}

export async function handleStripeCheckoutSuccess(
  data: Stripe.Checkout.Session,
) {
  if (!data.metadata) {
    return Response.json(
      {
        error: "Invalid Request",
      },
      { status: 400 },
    );
  }

  const { userId, eventId } = data.metadata;
  if (userId === undefined || eventId === undefined) {
    return Response.json(
      {
        error: "Invalid Request",
      },
      { status: 400 },
    );
  }

  // events aren't available for musicians until the event is paid for
  if (data.payment_status === "paid") {
    await db
      .update(events)
      .set({
        status: "open",
      })
      .where(eq(events.id, eventId));
  }

  await db.transaction(async (transaction) => {
    const [session] = await transaction
      .select()
      .from(stripeCheckouts)
      .where(eq(stripeCheckouts.checkoutSessionId, data.id));

    if (session === undefined) {
      // create checkout session
      await transaction.insert(stripeCheckouts).values({
        checkoutSessionId: data.id,
        eventId,
        userId,
        amount: data.amount_total ?? 0 / 100,
        status: data.status ?? "",
        paymentStatus: data.payment_status,
      });
      return;
    }

    // update if already exist
    await transaction
      .update(stripeCheckouts)
      .set({
        status: data.status ?? "",
        paymentStatus: data.payment_status,
      })
      .where(eq(stripeCheckouts.checkoutSessionId, data.id));
  });
}

export async function handleStripeCheckoutFailure(
  data: Stripe.Checkout.Session,
) {
  if (!data.metadata) {
    return Response.json(
      {
        error: "Invalid Request",
      },
      { status: 400 },
    );
  }

  const { userId, eventId } = data.metadata;
  if (userId === undefined || eventId === undefined) {
    return Response.json(
      {
        error: "Invalid Request",
      },
      { status: 400 },
    );
  }

  await db.transaction(async (transaction) => {
    const [session] = await transaction
      .select()
      .from(stripeCheckouts)
      .where(eq(stripeCheckouts.checkoutSessionId, data.id));

    if (session === undefined) {
      // create checkout session
      await transaction.insert(stripeCheckouts).values({
        checkoutSessionId: data.id,
        eventId,
        userId,
        amount: data.amount_total ?? 0 / 100,
        status: data.status ?? "",
        paymentStatus: data.payment_status,
      });
      return;
    }

    // update if already exist
    await transaction
      .update(stripeCheckouts)
      .set({
        status: data.status ?? "",
        paymentStatus: data.payment_status,
      })
      .where(eq(stripeCheckouts.checkoutSessionId, data.id));
  });

  // send email to user that the payment failed so the event will not be available
}

export function insertPayout(values: typeof stripePayouts.$inferInsert) {
  return db.insert(stripePayouts).values(values);
}
