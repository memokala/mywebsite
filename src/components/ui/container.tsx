import { cn } from "@/lib/utils/cn";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  id?: string;
};

export function Container({ children, className, as: Comp = "div", id }: ContainerProps) {
  return (
    <Comp id={id} className={cn("container-nova", className)}>
      {children}
    </Comp>
  );
}

