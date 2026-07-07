import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata() {
  return {
    title: "Log In - WorldPDF",
    description: "Log in to your WorldPDF account to access premium features.",
  };
}

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center pb-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/50 mx-auto mb-4">
              <LogIn className="h-6 w-6 text-brand-500" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
              Welcome Back
            </h1>
            <p className="text-sm text-surface-500 mt-1">
              Log in to your WorldPDF account
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email</label>
                <input type="email" className="w-full h-10 px-3 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Password</label>
                <input type="password" className="w-full h-10 px-3 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Enter your password" />
              </div>
              <Button className="w-full" size="lg">Log In</Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-surface-500">
                Don&apos;t have an account?{" "}
                <Link href={`/${locale}/register`} className="text-brand-500 hover:text-brand-600 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
