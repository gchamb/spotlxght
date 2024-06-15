"use server";

import { redirect } from "next/navigation";
import { emailSignIn, emailSignInCredentials, signUp } from "~/server/auth/lib";
import { type Credentials } from "~/types/zod";

export async function emailSignInAction(formData: FormData) {
  await emailSignIn(formData);
}

export async function emailSignInCredentialsAction(credentials: Credentials) {
  await emailSignInCredentials(credentials);
}

export async function emailSignUpAction(formData: FormData) {
  await signUp(formData);
  redirect("/");
}
