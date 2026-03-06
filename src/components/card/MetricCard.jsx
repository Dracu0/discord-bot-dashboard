import React from "react";

import Card from "components/card/Card";
import IconBox from "components/icons/IconBox";
import { cn } from "lib/utils";

const TONE_CLASSES = {
    default: "border-(--border-subtle) bg-(--surface-card)",
    accent: "border-(--accent-primary)/15 bg-(--accent-primary)/8",
    success: "border-emerald-500/15 bg-emerald-500/8",
    warning: "border-orange-500/15 bg-orange-500/8",
};

export default function MetricCard({
    icon,
    label,
    value,
    detail,
    tone = "default",
    variant = "default",
    className,
    contentClassName,
    iconContainerClassName,
    labelClassName,
    valueClassName,
    detailClassName,
}) {
    const cardClassName = cn(
        variant === "interactive" ? "h-full p-4 md:p-5" : "p-4.5",
        variant === "interactive" ? null : (TONE_CLASSES[tone] || TONE_CLASSES.default),
        className,
    );

    return (
        <Card variant={variant} className={cardClassName}>
            <div className={cn("flex h-full flex-col gap-4", contentClassName)}>
                <IconBox
                    className={cn(
                        "h-11 w-11 rounded-2xl bg-(--surface-secondary) text-(--accent-primary)",
                        iconContainerClassName,
                    )}
                    icon={icon}
                />
                <div className="space-y-1.5">
                    <p className={cn("text-xs font-semibold uppercase tracking-[0.14em] text-(--text-muted)", labelClassName)}>{label}</p>
                    <p className={cn("font-['Space_Grotesk'] font-bold tracking-tight text-(--text-primary)", variant === "interactive" ? "text-xl font-semibold" : "text-3xl", valueClassName)}>{value}</p>
                    {detail ? <p className={cn("text-sm leading-6 text-(--text-secondary)", detailClassName)}>{detail}</p> : null}
                </div>
            </div>
        </Card>
    );
}