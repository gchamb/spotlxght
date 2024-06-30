"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Key, Menu, MicVocal } from "lucide-react";

export default function SignedOutNavItems() {
  const pathname = usePathname();
  const showLoginButtonsWhenNotLoggedIn =
    pathname === "/" ||
    pathname === "/listings" ||
    pathname.includes("/profile");

  return (
    <>
      {showLoginButtonsWhenNotLoggedIn && (
        <div className="hidden gap-12 lg:flex">
          <Link href={"/venue/auth"}>
            <Button>Venue Login</Button>
          </Link>
          <Link href={"/musician/auth"}>
            <Button>Musician Login</Button>
          </Link>
        </div>
      )}
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="lg:hidden" asChild>
            <Button variant="ghost">
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="lg:hidden" align="end">
            {showLoginButtonsWhenNotLoggedIn && (
              <>
                <Link href="/venue/auth">
                  <DropdownMenuItem className="md:text-md flex items-center gap-x-4 text-xs">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    Venue Login
                  </DropdownMenuItem>
                </Link>
                <Link href="/musician/auth">
                  <DropdownMenuItem className="md:text-md flex items-center gap-x-4 text-xs">
                    <Key className="h-4 w-4 text-muted-foreground" />
                    Musician Login
                  </DropdownMenuItem>
                </Link>
              </>
            )}
            <Link href="/listings">
              <DropdownMenuItem className="md:text-md flex items-center gap-x-4 text-xs">
                <MicVocal className="h-4 w-4 text-muted-foreground" />
                Listings
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
