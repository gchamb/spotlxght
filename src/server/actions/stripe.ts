"use server";

import { redirect } from "next/navigation";
import { stripe } from "../stripe";
import { headers } from "next/headers";

export async function onboardUser() {
  try {
    const requestHeaders = headers();

    const account = await stripe.accounts.create({
      controller: {
        fees: {
          payer: "application",
        },
      },
    });

    console.log(requestHeaders.get("origin"), account.id);
    // const accountLink = await stripe.accountLinks.create({
    //   account: account.id,
    //   return_url: `${requestHeaders.get("origin")}/return/${account}`,
    //   refresh_url: `${requestHeaders.get("origin")}/refresh/${account}`,
    //   type: "account_onboarding",
    // });

    // console.log(accountLink);

    // redirect(accountLink.url);
  } catch (err) {
    throw new Error(
      err instanceof Error
        ? err.message
        : "Unable to process this request. Try again.",
    );
  }
}
