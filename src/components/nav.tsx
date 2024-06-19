import Link from "next/link";
import { getSession } from "~/lib/auth";

export default async function Nav() {
  const session = await getSession();

  return (
    <nav className="mx-auto w-full max-w-screen-2xl p-4">
      <div className="flex items-center gap-x-24">
        <Link href="/">
          <h1 className="text-xl font-semibold">underground</h1>
        </Link>
        <div>
          {session?.user.type === "venue" && <a href="/my-events">My Events</a>}
          {session?.user.type === "musician" && (
            <a href="/listings">My Events</a>
          )}
        </div>
      </div>
      <div></div>
    </nav>
  );
}
