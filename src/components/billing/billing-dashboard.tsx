"use client";

import { useState, useTransition } from "react";
import { Check, X, Shield, Sparkles, CreditCard, RefreshCw, AlertCircle, CheckCircle2, History, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  startPayPalSubscriptionAction,
  startBinancePaymentAction,
  cancelSubscriptionAction,
} from "@/lib/actions/billing";

type BillingDashboardProps = {
  userEmail: string;
  subscription: any; // Database Subscription + Plan
  payments: any[]; // Database Payment[]
  locale: string;
};

export function BillingDashboard({
  userEmail,
  subscription,
  payments,
  locale,
}: BillingDashboardProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"paypal" | "binance">("paypal");

  const isAr = locale === "ar";

  // Current subscription status
  const hasSub = subscription && subscription.status === "ACTIVE" && subscription.planId !== "free";
  const planId = hasSub ? subscription.planId : "free";
  const planName = hasSub ? subscription.plan.name : (isAr ? "مجاني" : "Free");
  const currentPeriodEnd = hasSub ? new Date(subscription.currentPeriodEnd) : null;
  const isCanceled = hasSub ? subscription.cancelAtPeriodEnd : false;

  const handleSubscribe = async (plan: "pro" | "business") => {
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      if (activeTab === "paypal") {
        const res = await startPayPalSubscriptionAction(plan, locale);
        if (res.error) {
          setError(res.error);
        } else if (res.approvalUrl) {
          window.location.href = res.approvalUrl; // Redirect to PayPal
        }
      } else {
        const res = await startBinancePaymentAction(plan, locale);
        if (res.error) {
          setError(res.error);
        } else if (res.paymentUrl) {
          window.location.href = res.paymentUrl; // Redirect to Binance Pay
        }
      }
    });
  };

  const handleCancel = async () => {
    if (!confirm(isAr ? "هل أنت متأكد من إلغاء اشتراكك؟" : "Are you sure you want to cancel your subscription?")) {
      return;
    }

    setError(null);
    setSuccess(null);

    startTransition(async () => {
      const res = await cancelSubscriptionAction();
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(res.success || (isAr ? "تم إلغاء الاشتراك بنجاح." : "Subscription canceled successfully."));
        window.location.reload();
      }
    });
  };

  const pricingPlans = [
    {
      id: "pro",
      name: isAr ? "برو (Pro)" : "Pro Plan",
      price: "$9",
      period: isAr ? "/شهرياً" : "/month",
      description: isAr ? "للمحترفين والمستخدمين النشطين" : "For professionals and power users",
      features: [
        isAr ? "معالجة ملفات غير محدودة" : "Unlimited files processing",
        isAr ? "الوصول لجميع الأدوات" : "Access to all tools",
        isAr ? "حجم ملف يصل إلى 100 ميجابايت" : "File size up to 100MB",
        isAr ? "أولوية دعم العملاء" : "Priority customer support",
      ],
      popular: true,
    },
    {
      id: "business",
      name: isAr ? "الأعمال (Business)" : "Business Plan",
      price: "$29",
      period: isAr ? "/شهرياً" : "/month",
      description: isAr ? "للمؤسسات والفرق" : "For companies and teams",
      features: [
        isAr ? "كل ميزات Pro" : "All features in Pro plan",
        isAr ? "حجم ملفات غير محدود بالكامل" : "Completely unlimited file size",
        isAr ? "ميزات إدارة الفريق" : "Team management console",
        isAr ? "دعم مخصص ووصول للـ API" : "Dedicated API access & support",
      ],
      popular: false,
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-8">
      {/* Banner Messages */}
      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex items-start gap-3 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 flex items-start gap-3 text-green-600 dark:text-green-400 text-sm">
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {/* 1. Subscription Status */}
      <Card className="border-surface-200 dark:border-surface-800 shadow-md bg-gradient-to-r from-white to-surface-50/50 dark:from-surface-900 dark:to-surface-950/50">
        <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-surface-100 dark:border-surface-800/80">
          <div>
            <h2 className="text-xl font-bold text-surface-900 dark:text-surface-50">
              {isAr ? "الاشتراك الحالي" : "Active Subscription"}
            </h2>
            <p className="text-xs text-surface-500 mt-0.5">
              {isAr ? `مسجل بالبريد: ${userEmail}` : `Logged in as: ${userEmail}`}
            </p>
          </div>
          <Badge variant="brand" className="px-4 py-1 text-sm font-semibold">
            {planName}
          </Badge>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                {isAr ? "حالة الاشتراك" : "Subscription Status"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`h-2.5 w-2.5 rounded-full ${hasSub ? "bg-green-500 animate-pulse" : "bg-surface-300 dark:bg-surface-600"}`} />
                <span className="text-sm font-semibold text-surface-800 dark:text-surface-200">
                  {hasSub 
                    ? (isCanceled ? (isAr ? "ملغي (نشط حتى نهاية الفترة)" : "Canceled (Active until period end)") : (isAr ? "نشط" : "Active"))
                    : (isAr ? "حساب مجاني" : "Free Tier")}
                </span>
              </div>
            </div>

            {hasSub && currentPeriodEnd && (
              <div>
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  {isCanceled ? (isAr ? "تاريخ انتهاء الصلاحية" : "Expiration Date") : (isAr ? "تاريخ التجديد القادم" : "Next Billing Date")}
                </p>
                <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 mt-1">
                  {currentPeriodEnd.toLocaleDateString(locale, { dateStyle: "long" })}
                </p>
              </div>
            )}

            {hasSub && (
              <div>
                <p className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  {isAr ? "بوابة الدفع المستخدمة" : "Payment Method"}
                </p>
                <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 mt-1 capitalize">
                  {subscription.paymentProvider === "paypal" ? "PayPal (Subscription)" : "Binance Pay (Crypto)"}
                </p>
              </div>
            )}
          </div>
        </CardContent>
        {hasSub && !isCanceled && (
          <CardFooter className="bg-surface-50/50 dark:bg-surface-900/30 border-t border-surface-100 dark:border-surface-800/80 justify-end py-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isPending}
              className="text-red-500 hover:text-red-600 border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              {isPending ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-1.5" />
              ) : null}
              {isAr ? "إلغاء الاشتراك" : "Cancel Subscription"}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* 2. Buy Subscriptions if Free */}
      {!hasSub && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
              {isAr ? "ترقية خطتك" : "Upgrade Your Plan"}
            </h2>
            <p className="text-sm text-surface-500 mt-1">
              {isAr 
                ? "اختر الخطة المناسبة لك واشترك عبر PayPal أو Binance Pay" 
                : "Choose a premium plan and pay securely with PayPal or Binance Pay"}
            </p>

            {/* Gateway Toggle tabs */}
            <div className="inline-flex rounded-lg p-1 bg-surface-100 dark:bg-surface-800 mt-6 shadow-inner">
              <button
                onClick={() => setActiveTab("paypal")}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === "paypal" ? "bg-white dark:bg-surface-900 text-brand-500 shadow-sm" : "text-surface-500"}`}
              >
                PayPal ({isAr ? "دفع فيات" : "Fiat Subscription"})
              </button>
              <button
                onClick={() => setActiveTab("binance")}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === "binance" ? "bg-white dark:bg-surface-900 text-brand-500 shadow-sm" : "text-surface-500"}`}
              >
                Binance Pay ({isAr ? "دفع عملات رقمية" : "Crypto Order"})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`flex flex-col relative transition-all ${plan.popular ? "border-brand-500 dark:border-brand-500 shadow-lg scale-105" : "border-surface-200 dark:border-surface-800"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="brand" className="px-3 py-0.5 text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {isAr ? "الأكثر شعبية" : "Most Popular"}
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <h3 className="text-lg font-bold text-surface-900 dark:text-surface-50">{plan.name}</h3>
                  <div className="mt-2 flex items-center justify-center gap-0.5">
                    <span className="text-3xl font-black text-surface-900 dark:text-surface-50">{plan.price}</span>
                    <span className="text-xs text-surface-400">{plan.period}</span>
                  </div>
                  <p className="text-xs text-surface-500 mt-1">{plan.description}</p>
                </CardHeader>
                <CardContent className="flex-1 pt-4 pb-6">
                  <ul className="space-y-2.5">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs">
                        <Check className="h-4 w-4 text-green-500 shrink-0" />
                        <span className="text-surface-700 dark:text-surface-300 font-medium">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button
                    onClick={() => handleSubscribe(plan.id as "pro" | "business")}
                    disabled={isPending}
                    className="w-full gap-2 font-bold shadow-md"
                    variant={plan.popular ? "primary" : "outline"}
                    size="lg"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        {isAr ? `اشترك عبر ${activeTab === "paypal" ? "PayPal" : "Binance Pay"}` : `Subscribe with ${activeTab === "paypal" ? "PayPal" : "Binance Pay"}`}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* 3. Payment Invoice History */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-surface-150 dark:border-surface-800 pb-2">
          <History className="h-5 w-5 text-brand-500" />
          <h2 className="text-lg font-bold text-surface-900 dark:text-surface-50">
            {isAr ? "سجل المدفوعات" : "Billing History"}
          </h2>
        </div>

        {payments.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-surface-50 dark:bg-surface-900/30 text-surface-500 text-sm">
            {isAr ? "لا توجد أي مدفوعات سابقة مسجلة." : "No payment history found."}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-surface-200 dark:border-surface-800 shadow-sm">
            <table className="w-full text-left rtl:text-right border-collapse text-sm bg-white dark:bg-surface-900">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800/80 border-b border-surface-150 dark:border-surface-800 text-surface-500 font-semibold">
                  <th className="px-4 py-3">{isAr ? "المرجع" : "Transaction ID"}</th>
                  <th className="px-4 py-3">{isAr ? "البوابة" : "Provider"}</th>
                  <th className="px-4 py-3">{isAr ? "المبلغ" : "Amount"}</th>
                  <th className="px-4 py-3">{isAr ? "الحالة" : "Status"}</th>
                  <th className="px-4 py-3">{isAr ? "التاريخ" : "Date"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800/80">
                {payments.map((p) => (
                  <tr key={p.id} className="text-surface-700 dark:text-surface-300 hover:bg-surface-50/50 dark:hover:bg-surface-800/40">
                    <td className="px-4 py-3 font-mono text-xs">{p.providerRefId}</td>
                    <td className="px-4 py-3 capitalize">{p.provider}</td>
                    <td className="px-4 py-3 font-semibold">${(p.amount / 100).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${p.status === "completed" ? "bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400" : "bg-yellow-50 text-yellow-600 dark:bg-yellow-950/20"}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-surface-500 text-xs">
                      {new Date(p.createdAt).toLocaleDateString(locale, { dateStyle: "medium" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
