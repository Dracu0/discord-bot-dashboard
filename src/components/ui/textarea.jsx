import { forwardRef } from "react";
import { cn } from "lib/utils";

const Textarea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-(--radius-md) border border-(--border-default) bg-(--surface-primary) px-3 py-2 text-sm text-(--text-primary) shadow-(--shadow-xs) transition-colors placeholder:text-(--text-muted) focus:border-(--accent-primary) focus:outline-none focus:ring-2 focus:ring-(--accent-primary)/15 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
