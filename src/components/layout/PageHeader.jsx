import { cn } from "lib/utils";

export default function PageHeader({
  icon,
  title,
  description,
  meta,
  actions,
  className,
}) {
  return (
    <section
      className={cn(
        "rounded-[28px] border border-(--border-subtle) bg-(--surface-card) px-5 py-5 shadow-(--shadow-sm) md:px-6 md:py-6",
        className
      )}
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          {icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-(--sidebar-active) text-(--accent-primary) shadow-(--shadow-xs)">
              {icon}
            </div>
          )}
          <div className="min-w-0 space-y-2">
            <div className="space-y-1">
              <h1
                className="text-2xl font-bold tracking-tight text-(--text-primary) md:text-[28px]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {title}
              </h1>
              {description && (
                <p className="max-w-3xl text-sm leading-6 text-(--text-secondary) md:text-[15px]">
                  {description}
                </p>
              )}
            </div>
            {meta && (
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-(--text-muted)">
                {meta}
              </div>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
            {actions}
          </div>
        )}
      </div>
    </section>
  );
}
