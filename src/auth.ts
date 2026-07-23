import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET || "temporary-worldpdf-secret-change-in-production",
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  trustHost: true,
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
      }

      // Fetch latest subscription details for session refresh
      if (token.id) {
        try {
          const sub = await db.subscription.findUnique({
            where: { userId: token.id as string },
            include: { plan: true },
          });
          if (sub && sub.status === "ACTIVE") {
            token.plan = sub.planId;
            token.planName = sub.plan.name;
            token.maxFileSizeMB = sub.plan.maxFileSizeMB;
            token.dailyFileLimit = sub.plan.dailyFileLimit;
          } else {
            // Default to Free
            token.plan = "free";
            token.planName = "Free";
            token.maxFileSizeMB = 10;
            token.dailyFileLimit = 10;
          }
        } catch (error) {
          console.error("JWT Session Subscription fetch error:", error);
          token.plan = "free";
          token.planName = "Free";
          token.maxFileSizeMB = 10;
          token.dailyFileLimit = 10;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).plan = token.plan;
        (session.user as any).planName = token.planName;
        (session.user as any).maxFileSizeMB = token.maxFileSizeMB;
        (session.user as any).dailyFileLimit = token.dailyFileLimit;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(8) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          throw new Error("INVALID_CREDENTIALS");
        }

        const { email, password } = parsedCredentials.data;
        
        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.passwordHash) {
          throw new Error("INVALID_CREDENTIALS");
        }

        // Email verification check
        if (!user.emailVerified) {
          throw new Error("EMAIL_NOT_VERIFIED");
        }

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordsMatch) {
          throw new Error("INVALID_CREDENTIALS");
        }

        return user;
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID !== "your-google-client-id" ? [
      Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        allowDangerousEmailAccountLinking: true,
      })
    ] : [])
  ],
  events: {
    async createUser({ user }) {
      // Automatically assign Free plan subscription to any new OAuth/Credentials user
      try {
        const freePlan = await db.plan.findUnique({ where: { id: "free" } });
        if (freePlan) {
          await db.subscription.upsert({
            where: { userId: user.id! },
            update: {
              planId: "free",
              status: "ACTIVE",
              currentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000),
            },
            create: {
              userId: user.id!,
              planId: "free",
              status: "ACTIVE",
              paymentProvider: "system",
              currentPeriodEnd: new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000),
            },
          });
        }
      } catch (err) {
        console.error("Error creating default subscription for new user:", err);
      }
    },
  },
});
