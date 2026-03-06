import React from "react";
import { Button } from "components/ui/button";
import { cn } from "lib/utils";

export default function Banner({ image, title, description, clip = true, children }) {
  return (
    <div
      className="relative flex min-h-40 flex-col overflow-hidden rounded-[28px] px-5 py-5 shadow-(--shadow-md) md:px-8 md:py-7"
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        background: !image
          ? "linear-gradient(135deg, var(--color-brand-600) 0%, var(--color-brand-500) 40%, var(--color-accent-400) 100%)"
          : undefined,
        backgroundSize: "cover",
      }}
    >
      {image && (
        <div className="absolute inset-0 z-0 rounded-[28px] bg-[linear-gradient(135deg,rgba(10,15,30,0.78)_0%,rgba(18,28,45,0.48)_45%,rgba(10,15,30,0.7)_100%)]" />
      )}
      <div className="relative z-1 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <span
            className={cn(
              "text-xl text-white font-bold font-['Space_Grotesk'] tracking-tight leading-7 md:text-[26px] md:leading-8",
              clip && "max-w-full md:max-w-[80%]"
            )}
          >
            {title}
          </span>
          {description && (
            <span
              className={cn(
                "text-sm text-white/85 font-medium leading-6 line-clamp-3 md:text-[15px]",
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
    <Button asChild variant="secondary" size="sm" className="min-w-10" {...props}>
      <a href={url} className="no-underline">
        {leftIcon}
        {children}
      </a>
    </Button>
  );
}
