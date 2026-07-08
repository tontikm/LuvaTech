import { cn } from "@/lib/utils";

export function GradientRing({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("gradient-ring inline-flex", className)}>
      <span className="gradient-ring-inner inline-flex">{children}</span>
    </span>
  );
}
