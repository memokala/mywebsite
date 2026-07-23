import Link from "next/link";
import * as Icons from "lucide-react";
import { categories } from "@/lib/tools/registry";
import { Card, CardContent } from "@/components/ui/card";

type CategoryCardProps = {
  locale: string;
};

export function CategoryCards({ locale }: CategoryCardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {categories.map((cat) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const IconComponent = (Icons as any)[cat.icon] || Icons.Wrench;
        return (
          <Link key={cat.id} href={`/${locale}/${cat.slug}`}>
            <Card className="h-full">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${cat.tools[0]?.bgColor || "bg-surface-100 dark:bg-surface-800"}`}
                  >
                    <IconComponent
                      className={`h-6 w-6 ${cat.tools[0]?.color || "text-surface-500"}`}
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-surface-900 dark:text-surface-100">
                      {cat.title}
                    </h3>
                    <p className="mt-1 text-sm text-surface-500 dark:text-surface-400 line-clamp-2">
                      {cat.description}
                    </p>
                    <p className="mt-2 text-xs font-medium text-brand-500">
                      {cat.tools.length} tools
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

