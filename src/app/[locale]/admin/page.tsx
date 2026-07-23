import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  LayoutDashboard,
  Wrench,
  BarChart,
  Users,
  Search,
  FileText,
  DollarSign,
  Settings,
  Megaphone,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ locale: string }>;
};

const adminLinks = [
  { icon: LayoutDashboard, labelKey: "dashboard", href: "/admin", color: "text-brand-500" },
  { icon: Wrench, labelKey: "tools", href: "/admin/tools", color: "text-purple-500" },
  { icon: BarChart, labelKey: "analytics", href: "/admin/analytics", color: "text-cyan-500" },
  { icon: Users, labelKey: "users", href: "/admin/users", color: "text-green-500" },
  { icon: Search, labelKey: "seo", href: "/admin/seo", color: "text-amber-500" },
  { icon: FileText, labelKey: "blog", href: "/admin/blog", color: "text-indigo-500" },
  { icon: Megaphone, labelKey: "ads", href: "/admin/ads", color: "text-red-500" },
  { icon: DollarSign, labelKey: "subscriptions", href: "/admin/subscriptions", color: "text-emerald-500" },
  { icon: Settings, labelKey: "settings", href: "/admin/settings", color: "text-surface-500" },
];

export default async function AdminPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "admin" });

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
            {t("title")}
          </h1>
          <p className="mt-1 text-surface-500 dark:text-surface-400">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {adminLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} href={`/${locale}${link.href}`}>
              <Card className="h-full hover:border-brand-500/50 transition-colors">
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-100 dark:bg-surface-800 ${link.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
                    {t(`sidebar.${link.labelKey}`)}
                  </span>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold text-surface-900 dark:text-surface-100 mb-4">
              Quick Stats
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Total Tools", value: "58" },
                { label: "Active Users", value: "12,847" },
                { label: "Today's Usage", value: "43,291" },
                { label: "Avg. Rating", value: "4.9/5" },
              ].map((stat) => (
                <div key={stat.label} className="p-3 rounded-xl bg-surface-50 dark:bg-surface-800">
                  <p className="text-xs text-surface-400">{stat.label}</p>
                  <p className="text-lg font-bold text-surface-900 dark:text-surface-100 mt-1">{stat.value}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-surface-900 dark:text-surface-100">
                AI Tool Generator
              </h2>
              <Sparkles className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-4">
              Generate new SEO-optimized tools with AI. Create unique tool pages with metadata, schema, and content.
            </p>
            <Button variant="primary" size="sm">Generate New Tool</Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
