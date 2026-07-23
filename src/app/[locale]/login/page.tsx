"use client";

import { useState, useTransition, use } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { LogIn, Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function LoginPage({ params }: Props) {
  const { locale } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || `/${locale}`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isAr = locale === "ar";

  // Check for NextAuth callback errors
  const urlError = searchParams.get("error");
  const initialError = urlError === "CredentialsSignin"
    ? (isAr ? "بيانات الدخول غير صحيحة." : "Invalid email or password.")
    : urlError
      ? (isAr ? "فشل تسجيل الدخول. يرجى المحاولة مرة أخرى." : "Sign in failed. Please try again.")
      : null;

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl,
        });

        if (result?.error) {
          if (result.error === "EMAIL_NOT_VERIFIED") {
            setError(isAr ? "لم يتم تفعيل الحساب بعد. يرجى مراجعة بريدك الإلكتروني لتأكيد التسجيل." : "Your email is not verified. Please check your inbox for a verification link.");
          } else {
            setError(isAr ? "البريد الإلكتروني أو كلمة المرور غير صحيحة." : "Invalid email or password.");
          }
        } else {
          setSuccess(isAr ? "تم تسجيل الدخول بنجاح! جاري تحويلك..." : "Login successful! Redirecting...");
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (err: any) {
        setError(
          isAr
            ? `حدث خطأ غير متوقع أثناء تسجيل الدخول: ${err?.message || err}`
            : `An unexpected error occurred during login: ${err?.message || err}`
        );
      }
    });
  };

  const handleOAuthLogin = (provider: "google" | "facebook") => {
    setError(null);
    signIn(provider, { callbackUrl });
  };

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl border-surface-200/50 dark:border-surface-800">
          <CardHeader className="text-center pb-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/50 mx-auto mb-4">
              <LogIn className="h-6 w-6 text-brand-500" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
              {isAr ? "تسجيل الدخول" : "Welcome Back"}
            </h1>
            <p className="text-sm text-surface-500 mt-1">
              {isAr ? "سجل دخول إلى حسابك في WorldPDF" : "Log in to your WorldPDF account"}
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            {(error || initialError) && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex items-start gap-2.5 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{error || initialError}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 flex items-start gap-2.5 text-green-600 dark:text-green-400 text-sm">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Email/Password Login */}
            <form onSubmit={handleCredentialsLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                  {isAr ? "البريد الإلكتروني" : "Email Address"}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-10 pl-10 pr-3 rtl:pl-3 rtl:pr-10 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="you@example.com"
                    required
                    disabled={isPending}
                  />
                  <Mail className="absolute left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300">
                    {isAr ? "كلمة المرور" : "Password"}
                  </label>
                  <Link
                    href={`/${locale}/forgot-password`}
                    className="text-xs font-semibold text-brand-500 hover:text-brand-600"
                  >
                    {isAr ? "نسيت كلمة المرور؟" : "Forgot password?"}
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-10 pl-10 pr-10 rtl:pl-10 rtl:pr-10 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="••••••••"
                    required
                    disabled={isPending}
                  />
                  <Lock className="absolute left-3.5 rtl:right-3.5 rtl:left-auto top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 rtl:left-3 rtl:right-auto top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
              </div>

              <Button className="w-full mt-2" size="lg" type="submit" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  isAr ? "تسجيل الدخول" : "Log In"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-surface-200 dark:border-surface-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-surface-900 px-2 text-surface-500">
                  {isAr ? "أو سجل دخول بواسطة" : "Or continue with"}
                </span>
              </div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-1">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOAuthLogin("google")}
                className="w-full font-semibold border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800 py-6"
              >
                <svg className="mr-2 h-5 w-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                {isAr ? "تسجيل الدخول بواسطة Google" : "Sign in with Google"}
              </Button>
            </div>

            <div className="mt-6 text-center text-sm text-surface-500">
              <p>
                {isAr ? "ليس لديك حساب؟" : "Don't have an account?"}{" "}
                <Link href={`/${locale}/register`} className="text-brand-500 hover:text-brand-600 font-medium">
                  {isAr ? "سجل مجاناً هنا" : "Sign up"}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
