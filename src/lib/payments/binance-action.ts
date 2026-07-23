import crypto from "crypto";

const BINANCE_API = process.env.NODE_ENV === "production"
  ? "https://api.binance.com"
  : "https://bpay.binanceapi.com";

function generateNonce(length = 32) {
  return crypto.randomBytes(length / 2).toString("hex");
}

function buildSignature(
  timestamp: string,
  nonce: string,
  body: string,
  secret: string
): string {
  const payload = `${timestamp}\n${nonce}\n${body}\n`;
  return crypto
    .createHmac("sha512", secret)
    .update(payload)
    .digest("hex")
    .toUpperCase();
}

export async function createBinanceOrder({
  userId,
  planId,
  locale = "en",
}: {
  userId: string;
  planId: "pro" | "business";
  locale?: string;
}): Promise<{ orderId: string; paymentUrl: string; qrContent: string }> {
  const apiKey = process.env.BINANCE_API_KEY;
  const apiSecret = process.env.BINANCE_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error("Binance API Key or API Secret is not configured.");
  }

  const tradeNo = `WPDF-${planId.toUpperCase()}-${userId.substring(0, 8)}-${Date.now()}`;
  
  const orderAmount = planId === "pro" ? 9.00 : 29.00;
  const goodsName = planId === "pro" 
    ? "WorldPDF Pro Plan - 1 Month"
    : "WorldPDF Business Plan - 1 Month";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.myworldpdf.com";
  const returnUrl = `${siteUrl}/${locale}/account/billing?status=success&provider=binance&tradeNo=${tradeNo}`;
  const cancelUrl = `${siteUrl}/${locale}/account/billing?status=cancel`;

  const body = {
    env: {
      terminalType: "WEB",
    },
    merchantTradeNo: tradeNo,
    orderAmount: orderAmount.toFixed(2),
    currency: "USD",
    goods: {
      goodsType: "01",
      goodsCategory: "6000",
      referenceGoodsId: planId,
      goodsName,
      goodsDetail: `1 month of ${planId} plan features`,
    },
    returnUrl,
    cancelUrl,
  };

  const jsonBody = JSON.stringify(body);
  const timestamp = Date.now().toString();
  const nonce = generateNonce(32);
  const signature = buildSignature(timestamp, nonce, jsonBody, apiSecret);

  const response = await fetch(`${BINANCE_API}/binancepay/openapi/v3/order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "BinancePay-Timestamp": timestamp,
      "BinancePay-Nonce": nonce,
      "BinancePay-Certificate-SN": apiKey,
      "BinancePay-Signature": signature,
    },
    body: jsonBody,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create Binance Pay order: ${errorText}`);
  }

  const resData = await response.json();
  if (resData.status !== "SUCCESS") {
    throw new Error(`Binance Pay order creation failed: ${resData.errorMessage || "Unknown Error"}`);
  }

  const { prepayId, checkoutUrl, qrContent } = resData.data;

  return {
    orderId: prepayId,
    paymentUrl: checkoutUrl,
    qrContent,
  };
}
