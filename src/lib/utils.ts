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
          bannerImage?: File | undefined;
        },
        any,
        undefined
      >
    | UseFormReturn<
        {
          name: string;
          location: string;
          bannerImage?: File | undefined;
          profileImage?: File | undefined;
        },
        any,
        undefined
      >,
): form is UseFormReturn<
  {
    venueName: string;
    location: string;
    bannerImage?: File | undefined;
  },
  any,
  undefined
> {
  return "venueName" in form.getValues();
}
