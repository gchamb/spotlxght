import Link from "next/link";

export default function Nav() {
  // NOTE: appropriately render based on user type (venue or musician)
  return (
    <nav className="mx-auto w-full max-w-screen-2xl p-4">
      <div>
        <Link href="/">
          <h1 className="text-xl font-semibold">underground</h1>
        </Link>
      </div>
      <div></div>
    </nav>
  );
}
