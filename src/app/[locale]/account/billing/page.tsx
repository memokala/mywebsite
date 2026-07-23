import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Container } from "@/components/ui/container";
import { BillingDashboard } from "@/components/billing/billing-dashboard";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "إدارة الاشتراك والفوترة - WorldPDF" : "Subscription & Billing - WorldPDF",
    description: isAr 
      ? "إدارة خطة اشتراكك الحالي وتفاصيل الدفع والتحقق من الفواتير السابقة." 
      : "Manage your active subscription plan, check billing invoices, and review account payments.",
  };
}

export default async function AccountBillingPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();

  // Dual redundancy check for security, in case middleware is bypassed
  if (!session || !session.user) {
    redirect(`/${locale}/login?callbackUrl=/${locale}/account/billing`);
  }

  const userId = (session.user as any).id;
  const userEmail = session.user.email || "";

  // Fetch subscription
  const subscription = await db.subscription.findUnique({
    where: { userId },
    include: { plan: true },
  });

  // Fetch billing payment history
  const payments = await db.payment.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const isAr = locale === "ar";

  return (
    <Container className="py-12 md:py-16">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
            {isAr ? "الاشتراك والفوترة" : "Billing & Subscriptions"}
          </h1>
          <p className="mt-1.5 text-sm text-surface-500 max-w-2xl">
            {isAr 
              ? "تحقق من ميزات خطتك المفعلة، وقم بإجراء عمليات الترقية أو إلغاء الاشتراك وإدارة الفواتير." 
              : "Review your active plan features, handle upgrades, cancel renewals, and manage payment receipts."}
          </p>
        </div>

        <BillingDashboard 
          userEmail={userEmail}
          subscription={subscription}
          payments={payments}
          locale={locale}
        />
      </div>
    </Container>
  );
}
