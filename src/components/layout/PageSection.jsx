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
    <section className={cn("space-y-5", className)}>
      {(title || description || actions) && (
        <div className="flex flex-col gap-3 border-b border-(--border-subtle)/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0 space-y-1.5">
            {title && (
              <h2
                className="font-['Space_Grotesk'] text-lg font-semibold text-(--text-primary) md:text-xl"
              >
                {title}
              </h2>
            )}
            {description && (
              <p className="max-w-3xl text-sm leading-6 text-(--text-secondary)">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 flex-wrap items-center gap-2.5">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className={cn("space-y-4", contentClassName)}>{children}</div>
    </section>
  );
}
