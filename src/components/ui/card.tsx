import { cn } from "@/lib/utils/cn";

type CardProps = {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
};

export function Card({ className, children, hover = true }: CardProps) {
  return (
    <div
      className={cn(
        "card",
        hover && "hover:-translate-y-0.5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-6 pt-6 pb-4", className)}>{children}</div>;
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-6 py-4", className)}>{children}</div>;
}

export function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("px-6 pt-4 pb-6", className)}>{children}</div>;
}

