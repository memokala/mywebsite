export type ToolCategory =
  | "pdf"
  | "image"
  | "video"
  | "audio"
  | "ai"
  | "text"
  | "seo"
  | "developer"
  | "convert"
  | "calculators"
  | "finance"
  | "education"
  | "utility";

export interface Tool {
  id: string;
  slug: string;
  category: ToolCategory;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  icon: string;
  color: string;
  bgColor: string;
  isPro?: boolean;
  isNew?: boolean;
  isPopular?: boolean;
  faq?: ToolFAQ[];
  relatedTools?: string[];
}

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolCategory_ {
  id: ToolCategory;
  slug: string;
  title: string;
  description: string;
  metaTitle: string;
  metaDescription: string;
  icon: string;
  color: string;
  tools: Tool[];
}

