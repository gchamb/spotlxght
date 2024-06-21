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
} | null> => fetch("/api/auth/session").then((session) => session.json());

export function useSession() {
  return useQuery({ queryKey: ["getSession"], queryFn: fetchSession });
}
