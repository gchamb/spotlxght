import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { UseFormReturn } from "react-hook-form";

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
          address: string;
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
