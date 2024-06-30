import { Metadata } from "next";
import { AuthScreen } from "~/components/auth-screen";

export const metadata: Metadata = {
  title: "Musician Sign Up",
};

export default function MusicianSignUp() {
  return <AuthScreen screenType="sign-up" type="musician" />;
}
