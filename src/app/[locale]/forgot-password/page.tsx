"use client";

import { useState, useTransition, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Key, Mail, CheckCircle2, AlertCircle, Loader2, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { forgotPassword, resetPassword } from "@/lib/actions/auth";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function ForgotPasswordPage({ params }: Props) {
  const { locale } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isAr = locale === "ar";

  // Password Validation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[@$!%*?&]/.test(password);
  const passwordsMatch = password === confirmPassword && password !== "";
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber && hasSpecial && passwordsMatch;

  const handleRequestLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email) {
      setError(isAr ? "يرجى إدخال البريد الإلكتروني." : "Please enter your email.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await forgotPassword(email);
        if (res.error) {
          setError(res.error);
        } else {
          setSuccess(res.success || (isAr ? "تم إرسال رابط إعادة تعيين كلمة المرور!" : "Reset link sent successfully!"));
        }
      } catch (err) {
        setError(isAr ? "حدث خطأ غير متوقع." : "An unexpected error occurred.");
      }
    });
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError(isAr ? "رمز تعيين كلمة المرور غير صالح." : "Invalid reset token.");
      return;
    }

    if (!isPasswordValid) {
      setError(isAr ? "تأكد من مطابقة كلمتي المرور واستيفاء الشروط الأمنية." : "Please ensure passwords match and all security rules are met.");
      return;
    }

    startTransition(async () => {
      try {
        const res = await resetPassword(token, password);
        if (res.error) {
          setError(res.error);
        } else {
          setSuccess(res.success || (isAr ? "تم تغيير كلمة المرور بنجاح!" : "Password reset successfully!"));
          setTimeout(() => {
            router.push(`/${locale}/login`);
          }, 3000);
        }
      } catch (err) {
        setError(isAr ? "حدث خطأ غير متوقع أثناء تغيير كلمة المرور." : "An unexpected error occurred during password reset.");
      }
    });
  };

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl border-surface-200/50 dark:border-surface-800">
          <CardHeader className="text-center pb-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/50 mx-auto mb-4">
              <Key className="h-6 w-6 text-brand-500" />
            </div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
              {token 
                ? (isAr ? "إعادة تعيين كلمة المرور" : "Set New Password") 
                : (isAr ? "استعادة كلمة المرور" : "Forgot Password")}
            </h1>
            <p className="text-sm text-surface-500 mt-1">
              {token 
                ? (isAr ? "أدخل كلمة مرور جديدة قوية لحسابك" : "Enter a strong new password for your account")
                : (isAr ? "سنرسل لك رابطاً لإعادة تعيين كلمة المرور" : "We'll send you a link to reset your password")}
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

            {/* Request Reset Link Form */}
            {!token && !success && (
              <form onSubmit={handleRequestLink} className="space-y-4">
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
                <Button className="w-full" size="lg" type="submit" disabled={isPending}>
                  {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    isAr ? "إرسال رابط الاستعادة" : "Send Reset Link"
                  )}
                </Button>
              </form>
            )}

            {/* Set New Password Form */}
            {token && !success && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                    {isAr ? "كلمة المرور الجديدة" : "New Password"}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-10 px-3 pr-10 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="••••••••"
                      required
                      disabled={isPending}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                    {isAr ? "تأكيد كلمة المرور" : "Confirm Password"}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="••••••••"
                    required
                    disabled={isPending}
                  />
                </div>

                {/* Password Strength Checklist */}
                <div className="p-3 bg-surface-50 dark:bg-surface-800/40 rounded-lg text-xs space-y-1.5">
                  <p className="font-semibold text-surface-600 dark:text-surface-300">
                    {isAr ? "شروط كلمة المرور:" : "Password requirements:"}
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className={`flex items-center gap-1.5 ${hasMinLength ? "text-green-600" : "text-surface-400"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {isAr ? "8 أحرف على الأقل" : "At least 8 chars"}
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasUppercase ? "text-green-600" : "text-surface-400"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {isAr ? "حرف كبير (A-Z)" : "Uppercase letter"}
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasLowercase ? "text-green-600" : "text-surface-400"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {isAr ? "حرف صغير (a-z)" : "Lowercase letter"}
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasNumber ? "text-green-600" : "text-surface-400"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {isAr ? "رقم واحد (0-9)" : "One number"}
                    </div>
                    <div className={`flex items-center gap-1.5 ${hasSpecial ? "text-green-600" : "text-surface-400"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {isAr ? "رمز خاص (@$!%)" : "Special symbol"}
                    </div>
                    <div className={`flex items-center gap-1.5 ${passwordsMatch ? "text-green-600" : "text-surface-400"}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {isAr ? "كلمتا المرور متطابقتان" : "Passwords match"}
                    </div>
                  </div>
                </div>

                <Button className="w-full" size="lg" type="submit" disabled={isPending || !isPasswordValid}>
                  {isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    isAr ? "حفظ وتغيير كلمة المرور" : "Save & Reset Password"
                  )}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-surface-500">
                <Link href={`/${locale}/login`} className="text-brand-500 hover:text-brand-600 font-medium inline-flex items-center gap-1">
                  <ArrowRight className="h-4 w-4 rotate-180 rtl:rotate-0" />
                  {isAr ? "العودة لتسجيل الدخول" : "Back to login"}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
