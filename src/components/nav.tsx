import Link from "next/link";

export default function Nav() {
  // NOTE: appropriately render based on user type (venue or musician)
  return (
    <nav className="mx-auto w-full max-w-screen-xl p-4">
      <div>
        <Link href="/" className="block w-fit">
          <h1 className="w-fit text-xl font-semibold">underground</h1>
        </Link>
      </div>
    </nav>
  );
}
