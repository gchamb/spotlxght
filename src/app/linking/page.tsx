import { Metadata } from "next";
import { redirect } from "next/navigation";
import LinkStripe from "~/components/link-stripe";
import { getSession } from "~/lib/auth";

export const metadata: Metadata = {
  title: "Link Your Account",
};

export default async function StripeLinking() {
  const session = await getSession();

  if (session === null) {
    return redirect("/musician/auth");
  }

  if (session.user.type !== "musician") {
    return redirect("/");
  }

  return <LinkStripe />;
}
