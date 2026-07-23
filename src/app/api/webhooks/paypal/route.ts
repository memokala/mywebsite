import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logAudit } from "@/lib/audit";

const PAYPAL_API = process.env.NODE_ENV === "production"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function verifyWebhookSignature(req: NextRequest, bodyText: string) {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) {
    console.warn("PAYPAL_WEBHOOK_ID is not set. Webhook signature checking bypassed in development.");
    if (process.env.NODE_ENV === "production") return false;
    return true;
  }

  const authAlgo = req.headers.get("paypal-auth-algo") || "";
  const certUrl = req.headers.get("paypal-cert-url") || "";
  const transmissionId = req.headers.get("paypal-transmission-id") || "";
  const transmissionSig = req.headers.get("paypal-transmission-sig") || "";
  const transmissionTime = req.headers.get("paypal-transmission-time") || "";

  try {
    const authHeader = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!tokenRes.ok) return false;
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    const verifyRes = await fetch(
      `${PAYPAL_API}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_algo: authAlgo,
          cert_url: certUrl,
          transmission_id: transmissionId,
          transmission_sig: transmissionSig,
          transmission_time: transmissionTime,
          webhook_id: webhookId,
          webhook_event: JSON.parse(bodyText),
        }),
      }
    );

    if (!verifyRes.ok) return false;
    const verifyData = await verifyRes.json();
    return verifyData.verification_status === "SUCCESS";
  } catch (error) {
    console.error("PayPal webhook signature verification error:", error);
    return false;
  }
}

export async function POST(req: NextRequest) {
  const bodyText = await req.text();
  
  const isSignatureValid = await verifyWebhookSignature(req, bodyText);
  if (!isSignatureValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(bodyText);
  const eventType = event.event_type;
  const resource = event.resource;

  try {
    if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
      const subscriptionId = resource.id;
      const userId = resource.custom_id;
      const paypalPlanId = resource.plan_id;

      let planId = "pro";
      if (paypalPlanId === process.env.PAYPAL_PLAN_ID_BUSINESS) {
        planId = "business";
      }

      const nextBillingTime = resource.billing_info?.next_billing_time;
      const currentPeriodEnd = nextBillingTime 
        ? new Date(nextBillingTime) 
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      await db.subscription.upsert({
        where: { userId },
        update: {
          planId,
          status: "ACTIVE",
          providerSubId: subscriptionId,
          currentPeriodEnd,
          cancelAtPeriodEnd: false,
        },
        create: {
          userId,
          planId,
          status: "ACTIVE",
          paymentProvider: "paypal",
          providerSubId: subscriptionId,
          currentPeriodEnd,
          cancelAtPeriodEnd: false,
        },
      });

      await logAudit({
        userId,
        action: "billing.subscription.activated",
        details: `PayPal subscription activated: ${subscriptionId} for plan ${planId}`,
      });
    }

    else if (
      eventType === "BILLING.SUBSCRIPTION.CANCELLED" ||
      eventType === "BILLING.SUBSCRIPTION.EXPIRED"
    ) {
      const subscriptionId = resource.id;
      const userId = resource.custom_id;

      await db.subscription.updateMany({
        where: { providerSubId: subscriptionId },
        data: {
          status: eventType === "BILLING.SUBSCRIPTION.CANCELLED" ? "CANCELED" : "EXPIRED",
        },
      });

      await logAudit({
        userId,
        action: "billing.subscription.cancelled",
        details: `PayPal subscription updated: ${eventType} (${subscriptionId})`,
      });
    }

    else if (eventType === "PAYMENT.SALE.COMPLETED") {
      const transactionId = resource.id;
      const subscriptionId = resource.billing_agreement_id;
      const amountCents = Math.round(parseFloat(resource.amount.total) * 100);
      const currency = resource.amount.currency;

      const sub = await db.subscription.findFirst({
        where: { providerSubId: subscriptionId },
      });

      if (sub) {
        await db.payment.upsert({
          where: { providerRefId: transactionId },
          update: {
            status: "completed",
            rawPayload: event,
          },
          create: {
            userId: sub.userId,
            provider: "paypal",
            providerRefId: transactionId,
            amount: amountCents,
            currency,
            status: "completed",
            rawPayload: event,
          },
        });

        // Extend subscription by 30 days
        const newPeriodEnd = new Date();
        newPeriodEnd.setDate(newPeriodEnd.getDate() + 30);

        await db.subscription.update({
          where: { userId: sub.userId },
          data: {
            currentPeriodEnd: newPeriodEnd,
            status: "ACTIVE",
          },
        });

        await logAudit({
          userId: sub.userId,
          action: "billing.payment.completed",
          details: `PayPal payment completed: ${transactionId} for sub ${subscriptionId}`,
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("PayPal webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
