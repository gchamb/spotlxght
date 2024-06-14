import { signIn } from "~/auth";

export function SignIn() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google");
      }}
    >
      <button type="submit" className="rounded-xl bg-black p-4 drop-shadow-2xl">
        Signin with Google
      </button>
    </form>
  );
}
