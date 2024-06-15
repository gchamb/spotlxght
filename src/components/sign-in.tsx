import { signIn } from "~/auth";
import { UserType } from "~/lib/types";

export function SignIn({ type }: { type: UserType }) {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", { redirectTo: `/${type}/onboarding` });
      }}
    >
      <button type="submit" className="rounded-xl bg-black p-4 drop-shadow-2xl">
        Signin with Google
      </button>
    </form>
  );
}
