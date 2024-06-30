import { Metadata } from "next";
import { AuthScreen } from "~/components/auth-screen";

export const metadata: Metadata = {
  title: "Musician Sign In",
};

export default function MusicAuth() {
  return <AuthScreen screenType="sign-in" type="musician" />;
}
