import { cn } from "lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--radius-lg)] bg-[var(--border-subtle)]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
