import Onboarding from "~/components/onboarding";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Onboarding",
};

export default function VenueOnboarding() {
  return <Onboarding type="venue" />;
}
