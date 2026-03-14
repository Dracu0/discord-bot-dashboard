import { forwardRef } from "react";
import { cn } from "lib/utils";

const Card = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-(--border-subtle) bg-(--surface-card) p-5 shadow-(--shadow-sm) transition-all duration-200",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("text-lg font-(--font-heading) text-(--text-primary) leading-none tracking-tight", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-sm text-(--text-secondary)", className)} {...props} />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center pt-4", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
