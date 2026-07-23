"use client";

import { useState, useTransition, use } from "react";
import Link from "next/link";
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/lib/actions/auth";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function RegisterPage({ params }: Props) {
  const { locale } = use(params);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isAr = locale === "ar";

  // Password Requirements Checks (Simplified to minimum 6 characters)
  const isPasswordValid = password.length >= 6;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!isPasswordValid) {
      setError(isAr ? "يرجى استيفاء جميع شروط كلمة المرور." : "Please fulfill all password requirements.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await registerUser({ name, email, password });
        if (res.error) {
          setError(res.error);
        } else {
          setSuccess(res.success || (isAr ? "تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني." : "Registration successful! Please check your email."));
          // Reset form fields
          setName("");
          setEmail("");
          setPassword("");
        }
      } catch (err: any) {
        setError(
          isAr
            ? `حدث خطأ غير متوقع أثناء التسجيل: ${err?.message || err}`
            : `An unexpected error occurred during registration: ${err?.message || err}`
        );
      }
    });
  };

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl border-surface-200/50 dark:border-surface-800">
          <CardHeader className="text-center pb-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/50 mx-auto mb-4">
              <UserPlus className="h-6 w-6 text-brand-500" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
              {isAr ? "إنشاء حساب جديد" : "Create Account"}
            </h1>
            <p className="text-sm text-surface-500 mt-1">
              {isAr ? "سجل مجاناً في WorldPDF للوصول إلى أدواتنا" : "Sign up for a free WorldPDF account"}
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 flex items-start gap-2.5 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 flex items-start gap-2.5 text-green-600 dark:text-green-400 text-sm">
                <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                  {isAr ? "الاسم الكامل" : "Full Name"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 pl-10 pr-3 rtl:pl-3 rtl:pr-10 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="John Doe"
                    disabled={isPending}
                  />
                  <User className="absolute left-3.5 rtl:right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-surface-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                  {isAr ? "البريد الإلكتروني" : "Email"}
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
                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                  {isAr ? "كلمة المرور" : "Password"}
                </label>
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
                  isAr ? "تسجيل الحساب" : "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-surface-500">
              <p>
                {isAr ? "لديك حساب بالفعل؟" : "Already have an account?"}{" "}
                <Link href={`/${locale}/login`} className="text-brand-500 hover:text-brand-600 font-medium">
                  {isAr ? "سجل دخول هنا" : "Log in"}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
