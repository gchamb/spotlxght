import { useQuery } from "@tanstack/react-query";
import { UserType } from "~/lib/types";

const fetchSession = (): Promise<{
  userId: string;
  type: UserType | null;
  sessionToken: string;
  expires: Date;
} | null> =>
  fetch("/api/auth/session").then(async (session) => {
    const data = (await session.json()) as {
      userId: string;
      type: UserType | null;
      sessionToken: string;
      expires: Date;
    } | null;

    return data;
  });

export function useSession() {
  return useQuery({ queryKey: ["getSession"], queryFn: fetchSession });
}
