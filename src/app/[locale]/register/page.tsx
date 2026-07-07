import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata() {
  return {
    title: "Sign Up - WorldPDF",
    description: "Create a free WorldPDF account to access premium features.",
  };
}

export default async function RegisterPage({ params }: Props) {
  const { locale } = await params;

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center pb-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/50 mx-auto mb-4">
              <UserPlus className="h-6 w-6 text-brand-500" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
              Create Account
            </h1>
            <p className="text-sm text-surface-500 mt-1">
              Sign up for a free WorldPDF account
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">First Name</label>
                  <input type="text" className="w-full h-10 px-3 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Last Name</label>
                  <input type="text" className="w-full h-10 px-3 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Email</label>
                <input type="email" className="w-full h-10 px-3 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">Password</label>
                <input type="password" className="w-full h-10 px-3 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Create a password" />
              </div>
              <Button className="w-full" size="lg">Create Account</Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-surface-500">
                Already have an account?{" "}
                <Link href={`/${locale}/login`} className="text-brand-500 hover:text-brand-600 font-medium">
                  Log in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
