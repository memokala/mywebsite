import { cn } from "@/lib/utils/cn";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  title?: string;
  subtitle?: string;
};

export function Section({ children, className, id, title, subtitle }: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-24", className)}>
      <div className="container-nova">
        {title && (
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-4 text-lg text-surface-500 dark:text-surface-400">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

