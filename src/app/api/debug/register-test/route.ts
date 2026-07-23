import { NextResponse } from "next/server";

export async function GET() {
  const results: Record<string, any> = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? "SET (" + process.env.DATABASE_URL.substring(0, 30) + "...)" : "MISSING",
      AUTH_SECRET: process.env.AUTH_SECRET ? "SET" : "MISSING",
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? `Len: ${process.env.GOOGLE_CLIENT_ID.length}, Ends: ${process.env.GOOGLE_CLIENT_ID.substring(process.env.GOOGLE_CLIENT_ID.length - 30)}` : "MISSING",
      GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "MISSING",
      FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID ? "SET" : "MISSING",
      NODE_ENV: process.env.NODE_ENV,
    },
  };

  // Test 1: Prisma Client import
  try {
    const { db } = await import("@/lib/db");
    results.prismaImport = "OK";

    // Test 2: Database connection
    try {
      const userCount = await db.user.count();
      results.dbConnection = `OK (${userCount} users)`;
    } catch (e: any) {
      results.dbConnection = `FAILED: ${e.message}`;
    }

    // Test 3: Plans table
    try {
      const plans = await db.plan.findMany();
      results.plansTable = `OK (${plans.length} plans: ${plans.map((p: any) => p.id).join(", ")})`;
    } catch (e: any) {
      results.plansTable = `FAILED: ${e.message}`;
    }

    // Test 3.5: Users and Accounts list
    try {
      const users = await db.user.findMany({
        include: { accounts: true },
      });
      results.usersList = users.map((u: any) => ({
        id: u.id,
        email: u.email ? `${u.email.substring(0, 3)}...` : null,
        emailVerified: u.emailVerified ? "YES" : "NO",
        accounts: u.accounts.map((a: any) => a.provider),
      }));
    } catch (e: any) {
      results.usersList = `FAILED: ${e.message}`;
    }
  } catch (e: any) {
    results.prismaImport = `FAILED: ${e.message}`;
  }

  // Test 4: bcryptjs
  try {
    const bcrypt = await import("bcryptjs");
    const hash = await bcrypt.default.hash("test", 12);
    results.bcrypt = `OK (hash: ${hash.substring(0, 20)}...)`;
  } catch (e: any) {
    results.bcrypt = `FAILED: ${e.message}`;
  }

  // Test 5: Auth module (NextAuth initialization)
  try {
    const authModule = await import("@/auth");
    results.authModule = `OK (exports: ${Object.keys(authModule).join(", ")})`;
  } catch (e: any) {
    results.authModule = `FAILED: ${e.message}`;
  }

  // Test 6: Rate limit module
  try {
    const { rateLimit } = await import("@/lib/rate-limit");
    const rlResult = await rateLimit("debug-test", 100, 60);
    results.rateLimit = `OK (success: ${rlResult.success})`;
  } catch (e: any) {
    results.rateLimit = `FAILED: ${e.message}`;
  }

  // Test 7: Server action module import
  try {
    const actionsModule = await import("@/lib/actions/auth");
    results.actionsModule = `OK (exports: ${Object.keys(actionsModule).join(", ")})`;
  } catch (e: any) {
    results.actionsModule = `FAILED: ${e.message}`;
  }

  return NextResponse.json(results, { status: 200 });
}
