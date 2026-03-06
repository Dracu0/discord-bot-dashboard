import React, { useContext, useMemo, useState } from "react";
import { BellRing, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "api/internal";
import { GuildContext } from "contexts/guild/GuildContext";
import { Locale, useLocale } from "utils/Language";
import Card from "components/card/Card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { SegmentedControl } from "components/ui/segmented-control";
import { NotificationItem, getNotificationVariant } from "components/menu/NotificationItem";

const COLLAPSED_COUNT = 4;

function useReadState(serverId) {
  const key = `notif_read_${serverId}`;
  const [readIds, setReadIds] = useState(() => {
    try {
      return new Set(JSON.parse(sessionStorage.getItem(key) || "[]"));
    } catch { return new Set(); }
  });

  const markRead = (id) => {
    setReadIds(prev => {
      const next = new Set(prev);
      next.add(id);
      sessionStorage.setItem(key, JSON.stringify([...next]));
      return next;
    });
  };

  const markAllRead = (ids) => {
    setReadIds(() => {
      const next = new Set(ids);
      sessionStorage.setItem(key, JSON.stringify([...next]));
      return next;
    });
  };

  return { readIds, markRead, markAllRead };
}

function buildNotificationId(notification, index) {
  return notification.id || `${notification.type || "info"}-${notification.time || "now"}-${notification.message || "item"}-${index}`;
}

function SummaryChip({ label, value, variant = "secondary" }) {
  return (
    <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-primary) px-3 py-2.5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-(--text-muted)">{label}</div>
      <div className="mt-1 font-['Space_Grotesk'] text-lg font-semibold text-(--text-primary)">{value}</div>
    </div>
  );
}

export default function NotificationFeed() {
  const { id: serverId } = useContext(GuildContext);
  const locale = useLocale();
  const { data: notifications, isError } = useQuery({
    queryKey: ["notifications", serverId],
    queryFn: () => getNotifications(serverId),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });

  const [filter, setFilter] = useState("all");
  const { readIds, markRead, markAllRead } = useReadState(serverId);

  const normalized = useMemo(
    () => (notifications || []).map((notification, index) => ({
      ...notification,
      _id: buildNotificationId(notification, index),
    })),
    [notifications]
  );

  const filtered = useMemo(() => {
    if (!normalized) return [];
    if (filter === "all") return normalized;
    if (filter === "unread") return normalized.filter((n) => !readIds.has(n._id));
    return normalized.filter((n) => getNotificationVariant(n).key === filter);
  }, [normalized, filter, readIds]);

  const displayed = filtered.slice(0, COLLAPSED_COUNT);

  const unreadCount = useMemo(() => {
    return normalized.filter((n) => !readIds.has(n._id)).length;
  }, [normalized, readIds]);

  const moderationCount = useMemo(
    () => normalized.filter((notification) => getNotificationVariant(notification).key === "moderation").length,
    [normalized]
  );

  const infoCount = useMemo(
    () => normalized.filter((notification) => getNotificationVariant(notification).key === "info").length,
    [normalized]
  );

  if (isError) {
    return (
      <Card variant="panel">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/8 p-5 text-sm text-(--text-primary)">
          <span className="font-medium text-red-300">
            <Locale zh="無法加載通知" en="Failed to load notifications." />
          </span>
        </div>
      </Card>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Card variant="panel">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-(--text-primary)">
              <Locale zh="通知中心" en="Notification stream" />
            </h3>
            <p className="mt-1 text-sm leading-6 text-(--text-secondary)">
              <Locale zh="即時掌握建議、管理事件與系統提醒。" en="Stay on top of review queue changes, moderation activity, and system alerts." />
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-(--surface-secondary) text-(--accent-primary)">
            <BellRing className="h-5 w-5" />
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-(--border-default) bg-(--surface-primary) px-5 py-10 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--surface-secondary) text-(--accent-primary)">
            <Sparkles className="h-6 w-6" />
          </div>
          <p className="font-['Space_Grotesk'] text-lg font-semibold text-(--text-primary)">
            <Locale zh="目前沒有新通知" en="No new notifications" />
          </p>
          <p className="mt-1 max-w-xs text-sm leading-6 text-(--text-secondary)">
            <Locale zh="一旦有待審建議或新的管理動作，它們會在這裡顯示。" en="As soon as there are pending reviews or moderation events, they will appear here." />
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="panel">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-(--text-primary)">
            <Locale zh="通知中心" en="Notification stream" />
          </h3>
          <p className="mt-1 text-sm leading-6 text-(--text-secondary)">
            <Locale zh="在儀表板上直接查看最新提醒，快速判斷現在最需要你處理的是什麼。" en="Keep the most recent alerts visible on the dashboard so you can tell what needs attention right now." />
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={() => markAllRead(normalized.map((n) => n._id))}
          disabled={unreadCount === 0}
        >
          <Locale zh="全部已讀" en="Mark all read" />
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2.5">
        <SummaryChip label={locale({ zh: "未讀", en: "Unread" })} value={unreadCount} />
        <SummaryChip label={locale({ zh: "資訊", en: "Info" })} value={infoCount} />
        <SummaryChip label={locale({ zh: "管理", en: "Mod" })} value={moderationCount} />
      </div>

      <SegmentedControl
        value={filter}
        onValueChange={setFilter}
        items={[
          { value: "all", label: locale({ zh: "全部", en: "All" }) },
          { value: "unread", label: locale({ zh: "未讀", en: "Unread" }) },
          { value: "info", label: "Info" },
          { value: "moderation", label: "Mod" },
          { value: "success", label: "OK" },
        ]}
        size="sm"
        className="mb-4 rounded-full"
      />

      <div className="space-y-3">
        {displayed.length > 0 ? displayed.map((notification) => (
          <NotificationItem
            key={notification._id}
            notification={notification}
            isRead={readIds.has(notification._id)}
            onMarkRead={() => markRead(notification._id)}
          />
        )) : (
          <div className="rounded-3xl border border-dashed border-(--border-default) bg-(--surface-primary) px-5 py-8 text-center text-sm text-(--text-secondary)">
            <Locale zh="目前篩選條件下沒有通知。" en="No notifications match the current filter." />
          </div>
        )}
      </div>

      {filtered.length > COLLAPSED_COUNT && (
        <div className="mt-4 flex items-center justify-between rounded-2xl border border-(--border-subtle) bg-(--surface-primary) px-4 py-3 text-sm text-(--text-secondary)">
          <span>
            <Locale zh={`尚有 ${filtered.length - COLLAPSED_COUNT} 則通知未顯示`} en={`${filtered.length - COLLAPSED_COUNT} more notifications available`} />
          </span>
          <Badge variant="secondary">{filtered.length}</Badge>
        </div>
      )}
    </Card>
  );
}
