import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { db } from "~/server/db";
import { accounts, sessions, users } from "~/server/db/schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: string;
    password: string;
    address: string;
    profilePicImage: string;
    profileBannerImage: string;
    type: string;
  }
}

const adapter = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions,
});

export const authOptions: NextAuthConfig = {
  adapter,
  providers: [
    GoogleProvider({
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          emailVerified: profile.email_verified,
          profilePicImage: profile.picture,
        };
      },
      allowDangerousEmailAccountLinking: true,
    }),
  ],
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
