import React from "react";
import { Button } from "components/ui/button";
import { cn } from "lib/utils";

export default function Banner({ image, title, description, clip = true, children }) {
  return (
    <div
      className="flex flex-col py-4 md:py-6 px-5 md:px-8 rounded-2xl relative overflow-hidden"
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        background: !image
          ? "linear-gradient(135deg, var(--color-brand-600) 0%, var(--color-brand-500) 40%, var(--color-accent-400) 100%)"
          : undefined,
        backgroundSize: "cover",
      }}
    >
      {image && (
        <div className="absolute inset-0 bg-black/40 rounded-2xl z-0" />
      )}
      <div className="flex items-center justify-between flex-wrap gap-2 relative z-1">
        <div className="flex flex-col flex-1 min-w-0">
          <span
            className={cn(
              "text-lg md:text-[22px] text-white font-bold font-['Space_Grotesk'] tracking-tight leading-6 md:leading-7",
              clip && "max-w-full md:max-w-[80%]"
            )}
          >
            {title}
          </span>
          {description && (
            <span
              className={cn(
                "text-sm text-white/85 font-medium mt-1 leading-5 line-clamp-2",
                clip && "max-w-full md:max-w-[75%]"
              )}
            >
              {description}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {children}
        </div>
      </div>
    </div>
  );
}

export function BannerButton({ url, children, ...props }) {
  return (
    <Button asChild variant="secondary" size="sm" className="min-w-10" {...props}>
      <a href={url} className="no-underline">{children}</a>
    </Button>
  );
}
