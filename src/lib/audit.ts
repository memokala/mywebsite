import { db } from "@/lib/db";

export async function logAudit({
  userId,
  action,
  details,
  ip,
}: {
  userId?: string;
  action: string;
  details?: string;
  ip?: string;
}) {
  try {
    await db.auditLog.create({
      data: {
        userId,
        action,
        details,
        ip,
      },
    });
  } catch (error) {
    console.error("Audit log saving error:", error);
  }
}
