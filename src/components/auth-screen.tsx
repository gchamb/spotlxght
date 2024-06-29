"use client";

import {
  type Credentials,
  credentialsSchema,
  type UserType,
} from "~/lib/types";
import { Separator } from "~/components/ui/separator";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { type z } from "zod";
import {
  emailSignInAction,
  emailSignUpAction,
  googleSignIn,
} from "~/server/actions/auth";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export type AuthProps = {
  screenType: "sign-in" | "sign-up";
  type: UserType;
};

export function AuthScreen({ screenType, type }: AuthProps) {
  const [loading, setLoading] = useState(false);
  const form = useForm<Credentials>({
    resolver: zodResolver(credentialsSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof credentialsSchema>) {
    setLoading(true);

    if (form.formState.errors.root?.message !== undefined) {
      form.setError("root", {
        message: undefined,
      });
    }

    let error: Awaited<ReturnType<typeof emailSignInAction> | undefined>;
    if (screenType === "sign-in") {
      error = await emailSignInAction({ ...values, type });
    } else {
      error = await emailSignUpAction({ ...values, type });
    }

    if (error) {
      form.setError("root", { message: error.message });
    }

    setLoading(false);
  }

  return (
    <div className="mx-auto grid h-screen w-full max-w-screen-2xl xl:grid-cols-2 ">
      <div className="my-auto hidden h-full max-h-[800px] w-full max-w-[750px] pl-4 xl:block">
        <img
          src="/images/concert.jpg"
          alt="Image"
          className="h-full w-full rounded-xl object-cover"
        />
      </div>

      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-white">Join Our Network</h1>
            {screenType === "sign-up" && (
              <span className="text-sm text-muted-foreground">
                Create your account to join us!
              </span>
            )}
          </div>

          {screenType === "sign-in" && (
            <>
              <form action={async () => await googleSignIn(type)}>
                <Button
                  variant="outline"
                  className="w-full bg-white text-black"
                  type="submit"
                >
                  Login with Google
                </Button>
              </form>
              <div className="flex w-[9em] items-center justify-between">
                <Separator className="bg-gray-500" />
                <p className="px-6">or</p>
                <Separator className="bg-gray-500" />
              </div>
            </>
          )}

          <Form {...form}>
            <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)}>
              {form.formState.errors.root?.message !== undefined && (
                <span className="text-center text-sm text-red-600">
                  {form.formState.errors.root.message}
                </span>
              )}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white text-black"
                        id="email"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-white text-black"
                        id="password"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={loading}
                type="submit"
                className="mt-2 flex w-full items-center gap-x-2"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {screenType === "sign-in" ? "Login" : "Create Account"}
              </Button>
            </form>
          </Form>

          <div className="mt-4 text-center text-sm">
            {screenType === "sign-in" ? (
              <>
                Don&apos;t have an account?{" "}
                <Link href={`/${type}/auth/signup`} className="underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href={`/${type}/auth`} className="underline">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
