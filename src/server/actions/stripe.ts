"use server";

import { type Stripe } from "stripe";
import { redirect } from "next/navigation";
import { stripe } from "../stripe";
import { headers } from "next/headers";
import { getSession } from "~/lib/auth";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export async function onboardUser() {
  const requestHeaders = headers();
  const session = await getSession();

  if (!session || !session.user) {
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

    // update user account
    await db
      .update(users)
      .set({ stripeAccountId: account.id })
      .where(eq(users.id, session.userId));

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
