import { Metadata } from "next";
import { AuthScreen } from "~/components/auth-screen";

export const metadata: Metadata = {
  title: "Venue Sign Up",
};

export default function VenueSignUp() {
  return <AuthScreen screenType="sign-up" type="venue" />;
}
