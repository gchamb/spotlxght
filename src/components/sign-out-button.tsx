import { signOut } from "~/server/auth/lib";

export async function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        console.log("Signing out...");
        await signOut();
      }}
    >
      <button type="submit">Sign Out</button>
    </form>
  );
}
