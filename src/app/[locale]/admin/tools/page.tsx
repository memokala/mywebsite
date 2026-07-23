import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminToolsPage({ params }: Props) {
  const { locale } = await params;

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-50">
            Tools Management
          </h1>
          <p className="text-sm text-surface-500 mt-1">Manage all 58 tools across 13 categories</p>
        </div>
        <Button>
          <Link href={`/${locale}/admin/tools/new`}>Add New Tool</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
                  <th className="text-left p-4 font-medium text-surface-500">Tool</th>
                  <th className="text-left p-4 font-medium text-surface-500">Category</th>
                  <th className="text-left p-4 font-medium text-surface-500">Status</th>
                  <th className="text-left p-4 font-medium text-surface-500">Usage</th>
                  <th className="text-right p-4 font-medium text-surface-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: "Merge PDF", cat: "PDF", status: "active", usage: "12.4k" },
                  { name: "Compress PDF", cat: "PDF", status: "active", usage: "9.8k" },
                  { name: "Convert PDF", cat: "PDF", status: "active", usage: "8.2k" },
                  { name: "Compress Image", cat: "Image", status: "active", usage: "15.1k" },
                  { name: "QR Generator", cat: "Utility", status: "active", usage: "6.7k" },
                  { name: "JSON Formatter", cat: "Dev", status: "active", usage: "5.3k" },
                  { name: "AI Text Generator", cat: "AI", status: "draft", usage: "0" },
                ].map((tool) => (
                  <tr key={tool.name} className="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50">
                    <td className="p-4 font-medium text-surface-900 dark:text-surface-100">{tool.name}</td>
                    <td className="p-4 text-surface-500">{tool.cat}</td>
                    <td className="p-4">
                      <Badge variant={tool.status === "active" ? "success" : "warning"}>
                        {tool.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-surface-500">{tool.usage}</td>
                    <td className="p-4 text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
