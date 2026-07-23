"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { createPayPalSubscription } from "@/lib/payments/paypal-action";
import { createBinanceOrder } from "@/lib/payments/binance-action";
import { logAudit } from "@/lib/audit";

export async function startPayPalSubscriptionAction(
  planId: "pro" | "business",
  locale: string
) {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return { error: "You must be logged in to subscribe." };
  }

  const userId = (session.user as any).id;
  const email = session.user.email;

  try {
    const { approvalUrl } = await createPayPalSubscription({
      userId,
      email,
      planId,
      locale,
    });

    return { approvalUrl };
  } catch (error: any) {
    console.error("PayPal Subscription Action Error:", error);
    return { error: error.message || "Failed to start PayPal subscription." };
  }
}

export async function startBinancePaymentAction(
  planId: "pro" | "business",
  locale: string
) {
  const session = await auth();
  if (!session || !session.user) {
    return { error: "You must be logged in to subscribe." };
  }

  const userId = (session.user as any).id;

  try {
    const { orderId, paymentUrl } = await createBinanceOrder({
      userId,
      planId,
      locale,
    });

    const amountCents = planId === "pro" ? 900 : 2900;

    // Save a pending payment in the database so the webhook can retrieve it
    await db.payment.create({
      data: {
        userId,
        provider: "binance",
        providerRefId: orderId,
        amount: amountCents,
        currency: "USD",
        status: "pending",
      },
    });

    return { paymentUrl };
  } catch (error: any) {
    console.error("Binance Pay Action Error:", error);
    return { error: error.message || "Failed to initiate Binance Pay payment." };
  }
}

export async function cancelSubscriptionAction() {
  const session = await auth();
  if (!session || !session.user) {
    return { error: "You must be logged in to cancel your subscription." };
  }

  const userId = (session.user as any).id;

  try {
    const sub = await db.subscription.findUnique({
      where: { userId },
    });

    if (!sub || sub.status !== "ACTIVE") {
      return { error: "No active subscription found." };
    }

    // Set cancellation flag
    await db.subscription.update({
      where: { userId },
      data: { cancelAtPeriodEnd: true },
    });

    await logAudit({
      userId,
      action: "billing.subscription.cancel_requested",
      details: `Subscription set to cancel at end of period. Provider: ${sub.paymentProvider}, SubID: ${sub.providerSubId}`,
    });

    return { success: "Your subscription has been canceled and will not auto-renew." };
  } catch (error: any) {
    console.error("Subscription cancellation error:", error);
    return { error: error.message || "Failed to cancel subscription." };
  }
}
