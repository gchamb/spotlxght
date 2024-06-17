import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type UseFormReturn } from "react-hook-form";
import { getSession } from "~/server/auth/lib";
import { redirect } from "next/navigation";
import { type User } from "next-auth";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isVenueForm(
  form:
    | UseFormReturn<
        {
          venueName: string;
          address: string;
          bannerImage: File | null;
        },
        any,
        undefined
      >
    | UseFormReturn<
        {
          name: string;
          address: string | null;
          bannerImage: File | null;
          profileImage: File | null;
        },
        any,
        undefined
      >,
): form is UseFormReturn<
  {
    venueName: string;
    address: string;
    bannerImage: File | null;
  },
  any,
  undefined
> {
  return "venueName" in form.getValues();
}

export function shortenOrNot(word: string, maxLength = 25) {
  if (word.length < maxLength) {
    return word;
  }

  return `${word.substring(0, maxLength)}...`;
}

export async function getUser(): Promise<User> {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/");
  } else {
    return session.user as User;
  }
}