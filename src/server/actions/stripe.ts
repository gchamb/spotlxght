"use server";

import Stripe from "stripe";
import { redirect } from "next/navigation";
import { stripe } from "../stripe";
import { headers } from "next/headers";
import { getSession } from "~/lib/auth";

export async function onboardUser() {
  const requestHeaders = headers();
  const session = await getSession();

  if (
    session === null ||
    session === undefined ||
    session.user === undefined ||
    session.user.id === undefined
  ) {
    return redirect("/");
  }

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
      return_url: `${requestHeaders.get("origin")}/profile/${session.user.id}`,
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
