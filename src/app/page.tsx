import { SignIn } from "~/components/sign-in";

export default function HomePage() {
  return (
    <main className=" flex flex-col min-h-screen items-center justify-center gap-4">
      <a href="/musician/auth">Musician</a>
      <a href="/venue/auth">Venue</a>
    </main>
  );
}
