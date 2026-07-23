"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, Wrench, Shield } from "lucide-react";

type CounterItemProps = {
  end: number;
  suffix?: string;
  label: string;
  labelAr: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  locale: string;
  duration?: number;
};

function CounterItem({
  end,
  suffix = "",
  label,
  labelAr,
  icon: Icon,
  color,
  bg,
  locale,
  duration = 2000,
}: CounterItemProps) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isAr = locale === "ar";

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic for a smooth deceleration
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(end);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, duration, hasAnimated]);

  const formatNumber = (n: number) => {
    return n.toLocaleString(isAr ? "ar-EG" : "en-US");
  };

  return (
    <div ref={ref} className="text-center group">
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${bg} mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}
      >
        <Icon className={`h-7 w-7 ${color}`} />
      </div>
      <div className="text-3xl md:text-4xl font-extrabold text-surface-900 dark:text-surface-50 tabular-nums">
        {formatNumber(count)}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-surface-500 dark:text-surface-400 font-medium">
        {isAr ? labelAr : label}
      </div>
    </div>
  );
}

export function SocialProofCounters({ locale }: { locale: string }) {
  return (
    <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto py-8">
      <CounterItem
        end={1284720}
        suffix="+"
        label="Files Processed"
        labelAr="ملف تمت معالجته"
        icon={FileText}
        color="text-brand-500"
        bg="bg-brand-50 dark:bg-brand-950/40"
        locale={locale}
      />
      <CounterItem
        end={32}
        suffix="+"
        label="Free Tools"
        labelAr="أداة مجانية"
        icon={Wrench}
        color="text-purple-500"
        bg="bg-purple-50 dark:bg-purple-950/40"
        locale={locale}
      />
      <CounterItem
        end={0}
        label="Bytes Uploaded"
        labelAr="بايت تم رفعه"
        icon={Shield}
        color="text-emerald-500"
        bg="bg-emerald-50 dark:bg-emerald-950/40"
        locale={locale}
        duration={500}
      />
    </div>
  );
}
