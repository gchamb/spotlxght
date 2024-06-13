"use server";

import { redirect } from "next/navigation";
import { stripe } from "../stripe";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function onboardUser() {
  const requestHeaders = headers();

  // NOTE: authenticate request that returns userId
  const userId = "123";

  let accountLink: Stripe.Response<Stripe.AccountLink>;
  try {
    const account = await stripe.accounts.create({
      controller: {
        losses: {
          payments: "application",
        },
        fees: {
          payer: "application",
        },
        stripe_dashboard: {
          type: "express",
        },
      },
    });
    accountLink = await stripe.accountLinks.create({
      account: account.id,
      return_url: `${requestHeaders.get("origin")}/profile/${userId}`,
      refresh_url: `${requestHeaders.get("origin")}/musician/onboarding`,
      type: "account_onboarding",
    });
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "Unable to process this request. Try again.",
    );
  }

  // you have to do the redirect outside of try/catch
  redirect(accountLink.url);
}
