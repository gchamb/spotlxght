import { Metadata } from "next";
import { AuthScreen } from "~/components/auth-screen";

export const metadata: Metadata = {
  title: "Venue Sign In",
};

export default function VenueAuth() {
  return <AuthScreen screenType="sign-in" type="venue" />;
}
