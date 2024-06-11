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
          location: string;
          bannerImage: File | null;
        },
        any,
        undefined
      >
    | UseFormReturn<
        {
          name: string;
          location: string;
          bannerImage: File | null;
          profileImage: File | null;
        },
        any,
        undefined
      >,
): form is UseFormReturn<
  {
    venueName: string;
    location: string;
    bannerImage: File | null;
  },
  any,
  undefined
> {
  return "venueName" in form.getValues();
}
