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
          <div>
            {session?.user.type === "venue" && (
              <a className="hover:font-semibold" href="/my-events">
                My Events
              </a>
            )}
            {session?.user.type === "musician" && (
              <a className="hover:font-semibold" href="/listings">
                Listings
              </a>
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
