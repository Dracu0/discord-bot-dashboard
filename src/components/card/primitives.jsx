import React from "react";
import { Link } from "react-router-dom";
import Card from "components/card/Card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "components/ui/tooltip";
import { cn } from "lib/utils";

export function CardHeading({
  title,
  description,
  badge,
  className,
  titleClassName,
  descriptionClassName,
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <h3
          className={cn(
            "m-0 font-['Space_Grotesk'] text-lg font-semibold leading-tight text-(--text-primary)",
            titleClassName
          )}
        >
          {title}
        </h3>
        {badge}
      </div>
      {description ? (
        <div
          className={cn(
            "mt-2 text-sm leading-6 text-(--text-secondary)",
            descriptionClassName
          )}
        >
          {description}
        </div>
      ) : null}
    </div>
  );
}

export function CardSectionHeader({
  title,
  description,
  action,
  icon,
  className,
  contentClassName,
  titleClassName,
  descriptionClassName,
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <CardHeading
        title={title}
        description={description}
        className={cn("flex-1", contentClassName)}
        titleClassName={cn("text-lg", titleClassName)}
        descriptionClassName={descriptionClassName}
      />
      {action || icon ? <div className="shrink-0">{action || icon}</div> : null}
    </div>
  );
}

export function CardMetric({
  label,
  value,
  sublabel,
  startContent,
  endContent,
  variant = "card",
  className,
}) {
  const content = (
    <div className="flex items-center gap-3">
      {startContent}
      <div className="min-w-0 flex flex-1 flex-col">
        <span className="text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-(--text-muted)">
          {label}
        </span>
        <span className="mt-1 font-['Space_Grotesk'] text-lg font-semibold leading-none text-(--text-primary) sm:text-2xl">
          {value ?? "\u2014"}
        </span>
        {sublabel ? (
          <span className="mt-1 text-xs text-(--text-secondary)">
            {sublabel}
          </span>
        ) : null}
      </div>
      {endContent ? <div className="ms-auto shrink-0">{endContent}</div> : null}
    </div>
  );

  if (variant === "chip") {
    return (
      <div
        className={cn(
          "rounded-2xl border border-(--border-subtle) bg-(--surface-primary) px-3 py-2.5 shadow-(--shadow-xs)",
          className
        )}
      >
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-(--text-muted)">
          {label}
        </div>
        <div className="mt-1 font-['Space_Grotesk'] text-lg font-semibold text-(--text-primary)">
          {value ?? "\u2014"}
        </div>
        {sublabel ? (
          <div className="mt-1 text-xs text-(--text-secondary)">{sublabel}</div>
        ) : null}
      </div>
    );
  }

  return (
    <Card className={cn("px-5 py-4", className)}>
      {content}
    </Card>
  );
}

export function CardPill({ className, children }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-(--border-subtle) bg-(--surface-primary) px-3 py-1.5 shadow-(--shadow-xs)",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AccentCardLink({
  to,
  accent,
  title,
  description,
  badge,
  controls,
  onMouseEnter,
  dimmed = false,
  className,
  contentClassName,
  titleClassName,
  descriptionClassName,
}) {
  const descriptionNode = description ? (
    <TooltipProvider>
      <Tooltip delayDuration={500}>
        <TooltipTrigger asChild>
          <p className={cn("m-0 max-w-3xl line-clamp-2 text-sm leading-6 text-(--text-secondary)", descriptionClassName)}>
            {description}
          </p>
        </TooltipTrigger>
        <TooltipContent side="top">{description}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : null;

  return (
    <Card
      variant="flush"
      className={cn(
        "group flex flex-row no-underline transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-(--shadow-md)",
        className
      )}
      style={{ opacity: dimmed ? 0.7 : 1 }}
      asChild
    >
      <Link to={to} onMouseEnter={onMouseEnter}>
        <div
          className="w-1 shrink-0"
          style={{
            background: accent,
            borderRadius: "var(--radius-lg) 0 0 var(--radius-lg)",
          }}
        />

        <div className={cn("flex min-w-0 flex-1 flex-col gap-4 px-4 py-4 md:flex-row md:items-start md:justify-between md:px-5 md:py-5", contentClassName)}>
          <CardHeading
            title={title}
            description={descriptionNode}
            badge={badge}
            className="flex min-w-0 flex-1 flex-col gap-0.5"
            titleClassName={cn("md:text-[19px]", titleClassName)}
          />

          {controls ? (
            <div className="flex shrink-0 flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center md:pt-0.5">
              {controls}
            </div>
          ) : null}
        </div>
      </Link>
    </Card>
  );
}
