import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.AUTH_SECRET || "temporary-worldpdf-secret-change-in-production",
  trustHost: true,
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      // We will perform role and route checking in our custom middleware.ts 
      // to keep it highly integrated with next-intl.
      return true;
    },
  },
  providers: [], // Configured in auth.ts
} satisfies NextAuthConfig;
