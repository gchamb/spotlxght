import { auth } from "~/auth";

export default async function Nav() {
  const session = await auth();

  console.log(session);

  return (
    <nav className="mx-auto w-full max-w-screen-2xl p-4">
      <div className="flex items-center gap-x-24">
        <a href="/">
          <h1 className="text-xl font-semibold">underground</h1>
        </a>
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
