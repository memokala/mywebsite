import { PrismaClient } from "@prisma/client";

// Fallback to the production Neon database URL if Vercel env var is missing
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "postgresql://neondb_owner:npg_vhVz7WoPd6LF@ep-cold-violet-atys4bul.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

