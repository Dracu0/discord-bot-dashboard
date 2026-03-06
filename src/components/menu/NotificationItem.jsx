import React, { useMemo } from "react";
import { AlertCircle, BellRing, Check, CircleCheck, Shield, Sparkles } from "lucide-react";

import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";

const VARIANTS = {
    info: {
        key: "info",
        title: "Review queue update",
        label: "Info",
        icon: BellRing,
        badge: "blue",
        iconClass: "text-sky-300",
        iconSurface: "bg-sky-500/12 border-sky-400/20",
        unreadGlow: "shadow-[0_0_0_1px_rgba(56,189,248,0.18),0_12px_40px_rgba(14,165,233,0.12)]",
    },
    moderation: {
        key: "moderation",
        title: "Moderation activity",
        label: "Mod",
        icon: Shield,
        badge: "orange",
        iconClass: "text-orange-300",
        iconSurface: "bg-orange-500/12 border-orange-400/20",
        unreadGlow: "shadow-[0_0_0_1px_rgba(251,146,60,0.18),0_12px_40px_rgba(234,88,12,0.10)]",
    },
    success: {
        key: "success",
        title: "Completed successfully",
        label: "OK",
        icon: CircleCheck,
        badge: "green",
        iconClass: "text-emerald-300",
        iconSurface: "bg-emerald-500/12 border-emerald-400/20",
        unreadGlow: "shadow-[0_0_0_1px_rgba(16,185,129,0.18),0_12px_40px_rgba(5,150,105,0.10)]",
    },
    default: {
        key: "default",
        title: "New alert",
        label: "Alert",
        icon: AlertCircle,
        badge: "secondary",
        iconClass: "text-(--text-secondary)",
        iconSurface: "bg-(--surface-secondary) border-(--border-subtle)",
        unreadGlow: "shadow-(--shadow-sm)",
    },
};

function getRelativeTime(value) {
    if (!value) return "Just now";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Just now";

    const diffMs = date.getTime() - Date.now();
    const absMs = Math.abs(diffMs);
    const units = [
        [60_000, "minute"],
        [3_600_000, "hour"],
        [86_400_000, "day"],
        [604_800_000, "week"],
    ];

    if (absMs < 60_000) return "Just now";

    const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

    for (let i = units.length - 1; i >= 0; i -= 1) {
        const [step, unit] = units[i];
        if (absMs >= step) {
            return rtf.format(Math.round(diffMs / step), unit);
        }
    }

    return "Just now";
}

function getNotificationTitle(notification, variant) {
    if (notification.title) return notification.title;

    if (variant.key === "info" && /pending suggestion/i.test(notification.message || "")) {
        return "Suggestions need review";
    }

    if (variant.key === "moderation") {
        return "Recent moderation event";
    }

    return variant.title;
}

export function getNotificationVariant(notification) {
    if (notification.type && VARIANTS[notification.type]) {
        return VARIANTS[notification.type];
    }

    const message = String(notification.message || "").toLowerCase();
    if (message.includes("success") || message.includes("applied") || message.includes("completed")) {
        return VARIANTS.success;
    }
    if (message.includes("warn") || message.includes("ban") || message.includes("mute") || message.includes("kick")) {
        return VARIANTS.moderation;
    }

    return VARIANTS.info;
}

export function NotificationItem({ notification, isRead, onMarkRead }) {
    const variant = getNotificationVariant(notification);
    const Icon = variant.icon || Sparkles;

    const meta = useMemo(
        () => ({
            title: getNotificationTitle(notification, variant),
            relativeTime: getRelativeTime(notification.time),
            absoluteTime: notification.time ? new Date(notification.time).toLocaleString() : null,
        }),
        [notification, variant]
    );

    return (
        <article
            className={`group rounded-3xl border border-(--border-subtle) bg-(--surface-primary) p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-(--border-default) hover:shadow-(--shadow-md) ${!isRead ? variant.unreadGlow : "opacity-80"}`}
        >
            <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border ${variant.iconSurface}`}>
                    <Icon className={`h-5 w-5 ${variant.iconClass}`} />
                </div>

                <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                        <h4 className="font-['Space_Grotesk'] text-[15px] font-semibold leading-5 text-(--text-primary)">
                            {meta.title}
                        </h4>
                        <Badge variant={variant.badge} className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.12em]">
                            {variant.label}
                        </Badge>
                        {!isRead && (
                            <span className="inline-flex items-center rounded-full bg-(--accent-primary)/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-(--accent-primary)">
                                New
                            </span>
                        )}
                    </div>

                    <p className="mb-3 text-sm leading-6 text-(--text-secondary)">
                        {notification.message}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-(--text-secondary)">
                            <span>{meta.relativeTime}</span>
                            {meta.absoluteTime && (
                                <span className="hidden rounded-full border border-(--border-subtle) bg-(--surface-secondary) px-2 py-0.5 md:inline-flex">
                                    {meta.absoluteTime}
                                </span>
                            )}
                        </div>

                        {!isRead ? (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 rounded-full px-2.5"
                                onClick={onMarkRead}
                            >
                                <Check className="h-3.5 w-3.5" />
                                Mark read
                            </Button>
                        ) : (
                            <span className="text-xs font-medium text-(--text-secondary)">Read</span>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
