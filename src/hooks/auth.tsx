import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { UserType } from "~/lib/types";

const fetchSession = (): Promise<{
  type: UserType | null;
  sessionToken: string;
  expires: Date;
} | null> =>
  fetch("/api/auth/session").then(async (session) => {
    const data = (await session.json()) as {
      type: UserType | null;
      sessionToken: string;
      expires: Date;
    } | null;

    return data;
  });

export function useSession() {
  return useQuery({ queryKey: ["getSession"], queryFn: fetchSession });
}
