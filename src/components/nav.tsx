import Link from "next/link";
import { getSession, signOut } from "~/lib/auth";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { CalendarDays, Menu, MicVocal, User } from "lucide-react";
import SignOut from "./signout-dropdown-item";
import { getSasUrl } from "~/lib/azure";
import { getInitials } from "~/lib/utils";
import { Button } from "./ui/button";

export default async function Nav() {
  const session = await getSession();

  let profilePicImage = "/images/default-profile2.png";
  if (session?.user.profilePicImage) {
    profilePicImage = await getSasUrl(
      session.user.profilePicImage,
      "profile-pic",
    );
  }

  return (
    <nav className="mx-auto w-full max-w-screen-xl p-4">
      <div className="flex items-center justify-between gap-x-24">
        <div className="flex items-center gap-24">
          <Link href="/">
            <h1 className="text-xl font-semibold">underground</h1>
          </Link>
          <div className=" hidden justify-between gap-x-10 lg:flex">
            <Link className="hover:font-semibold" href="/listings">
              Listings
            </Link>

            {session?.user.type === "venue" && (
              <Link className="hover:font-semibold" href="/my-events">
                My Events
              </Link>
            )}
          </div>
        </div>

        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage src={profilePicImage} />
                <AvatarFallback>
                  {getInitials(session.user.name ?? "") ?? "UG"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link
                  className="md:text-md flex items-center gap-x-4 text-xs"
                  href={`/profile/${session.userId}`}
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem className="lg:hidden">
                <Link
                  className="md:text-md flex items-center gap-x-4 text-xs"
                  href="/listings"
                >
                  <MicVocal className="h-4 w-4 text-muted-foreground" />
                  Listings
                </Link>
              </DropdownMenuItem>

              {session.user.type === "venue" ? (
                <>
                  <DropdownMenuItem className="lg:hidden">
                    <Link
                      href="/my-events"
                      className="md:text-md flex flex items-center gap-x-4 text-xs "
                    >
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      My Events
                    </Link>
                  </DropdownMenuItem>
                </>
              ) : (
                <>{/* musician specific links such as bookings */}</>
              )}
              <SignOut />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="lg:hidden" asChild>
              <Button variant="ghost">
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link
                  className="md:text-md flex items-center gap-x-4 text-xs"
                  href="/listings"
                >
                  <MicVocal className="h-4 w-4 text-muted-foreground" />
                  Listings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
