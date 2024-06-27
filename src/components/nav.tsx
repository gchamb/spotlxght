import Link from "next/link";
import { getSession, signOut } from "~/lib/auth";
import { Button } from "~/components/ui/button";

export default async function Nav() {
  const session = await getSession();

  return (
    <nav className="mx-auto w-full max-w-screen-xl p-4">
      <div className="flex items-center justify-between gap-x-24">
        <div className="flex items-center gap-24">
          <Link href="/">
            <h1 className="text-xl font-semibold">underground</h1>
          </Link>
          <div className="flex items-end gap-12">
            {session?.user.type === "venue" && (
              <a href="/my-events">My Events</a>
            )}
            {session?.user.type === "musician" && (
              <a href="/listings">Listings</a>
            )}
            {session?.user.type === "musician" && (
              <a href="/bookings">Bookings</a>
            )}
          </div>
        </div>
        {session && (
          <form action={signOut}>
            <Button type="submit">Sign Out</Button>
          </form>
        )}
      </div>
      <div></div>
    </nav>
  );
}
