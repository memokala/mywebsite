import { db } from "@/lib/db";

const PAYPAL_API = process.env.NODE_ENV === "production"
  ? "https://api-m.paypal.com"
  : "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal Client ID or Client Secret is not configured.");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to retrieve PayPal access token: ${errorText}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function createPayPalSubscription({
  userId,
  email,
  planId,
  locale = "en",
}: {
  userId: string;
  email: string;
  planId: "pro" | "business";
  locale?: string;
}): Promise<{ id: string; approvalUrl: string }> {
  const accessToken = await getPayPalAccessToken();

  // Match local plan mapping with PayPal plan IDs from env
  const paypalPlanId = planId === "pro"
    ? process.env.PAYPAL_PLAN_ID_PRO
    : process.env.PAYPAL_PLAN_ID_BUSINESS;

  if (!paypalPlanId) {
    throw new Error(`PayPal Plan ID for "${planId}" is not configured in environment variables.`);
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myworldpdf.com";
  const returnUrl = `${siteUrl}/${locale}/account/billing?status=success&provider=paypal`;
  const cancelUrl = `${siteUrl}/${locale}/account/billing?status=cancel`;

  const response = await fetch(`${PAYPAL_API}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Prefer": "return=representation",
    },
    body: JSON.stringify({
      plan_id: paypalPlanId,
      custom_id: userId,
      subscriber: {
        email_address: email,
      },
      application_context: {
        brand_name: "WorldPDF",
        locale: locale === "ar" ? "ar-AE" : "en-US",
        shipping_preference: "NO_SHIPPING",
        user_action: "SUBSCRIBE_NOW",
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create PayPal billing subscription: ${errorText}`);
  }

  const data = await response.json();
  const approveLink = data.links.find((l: any) => l.rel === "approve");

  if (!approveLink) {
    throw new Error("No approval link returned from PayPal.");
  }

  return {
    id: data.id,
    approvalUrl: approveLink.href,
  };
}
