import Image from "next/image";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { signIn } from "~/next-auth";
import { Separator } from "~/components/ui/separator";
import { emailSignIn } from "~/server/auth/lib";
import Link from "next/link";

export function SignInForm() {
  return (
    <div className="">
      <div className="bg-underground-dark-grey h-screen w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="bg-underground-dark-grey flex content-center justify-center bg-muted lg:block">
          <Image
            src="/images/concert.jpg"
            alt="Image"
            width="800"
            height="600"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="dark: text-3xl font-bold text-white">
                Join Our Network
              </h1>
            </div>
            <form
              action={async () => {
                "use server";
                await signIn("google");
              }}
            >
              <Button
                variant="outline"
                className="w-full dark:bg-white dark:text-black"
                type="submit"
              >
                Login with Google
              </Button>
            </form>
            <div className="flex w-[9em] items-center justify-between">
              <Separator className="dark:bg-gray-500" />
              <p className="px-6">or</p>
              <Separator className="dark:bg-gray-500" />
            </div>
            <form
              className="grid gap-4"
              action={async (formData) => {
                "use server";

                await emailSignIn(formData);
              }}
            >
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="m@example.com"
                  className="dark:bg-white"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  required
                  className="dark:bg-white"
                />
              </div>
              <Button type="submit" className="mt-2 w-full">
                Login
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
