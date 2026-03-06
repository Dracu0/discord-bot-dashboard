import React, { useContext, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, RefreshCw, Sparkles } from "lucide-react";

import { getNotifications } from "../../api/internal";
import { GuildContext } from "../../contexts/guild/GuildContext";
import { useTranslation } from "../../utils/Language";
import { Button } from "components/ui/button";
import { Badge } from "components/ui/badge";
import { SegmentedControl } from "components/ui/segmented-control";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "components/ui/dropdown-menu";
import { NotificationItem, getNotificationVariant } from "./NotificationItem";

const FILTERS = ["all", "unread", "moderation", "info", "success"];

function buildNotificationId(notification, index) {
    return notification.id || `${notification.type || "info"}-${notification.time || "now"}-${notification.message || "item"}-${index}`;
}

function useNotificationReadState(serverId) {
    const key = `notifications_dropdown_read_${serverId}`;
    const [readIds, setReadIds] = useState(() => {
        try {
            return new Set(JSON.parse(sessionStorage.getItem(key) || "[]"));
        } catch {
            return new Set();
        }
    });

    const persist = (next) => {
        sessionStorage.setItem(key, JSON.stringify([...next]));
        return next;
    };

    const markRead = (id) => {
        setReadIds((prev) => {
            const next = new Set(prev);
            next.add(id);
            return persist(next);
        });
    };

    const markAllRead = (ids) => {
        setReadIds(() => persist(new Set(ids)));
    };

    return { readIds, markRead, markAllRead };
}

function NotificationSkeleton() {
    return (
        <div className="space-y-3">
            {[0, 1, 2].map((item) => (
                <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-(--border-subtle) bg-(--surface-primary) p-4"
                >
                    <div className="mb-3 flex items-start gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-(--surface-secondary)" />
                        <div className="min-w-0 flex-1">
                            <div className="mb-2 h-4 w-32 rounded-full bg-(--surface-secondary)" />
                            <div className="h-3 w-full rounded-full bg-(--surface-secondary)" />
                        </div>
                    </div>
                    <div className="h-3 w-24 rounded-full bg-(--surface-secondary)" />
                </div>
            ))}
        </div>
    );
}

function EmptyState() {
    const { t } = useTranslation();

    return (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-(--border-default) bg-(--surface-primary) px-5 py-10 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--surface-secondary) text-(--accent-primary)">
                <Sparkles className="h-6 w-6" />
            </div>
            <p className="mb-1 font-['Space_Grotesk'] text-lg font-semibold text-(--text-primary)">
                {t("notifications.noNotifications")}
            </p>
            <p className="max-w-xs text-sm leading-6 text-(--text-secondary)">
                Nothing new is waiting here right now. Fresh moderation activity and review alerts will appear in this panel.
            </p>
        </div>
    );
}

function ErrorState({ onRetry }) {
    return (
        <div className="rounded-3xl border border-red-500/20 bg-red-500/8 p-5 text-sm text-(--text-primary)">
            <p className="mb-3 font-medium text-red-300">Failed to load notifications.</p>
            <Button variant="outline" size="sm" onClick={onRetry}>
                <RefreshCw className="h-3.5 w-3.5" />
                Try again
            </Button>
        </div>
    );
}

function SummaryCard({ label, value, tone = "default" }) {
    const toneClasses = {
        default: "bg-(--surface-primary) text-(--text-primary)",
        accent: "bg-(--accent-primary)/10 text-(--accent-primary)",
        warning: "bg-orange-500/10 text-orange-400",
    };

    return (
        <div className={`rounded-2xl border border-(--border-subtle) px-3.5 py-3 ${toneClasses[tone] || toneClasses.default}`}>
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] opacity-80">{label}</div>
            <div className="mt-1 font-['Space_Grotesk'] text-xl font-semibold">{value}</div>
        </div>
    );
}

