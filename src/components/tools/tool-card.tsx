import Link from "next/link";
import * as Icons from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Tool } from "@/types/tool";

type ToolCardProps = {
  tool: Tool;
  locale: string;
  categorySlug: string;
};

export function ToolCard({ tool, locale, categorySlug }: ToolCardProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (Icons as any)[tool.icon] || Icons.Wrench;

  return (
    <Link href={`/${locale}/${categorySlug}/${tool.slug}`}>
      <Card className="h-full">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tool.bgColor}`}
            >
              <IconComponent className={`h-6 w-6 ${tool.color}`} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-surface-900 dark:text-surface-100">
                  {tool.title}
                </h3>
                {tool.isNew && <Badge variant="brand">New</Badge>}
                {tool.isPopular && <Badge variant="success">Popular</Badge>}
              </div>
              <p className="mt-1 text-sm text-surface-500 dark:text-surface-400 line-clamp-2">
                {tool.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

