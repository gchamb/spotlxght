"use server";

import { type Stripe } from "stripe";
import { redirect } from "next/navigation";
import { stripe } from "../stripe";
import { headers } from "next/headers";
import { getSession } from "~/lib/auth";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { releaseFundsRequest, ReleaseFundsRequest } from "~/lib/types";

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
    return {
      message:
        err instanceof Error
          ? err.message
          : "Unable to process your request. Try again.",
    };
  }

  // you have to do the redirect outside of try/catch
  redirect(accountLink.url);
}

// I did this instead of calling the route directly because revalidate path wasn't working in api routes
// we need that endpoint so it can be called from the cron jobs as well
export async function transfer(data: ReleaseFundsRequest) {
  try {
    // validate the request
    const valid = releaseFundsRequest.safeParse(data);
    if (!valid.success) {
      const zodError = valid.error.errors[0];
      throw new Error(zodError?.message);
    }

    const origin = headers().get("origin");

    if (origin === null) {
      throw new Error("Invalid Request.");
    }

    await fetch(`${origin}/api/stripe/release`, {
      method: "POST",
      body: JSON.stringify(valid.data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    revalidatePath(`/events/${valid.data.eventId}`, "page");
  } catch (err) {
    return {
      message:
        err instanceof Error
          ? err.message
          : "Unable to process your request. Try again.",
    };
  }
}
