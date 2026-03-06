import { cn } from "lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-(--radius-lg) bg-(--border-subtle)",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
