import { stripe } from "~/server/stripe";
import { Stripe } from "stripe";
import { env } from "~/env";
import {
  handleStripeCheckoutFailure,
  handleStripeCheckoutSuccess,
  insertPayout,
} from "~/lib/stripe";

// stripe webhook for the following
// stripe checkout
// stripe payout
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

    // payouts are from connected accounts to their personal accounts
    case "payout.paid":
      const payoutPaidData = event.data.object;
      await insertPayout({
        id: payoutPaidData.id,
        status: payoutPaidData.status,
        stripeAccountId: "NULL", // will add later this requires figuring out are will allowing manual or scheduled payouts
        currency: payoutPaidData.currency,
        amount: payoutPaidData.amount,
      });
      return new Response(null, { status: 200 });
    case "payout.failed":
      const payoutFailedData = event.data.object;
      await insertPayout({
        id: payoutFailedData.id,
        status: payoutFailedData.status,
        stripeAccountId: "NULL", // will add later this requires figuring out are will allowing manual or scheduled payouts
        currency: payoutFailedData.currency,
        amount: payoutFailedData.amount,
      });
      return new Response(null, { status: 200 });
    default:
      return new Response(null, { status: 200 });
  }
}
