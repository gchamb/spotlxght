import { stripe } from "~/server/stripe";
import { Stripe } from "stripe";
import { env } from "~/env";
import { db } from "~/server/db";
import { events, stripeCheckouts } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import {
  handleStripeCheckoutFailure,
  handleStripeCheckoutSuccess,
} from "~/lib/stripe";

// stripe webhook for the following
// customer creation
// subscription creation
// subscription updates
export async function POST(request: Request) {
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return Response.json({ error: "Invalid Request." }, { status: 500 });
  }

  const stripeSignature = request.headers.get("stripe-signature");
  if (!stripeSignature) {
    return Response.json({ error: "Invalid Request." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const body = await request.text();
    event = stripe.webhooks.constructEvent(
      body,
      stripeSignature,
      webhookSecret,
    );
  } catch (err) {
    return Response.json({ error: "Invalid Request." }, { status: 400 });
  }

  console.log("entering events");
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutData = event.data.object;
      await handleStripeCheckoutSuccess(checkoutData);
      return new Response(null, { status: 200 });
    case "checkout.session.async_payment_succeeded":
      const asyncCheckoutData = event.data.object;
      await handleStripeCheckoutSuccess(asyncCheckoutData);
      return new Response(null, { status: 200 });
    case "checkout.session.async_payment_failed":
      const failedCheckoutData = event.data.object;
      await handleStripeCheckoutFailure(failedCheckoutData);
      return new Response(null, { status: 200 });
    default:
      return new Response(null, { status: 200 });
  }
}
