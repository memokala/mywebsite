import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400">
        <li>
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5" />
            {item.href ? (
              <Link
                href={item.href}
                className="hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-surface-900 dark:text-surface-200 font-medium">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

