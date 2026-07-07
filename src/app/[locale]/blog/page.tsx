import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Image, Video, Code } from "lucide-react";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata() {
  return {
    title: "Blog - WorldPDF",
    description: "Tips, tutorials, and news about online tools, PDF processing, image editing, and more.",
  };
}

const posts = [
  {
    title: "How to Compress PDF Files Without Losing Quality",
    excerpt: "Learn the best techniques to reduce PDF file size while maintaining crystal-clear quality.",
    icon: FileText,
    color: "text-red-500",
    date: "2025-01-15",
    category: "PDF Tools",
    readTime: "5 min read",
  },
  {
    title: "10 Image Optimization Tips for Web Developers",
    excerpt: "Optimize your website images for faster loading and better SEO rankings.",
    icon: Image,
    color: "text-blue-500",
    date: "2025-01-10",
    category: "Image Tools",
    readTime: "7 min read",
  },
  {
    title: "Best Video Formats for Social Media in 2025",
    excerpt: "A complete guide to choosing the right video format for every social platform.",
    icon: Video,
    color: "text-purple-500",
    date: "2025-01-05",
    category: "Video Tools",
    readTime: "6 min read",
  },
  {
    title: "JSON Formatting Best Practices for Developers",
    excerpt: "Master JSON formatting, validation, and debugging with these essential tips.",
    icon: Code,
    color: "text-zinc-500",
    date: "2024-12-28",
    category: "Developer Tools",
    readTime: "4 min read",
  },
];

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;

  return (
    <Container className="py-16 md:py-24">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-surface-900 dark:text-surface-50">
          Blog
        </h1>
        <p className="mt-6 text-lg text-surface-500 dark:text-surface-400">
          Tips, tutorials, and insights about online tools and productivity
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {posts.map((post) => {
          const Icon = post.icon;
          return (
            <Card key={post.title} className="group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-100 dark:bg-surface-800 ${post.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-xs text-surface-400 mb-2">
                      <span>{post.category}</span>
                      <span>&middot;</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h2 className="font-semibold text-surface-900 dark:text-surface-100 group-hover:text-brand-500 transition-colors mb-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center mt-12">
        <p className="text-surface-500 dark:text-surface-400 mb-4">More articles coming soon</p>
        <Link href={`/${locale}`} className="text-brand-500 hover:text-brand-600 font-medium text-sm">
          &larr; Back to Home
        </Link>
      </div>
    </Container>
  );
}
