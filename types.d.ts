import { type AuthConfig } from "@auth/core";
import { type Session } from "next-auth";
import { type NextRequest, type NextResponse } from "next/server";

declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string;
    name: string;
    email: string;
    email_verified: string;
    picture: string;
  }

  interface NextAuthConfig extends Omit<AuthConfig, "raw"> {
    /**
     * Callbacks are asynchronous functions you can use to control what happens when an auth-related action is performed.
     * Callbacks **allow you to implement access controls without a database** or to **integrate with external databases or APIs**.
     */
    callbacks?: AuthConfig["callbacks"] & {
      /**
       * Invoked when a user needs authorization, using [Middleware](https://nextjs.org/docs/advanced-features/middleware).
       *
       * You can override this behavior by returning a {@link NextResponse}.
       *
       * @example
       * ```ts title="app/auth.ts"
       * async authorized({ request, auth }) {
       *   const url = request.nextUrl
       *
       *   if(request.method === "POST") {
       *     const { authToken } = (await request.json()) ?? {}
       *     // If the request has a valid auth token, it is authorized
       *     const valid = await validateAuthToken(authToken)
       *     if(valid) return true
       *     return NextResponse.json("Invalid auth token", { status: 401 })
       *   }
       *
       *   // Logged in users are authenticated, otherwise redirect to login page
       *   return !!auth.user
       * }
       * ```
       *
       * :::warning
       * If you are returning a redirect response, make sure that the page you are redirecting to is not protected by this callback,
       * otherwise you could end up in an infinite redirect loop.
       * :::
       */
      authorized?: (params: {
        /** The request to be authorized. */
        request: NextRequest;
        /** The authenticated user or token, if any. */
        auth: Session | null;
      }) => Awaitable<boolean | NextResponse | Response | undefined>;
    };
  }

  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
  // interface Account {}

  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  // interface Session {}
}

// The `JWT` interface can be found in the `next-auth/jwt` submodule

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string;
  }
}