export function Notifications() {
    const { id: serverId } = useContext(GuildContext);
    const { t } = useTranslation();
    const [filter, setFilter] = useState("all");

    const query = useQuery({
        queryKey: ["notifications", serverId],
        queryFn: () => getNotifications(serverId),
        staleTime: 60_000,
        refetchInterval: 60_000,
    });

    const normalized = useMemo(() => {
        return (query.data || []).map((notification, index) => ({
            ...notification,
            _id: buildNotificationId(notification, index),
        }));
    }, [query.data]);

    const { readIds, markRead, markAllRead } = useNotificationReadState(serverId);

    const unreadCount = useMemo(
        () => normalized.filter((notification) => !readIds.has(notification._id)).length,
        [normalized, readIds]
    );

    const moderationCount = useMemo(
        () => normalized.filter((notification) => getNotificationVariant(notification).key === "moderation").length,
        [normalized]
    );

    const actionableCount = useMemo(
        () => normalized.filter((notification) => {
            const variantKey = getNotificationVariant(notification).key;
            return variantKey === "moderation" || variantKey === "info";
        }).length,
        [normalized]
    );

    const filtered = useMemo(() => {
        switch (filter) {
            case "unread":
                return normalized.filter((notification) => !readIds.has(notification._id));
            case "moderation":
                return normalized.filter((notification) => getNotificationVariant(notification).key === "moderation");
            case "info":
                return normalized.filter((notification) => getNotificationVariant(notification).key === "info");
            case "success":
                return normalized.filter((notification) => getNotificationVariant(notification).key === "success");
            default:
                return normalized;
        }
    }, [filter, normalized, readIds]);

    const allIds = normalized.map((notification) => notification._id);
    const hasNotifications = normalized.length > 0;

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full"
                    aria-label="Notifications"
                >
                    {unreadCount > 0 && (
                        <span className="absolute right-1.5 top-1.5 flex h-2.5 w-2.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-(--accent-primary) opacity-55" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full border-2 border-(--surface-card) bg-(--accent-primary)" />
                        </span>
                    )}
                    <Bell size={18} className="text-(--text-primary)" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                sideOffset={10}
                className="w-[min(92vw,28rem)] overflow-hidden rounded-[28px] border border-(--border-default) bg-(--surface-card) p-0 shadow-(--shadow-lg)"
            >
                <div className="border-b border-(--border-subtle) bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.18),transparent_40%),linear-gradient(180deg,var(--surface-card)_0%,var(--surface-primary)_100%)] px-5 py-5 md:px-6">
                    <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <p className="font-['Space_Grotesk'] text-xl font-semibold text-(--text-primary)">
                                    {t("notifications.title")}
                                </p>
                                <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[11px]">
                                    {normalized.length}
                                </Badge>
                            </div>
                            <p className="max-w-sm text-sm leading-6 text-(--text-secondary)">
                                Review the latest moderation activity, suggestion queue updates, and dashboard alerts in one place.
                            </p>
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            className="shrink-0 rounded-full"
                            onClick={(event) => {
                                event.preventDefault();
                                markAllRead(allIds);
                            }}
                            disabled={!hasNotifications || unreadCount === 0}
                        >
                            {t("notifications.markAllRead")}
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                        <SummaryCard label="Unread" value={unreadCount} tone="accent" />
                        <SummaryCard label="Review queue" value={actionableCount} />
                        <SummaryCard label="Moderation" value={moderationCount} tone="warning" />
                    </div>
                </div>

                <div className="p-4 md:p-5">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                        <SegmentedControl
                            value={filter}
                            onChange={setFilter}
                            size="sm"
                            className="rounded-full"
                            items={FILTERS.map((value) => ({
                                value,
                                label: value === "all"
                                    ? t("notifications.all")
                                    : value === "unread"
                                        ? t("notifications.unread")
                                        : value === "moderation"
                                            ? "Mod"
                                            : value === "success"
                                                ? "OK"
                                                : "Info",
                            }))}
                        />

                        <div className="flex items-center gap-2 text-xs text-(--text-secondary)">
                            <span className="rounded-full border border-(--border-subtle) bg-(--surface-primary) px-2.5 py-1">
                                Latest first
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 rounded-full px-2.5"
                                onClick={(event) => {
                                    event.preventDefault();
                                    query.refetch();
                                }}
                            >
                                <RefreshCw className={`h-3.5 w-3.5 ${query.isFetching ? "animate-spin" : ""}`} />
                                Refresh
                            </Button>
                        </div>
                    </div>

                    {query.isError ? (
                        <ErrorState onRetry={() => query.refetch()} />
                    ) : query.isLoading ? (
                        <NotificationSkeleton />
                    ) : !hasNotifications ? (
                        <EmptyState />
                    ) : filtered.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-(--border-default) bg-(--surface-primary) px-5 py-8 text-center text-sm text-(--text-secondary)">
                            No notifications match the current filter.
                        </div>
                    ) : (
                        <div className="max-h-112 space-y-3 overflow-y-auto pe-1">
                            {filtered.map((notification) => (
                                <NotificationItem
                                    key={notification._id}
                                    notification={notification}
                                    isRead={readIds.has(notification._id)}
                                    onMarkRead={() => markRead(notification._id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
