import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as
   * a prop on the `SessionProvider` React Context
   */
  interface Session {
    refreshToken?: string;
    accessToken?: string;
    accessTokenExpiry?: string;
    error?: string;
    user?: User;
  }

  interface User {
    name?: string;
    email?: string | null;
    id?: number;
  }
}
