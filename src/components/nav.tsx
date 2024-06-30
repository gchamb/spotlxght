import Link from "next/link";
import { getSession } from "~/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Book, CalendarDays, MicVocal, User } from "lucide-react";
import SignOut from "./signout-dropdown-item";
import { getInitials } from "~/lib/utils";
import { getSasUrl } from "~/lib/azure";
import SignOutNavItems from "~/components/signed-out-nav-items";

export default async function Nav() {
  const session = await getSession();

  const showLoggedInNavItems =
    session?.user.type === "venue" ||
    (session?.user.type === "musician" && session?.user.stripeAccountId);

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
            <h1 className="text-xl font-semibold lg:pl-1">spotlxght</h1>
          </Link>
          <div className="hidden items-end gap-12 lg:flex">
            <>
              {session?.user.type === "venue" && (
                <Link href="/my-events">My Events</Link>
              )}

              {session?.user.type !== "venue" && (
                <Link href="/listings">Listings</Link>
              )}

              {session?.user.type === "musician" && (
                <>
                  <Link href="/applications">Applications</Link>
                </>
              )}
            </>
          </div>
        </div>

        {showLoggedInNavItems ? (
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
              <Link href={`/profile/${session.userId}`}>
                <DropdownMenuItem className="md:text-md flex cursor-pointer items-center gap-x-4 text-xs">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Profile
                </DropdownMenuItem>
              </Link>

              {session.user.type === "venue" ? (
                <>
                  <Link href="/my-events" className="lg:hidden">
                    <DropdownMenuItem className="md:text-md flex cursor-pointer items-center gap-x-4 text-xs ">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      My Events
                    </DropdownMenuItem>
                  </Link>
                </>
              ) : (
                <>
                  <Link className="lg:hidden" href="/listings">
                    <DropdownMenuItem className="md:text-md flex cursor-pointer items-center gap-x-4 text-xs">
                      <MicVocal className="h-4 w-4 text-muted-foreground" />
                      Listings
                    </DropdownMenuItem>
                  </Link>

                  <Link className="lg:hidden" href="/applications">
                    <DropdownMenuItem className="md:text-md flex cursor-pointer items-center gap-x-4 text-xs">
                      <Book className="h-4 w-4 text-muted-foreground" />
                      Applications
                    </DropdownMenuItem>
                  </Link>
                </>
              )}
              <SignOut />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <SignOutNavItems />
          </>
        )}
      </div>
    </nav>
  );
}
