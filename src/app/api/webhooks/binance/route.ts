import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit";

function verifyBinanceSignature(
  req: NextRequest,
  bodyText: string
): boolean {
  const apiSecret = process.env.BINANCE_API_SECRET;
  if (!apiSecret) {
    console.warn("BINANCE_API_SECRET is not set. Webhook signature checking bypassed in development.");
    if (process.env.NODE_ENV === "production") return false;
    return true;
  }

  const signature = req.headers.get("BinancePay-Signature") || "";
  const timestamp = req.headers.get("BinancePay-Timestamp") || "";
  const nonce = req.headers.get("BinancePay-Nonce") || "";

  const payload = `${timestamp}\n${nonce}\n${bodyText}\n`;
  const expectedSignature = crypto
    .createHmac("sha512", apiSecret)
    .update(payload)
    .digest("hex")
    .toUpperCase();

  return signature.toUpperCase() === expectedSignature;
}

export async function POST(req: NextRequest) {
  const bodyText = await req.text();

  const isSignatureValid = verifyBinanceSignature(req, bodyText);
  if (!isSignatureValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const payload = JSON.parse(bodyText);
    const { bizStatus, data } = payload as {
      bizStatus: string;
      data: {
        merchantTradeNo: string;
        prepayId: string;
        amount: string;
        currency: string;
      };
    };

    if (bizStatus !== "PAY_SUCCESS") {
      console.log(`Received non-success Binance webhook status: ${bizStatus}`);
      return NextResponse.json({ received: true });
    }

    const prepayId = data.prepayId;

    // Find the pending payment record
    const payment = await db.payment.findUnique({
      where: { providerRefId: prepayId },
    });

    if (!payment) {
      console.warn(`Payment not found for prepayId: ${prepayId}`);
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Idempotency: skip if already processed
    if (payment.status === "completed") {
      return NextResponse.json({ received: true });
    }

    // Determine the plan based on the amount or custom metadata (e.g. from trade number or product name)
    // In our order creation, plan is stored or we can map: $9 = pro, $29 = business
    const amountFloat = parseFloat(data.amount);
    let planId = "pro";
    if (amountFloat > 15.00) {
      planId = "business";
    }

    // Use a transaction to update both Payment and Subscription
    await db.$transaction(async (tx) => {
      // 1. Update payment status to completed
      await tx.payment.update({
        where: { providerRefId: prepayId },
        data: {
          status: "completed",
          rawPayload: payload,
        },
      });

      // 2. Upgrade / Extend User's subscription by 30 days
      const currentPeriodEnd = new Date();
      currentPeriodEnd.setDate(currentPeriodEnd.getDate() + 30);

      await tx.subscription.upsert({
        where: { userId: payment.userId },
        update: {
          planId,
          status: "ACTIVE",
          paymentProvider: "binance",
          providerSubId: prepayId,
          currentPeriodEnd,
          cancelAtPeriodEnd: true, // One-off subscription that doesn't auto-renew
        },
        create: {
          userId: payment.userId,
          planId,
          status: "ACTIVE",
          paymentProvider: "binance",
          providerSubId: prepayId,
          currentPeriodEnd,
          cancelAtPeriodEnd: true,
        },
      });
    });

    await logAudit({
      userId: payment.userId,
      action: "billing.payment.binance.completed",
      details: `Binance payment completed: ${prepayId} for plan ${planId}`,
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Binance webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
