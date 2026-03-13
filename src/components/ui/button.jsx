import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "lib/utils";

const buttonVariants = cva(
  "touch-target inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-(--radius-md) text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--focus-ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--focus-ring-offset-color) disabled:pointer-events-none disabled:opacity-50 cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-(--accent-primary) text-white hover:brightness-110 shadow-(--shadow-sm)",
        destructive: "bg-(--status-error) text-white hover:brightness-110",
        outline: "border border-(--border-default) bg-transparent text-(--text-primary) hover:bg-(--surface-secondary)",
        secondary: "bg-(--surface-secondary) text-(--text-primary) hover:bg-(--border-subtle)",
        ghost: "text-(--text-primary) hover:bg-(--surface-secondary)",
        link: "text-(--accent-primary) underline-offset-4 hover:underline",
        success: "bg-(--status-success) text-white hover:brightness-110",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-(--radius-sm) px-3 text-xs",
        lg: "h-10 rounded-(--radius-md) px-6 text-base",
        xl: "h-12 rounded-(--radius-lg) px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  );
});
Button.displayName = "Button";

export { Button, buttonVariants };
