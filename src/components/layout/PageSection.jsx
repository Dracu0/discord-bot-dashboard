import { cn } from "lib/utils";

export default function PageSection({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}) {
  return (
    <section className={cn("space-y-4", className)}>
      {(title || description || actions) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-1">
            {title && (
              <h2
                className="text-lg font-semibold text-(--text-primary)"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="max-w-3xl text-sm text-(--text-secondary)">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className={cn("space-y-4", contentClassName)}>{children}</div>
    </section>
  );
}
