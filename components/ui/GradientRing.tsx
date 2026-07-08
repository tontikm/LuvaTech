import { cn } from "@/lib/utils";

type GradientRingProps = {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  variant?: "dark" | "accent";
  fullWidth?: boolean;
};

export function GradientRing({
  children,
  className,
  innerClassName,
  variant = "dark",
  fullWidth = false,
}: GradientRingProps) {
  const widthClass = fullWidth ? "w-full sm:w-auto" : undefined;

  return (
    <span className={cn("gradient-ring", widthClass, className)}>
      <span
        className={cn(
          "gradient-ring-inner",
          variant === "accent" && "gradient-ring-inner--accent",
          widthClass,
          innerClassName,
        )}
      >
        {children}
      </span>
    </span>
  );
}
