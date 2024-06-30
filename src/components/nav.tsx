import Link from "next/link";
import { getSession } from "~/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Book, CalendarDays, Menu, MicVocal, User } from "lucide-react";
import SignOut from "./signout-dropdown-item";
import { getSasUrl } from "~/lib/azure";
import { getInitials } from "~/lib/utils";
import { Button } from "./ui/button";

export default async function Nav() {
  const session = await getSession();
  const showNavItems =
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
    <nav className="container mx-auto w-full max-w-screen-xl p-4">
      <div className="flex items-center justify-between gap-x-24">
        <div className="flex items-center gap-24">
          <Link href="/">
            <h1 className="pl-3 text-xl font-semibold">spotlxght</h1>
          </Link>
          <div className="hidden items-end gap-12 lg:flex">
            {showNavItems && (
              <>
                {session?.user.type === "venue" && (
                  <Link href="/my-events">My Events</Link>
                )}

                {session?.user.type === "musician" && (
                  <>
                    <Link href="/listings">Listings</Link>
                    <Link href="/applications">Applications</Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {showNavItems ? (
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
          <DropdownMenu>
            <DropdownMenuTrigger className="lg:hidden" asChild>
              <Button variant="ghost">
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href="/listings">
                <DropdownMenuItem className="md:text-md flex items-center gap-x-4 text-xs">
                  <MicVocal className="h-4 w-4 text-muted-foreground" />
                  Listings
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
