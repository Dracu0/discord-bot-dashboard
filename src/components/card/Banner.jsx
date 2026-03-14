import React from "react";
import { Button } from "components/ui/button";
import { cn } from "lib/utils";

export default function Banner({ image, title, description, clip = true, children }) {
  return (
    <div
      className="relative flex min-h-44 flex-col overflow-hidden rounded-3xl border border-(--border-subtle) px-5 py-5 shadow-(--shadow-md) md:px-8 md:py-7"
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        background: !image
          ? "linear-gradient(140deg, color-mix(in srgb, var(--color-brand-700) 86%, #0b1220) 0%, var(--color-brand-600) 36%, color-mix(in srgb, var(--color-accent-500) 82%, #101827) 100%)"
          : undefined,
        backgroundSize: "cover",
      }}
    >
      {image && (
        <div className="absolute inset-0 z-0 rounded-3xl bg-[linear-gradient(135deg,rgba(9,15,28,0.84)_0%,rgba(16,28,47,0.58)_46%,rgba(9,15,28,0.76)_100%)]" />
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle_at_92%_14%, rgba(255,255,255,0.18) 0%, transparent 34%), radial-gradient(circle_at_0%_100%, rgba(255,255,255,0.1) 0%, transparent 36%)",
        }}
      />
      <div className="relative z-1 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span
            className={cn(
              "text-xl text-white font-bold font-['Space_Grotesk'] tracking-tight leading-7 md:text-[28px] md:leading-8",
              clip && "max-w-full md:max-w-[80%]"
            )}
          >
            {title}
          </span>
          {description && (
            <span
              className={cn(
                "text-sm text-white/88 font-medium leading-6 line-clamp-3 md:text-[15px]",
                clip && "max-w-full md:max-w-[75%]"
              )}
            >
              {description}
            </span>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {children}
        </div>
      </div>
    </div>
  );
}

export function BannerButton({ url, children, leftIcon, ...props }) {
  return (
    <Button asChild variant="secondary" size="sm" className="min-w-10 rounded-xl border border-white/18 bg-white/92 text-slate-900 hover:bg-white" {...props}>
      <a href={url} className="no-underline">
        {leftIcon}
        {children}
      </a>
    </Button>
  );
}
