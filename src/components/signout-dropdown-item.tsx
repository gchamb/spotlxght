"use client";

import { DropdownMenuItem } from "~/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOut } from "~/lib/auth";

export default function SignOut() {
  return (
    <DropdownMenuItem
      onClick={() => signOut()}
      className="md:text-md flex cursor-pointer items-center gap-x-4 text-xs"
    >
      <LogOut className="h-4 w-4 text-muted-foreground" />
      Sign Out
    </DropdownMenuItem>
  );
}
