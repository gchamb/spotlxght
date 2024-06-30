import { Metadata } from "next";
import Onboarding from "~/components/onboarding";

export const metadata: Metadata = {
  title: "Onboarding",
};

export default function MusicianOnboarding() {
  return <Onboarding type="musician" />;
}
