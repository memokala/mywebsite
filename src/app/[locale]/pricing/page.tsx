import Link from "next/link";
import { Check, X, ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: Promise<{ locale: string }>;
};

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for occasional use",
    features: [
      { text: "Up to 10 files per day", included: true },
      { text: "Basic tools access", included: true },
      { text: "File size up to 10MB", included: true },
      { text: "Client-side processing", included: true },
      { text: "Batch processing", included: false },
      { text: "Priority support", included: false },
      { text: "API access", included: false },
      { text: "No file size limit", included: false },
    ],
    cta: "Get Started",
    variant: "outline" as const,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For professionals and power users",
    popular: true,
    features: [
      { text: "Unlimited files", included: true },
      { text: "All tools access", included: true },
      { text: "File size up to 100MB", included: true },
      { text: "Client-side processing", included: true },
      { text: "Batch processing", included: true },
      { text: "Priority support", included: true },
      { text: "API access", included: false },
      { text: "No file size limit", included: false },
    ],
    cta: "Subscribe Now",
    variant: "primary" as const,
  },
  {
    name: "Business",
    price: "$29",
    period: "/month",
    description: "For teams and organizations",
    features: [
      { text: "Unlimited files", included: true },
      { text: "All tools access", included: true },
      { text: "No file size limit", included: true },
      { text: "Client-side processing", included: true },
      { text: "Batch processing", included: true },
      { text: "Priority support", included: true },
      { text: "API access", included: true },
      { text: "Team management", included: true },
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
  },
];

export async function generateMetadata({ params }: Props) {
  await params;
  return {
    title: "Pricing - WorldPDF",
    description: "Choose the perfect plan for your needs. Free, Pro, and Business plans available.",
  };
}

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;

  return (
    <Container className="py-16 md:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
          Simple, Transparent Pricing
        </h1>
        <p className="mt-4 text-lg text-surface-500 dark:text-surface-400 max-w-2xl mx-auto">
          Choose the plan that fits your needs. All plans include our core tools with no hidden fees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative flex flex-col ${plan.popular ? "border-brand-500 shadow-lg shadow-brand-500/10 scale-105 md:scale-110" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="brand" className="px-4 py-1 text-sm">
                  <Sparkles className="h-3.5 w-3.5 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            <CardHeader className={`text-center pb-0 ${plan.popular ? "pt-8" : ""}`}>
              <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">{plan.name}</h2>
              <div className="mt-4">
                <span className="text-4xl font-bold text-surface-900 dark:text-surface-50">{plan.price}</span>
                <span className="text-surface-400 text-sm">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-surface-500">{plan.description}</p>
            </CardHeader>
            <CardContent className="flex-1 pt-6">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.text} className="flex items-center gap-3 text-sm">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-500 shrink-0" />
                    ) : (
                      <X className="h-4 w-4 text-surface-300 shrink-0" />
                    )}
                    <span className={feature.included ? "text-surface-700 dark:text-surface-300" : "text-surface-400"}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Link href={`/${locale}/register`} className="w-full">
                <Button variant={plan.variant} className="w-full" size="lg">
                  {plan.cta}
                  <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Container>
  );
}
