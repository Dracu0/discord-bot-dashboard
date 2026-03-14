import { forwardRef } from "react";
import { cn } from "lib/utils";

const Input = forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-(--border-default) bg-(--surface-primary) px-3 py-1 text-sm text-(--text-primary) shadow-(--shadow-xs) transition-colors placeholder:text-(--text-muted) focus:border-(--accent-primary) focus:outline-none focus:ring-2 focus:ring-(--focus-ring-soft) focus:ring-offset-2 focus:ring-offset-(--focus-ring-offset-color) disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
