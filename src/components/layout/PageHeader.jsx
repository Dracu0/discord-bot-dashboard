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
        "overflow-hidden rounded-3xl border border-(--border-subtle) bg-[radial-gradient(circle_at_100%_0%,color-mix(in_srgb,var(--accent-primary)_14%,transparent)_0%,transparent_40%),linear-gradient(180deg,var(--surface-card)_0%,var(--surface-primary)_100%)] px-5 py-5 shadow-(--shadow-md) md:px-7 md:py-6.5",
        className
      )}
    >
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex min-w-0 items-start gap-4 md:gap-5.5">
          {icon && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-(--accent-primary)/20 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--accent-primary)_14%,transparent)_0%,color-mix(in_srgb,var(--accent-primary)_7%,transparent)_100%)] text-(--accent-primary) shadow-(--shadow-xs) md:h-14 md:w-14 md:rounded-3xl">
              {icon}
            </div>
          )}
          <div className="min-w-0 space-y-3">
            <div className="space-y-1.5">
              <h1
                className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-(--text-primary) md:text-[32px]"
              >
                {title}
              </h1>
              {description && (
                <p className="max-w-3xl text-sm leading-6 text-(--text-secondary) md:text-[15px] md:leading-7">
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
          <div className="flex shrink-0 flex-wrap items-center gap-2.5 rounded-2xl border border-(--border-subtle)/90 bg-(--surface-primary)/70 p-2 shadow-(--shadow-xs) xl:max-w-152 xl:justify-end">
            {actions}
          </div>
        )}
      </div>
    </section>
  );
}
