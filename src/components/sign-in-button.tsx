import { signIn } from "~/next-auth";

export function SignInButton() {
  const action = async () => {
    "use server";
    await signIn("google", { redirectTo: "/home" });
  };

  return (
    <form action={action}>
      <button
        type="submit"
        className="rounded-xl bg-black p-4 text-white drop-shadow-2xl"
      >
        Signin with Google
      </button>
    </form>
  );
}
