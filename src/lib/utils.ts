import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenOrNot(word: string, maxLength = 25) {
  if (word.length < maxLength) {
    return word;
  }

  return `${word.substring(0, maxLength)}...`;
}
