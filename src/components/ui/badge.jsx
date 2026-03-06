import { cva } from "class-variance-authority";
import { cn } from "lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-(--radius-sm) px-2.5 py-0.5 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-(--accent-primary) text-white",
        secondary: "bg-(--surface-secondary) text-(--text-secondary) border border-(--border-default)",
        destructive: "bg-(--status-error) text-white",
        success: "bg-(--status-success) text-white",
        warning: "bg-(--status-warning) text-white",
        outline: "border border-(--border-default) text-(--text-primary)",
        blue: "bg-blue-500/10 text-blue-500 border border-blue-500/20",
        green: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20",
        red: "bg-red-500/10 text-red-500 border border-red-500/20",
        yellow: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
        violet: "bg-violet-500/10 text-violet-500 border border-violet-500/20",
        teal: "bg-teal-500/10 text-teal-500 border border-teal-500/20",
        orange: "bg-orange-500/10 text-orange-500 border border-orange-500/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
