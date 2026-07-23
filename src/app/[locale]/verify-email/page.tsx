"use client";

import { useEffect, useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { verifyEmail } from "@/lib/actions/auth";

type Props = {
  params: Promise<{ locale: string }>;
};

export default function VerifyEmailPage({ params }: Props) {
  const { locale } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isAr = locale === "ar";

  useEffect(() => {
    if (!token) {
      setError(isAr ? "رمز التحقق مفقود." : "Verification token is missing.");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyEmail(token);
        if (res.error) {
          setError(res.error);
        } else {
          setSuccess(res.success || (isAr ? "تم التحقق من بريدك الإلكتروني بنجاح!" : "Email verified successfully!"));
        }
      } catch (err) {
        setError(isAr ? "حدث خطأ غير متوقع أثناء تفعيل الحساب." : "An unexpected error occurred during verification.");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, isAr]);

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-md mx-auto">
        <Card className="shadow-xl border-surface-200/50 dark:border-surface-800">
          <CardHeader className="text-center pb-0">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
              {isAr ? "تأكيد البريد الإلكتروني" : "Email Verification"}
            </h1>
            <p className="text-sm text-surface-505 mt-1">
              {isAr ? "تفعيل حساب WorldPDF الخاص بك" : "Verifying your WorldPDF account"}
            </p>
          </CardHeader>
          <CardContent className="pt-8 text-center flex flex-col items-center justify-center min-h-[200px]">
            {loading && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 text-brand-500 animate-spin" />
                <p className="text-sm text-surface-600 dark:text-surface-400">
                  {isAr ? "جاري التحقق من الرمز، يرجى الانتظار..." : "Validating token, please wait..."}
                </p>
              </div>
            )}

            {!loading && error && (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 animate-bounce">
                  <AlertCircle className="h-8 w-8" />
                </div>
                <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                  {isAr ? "فشل التحقق من البريد" : "Verification Failed"}
                </p>
                <p className="text-sm text-surface-500 max-w-xs">
                  {error}
                </p>
                <Link href={`/${locale}/register`} className="w-full mt-4">
                  <Button variant="outline" className="w-full">
                    {isAr ? "الرجوع للتسجيل" : "Back to Sign Up"}
                  </Button>
                </Link>
              </div>
            )}

            {!loading && success && (
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/30 text-green-500">
                  <CheckCircle2 className="h-8 w-8 animate-pulse" />
                </div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                  {isAr ? "تم التفعيل بنجاح!" : "Activation Successful!"}
                </p>
                <p className="text-sm text-surface-500 max-w-xs">
                  {success}
                </p>
                <Link href={`/${locale}/login`} className="w-full mt-4">
                  <Button className="w-full gap-2">
                    {isAr ? "تسجيل الدخول" : "Proceed to Log In"}
                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
