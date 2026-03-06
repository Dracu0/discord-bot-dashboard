import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors duration-150",
  {
    variants: {
      variant: {
        default: "border-(--accent-primary)/15 bg-(--accent-primary) text-white",
        secondary: "border-(--border-default) bg-(--surface-secondary) text-(--text-secondary)",
        destructive: "border-red-500/20 bg-red-500/12 text-red-300",
        success: "border-emerald-500/20 bg-emerald-500/12 text-emerald-300",
        warning: "border-amber-500/20 bg-amber-500/12 text-amber-300",
        outline: "border-(--border-default) bg-transparent text-(--text-primary)",
        blue: "border-blue-500/20 bg-blue-500/12 text-blue-300",
        green: "border-emerald-500/20 bg-emerald-500/12 text-emerald-300",
        red: "border-red-500/20 bg-red-500/12 text-red-300",
        yellow: "border-amber-500/20 bg-amber-500/12 text-amber-300",
        violet: "border-violet-500/20 bg-violet-500/12 text-violet-300",
        teal: "border-teal-500/20 bg-teal-500/12 text-teal-300",
        orange: "border-orange-500/20 bg-orange-500/12 text-orange-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const Badge = forwardRef(({ className, variant, ...props }, ref) => {
  return <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />;
});
Badge.displayName = "Badge";

export { Badge, badgeVariants };
