import React, { useContext, useMemo, useState } from "react";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { SegmentedControl } from "components/ui/segmented-control";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "api/internal";
import { GuildContext } from "contexts/guild/GuildContext";
import { AlertCircle, Shield, CircleCheck, Check, ChevronDown, ChevronUp } from "lucide-react";
import { Locale, useLocale } from "utils/Language";

const TYPE_CONFIG = {
  info: { icon: AlertCircle, color: "blue", dotClass: "text-blue-400", label: "Info" },
  moderation: { icon: Shield, color: "orange", dotClass: "text-orange-400", label: "Mod" },
  success: { icon: CircleCheck, color: "green", dotClass: "text-green-400", label: "OK" },
};

const BADGE_COLOR_CLASSES = {
  blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  green: "bg-green-500/20 text-green-400 border-green-500/30",
};

const COLLAPSED_COUNT = 5;

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

function NotificationItem({ notification, isRead, onMarkRead }) {
  const cfg = TYPE_CONFIG[notification.type] || TYPE_CONFIG.info;
  const IconComp = cfg.icon;

  return (
    <div
      className="flex items-center gap-2 px-4 py-3 rounded-md transition-opacity duration-200"
      style={{
        background: "var(--surface-secondary)",
        opacity: isRead ? 0.6 : 1,
      }}
    >
      <IconComp className={`h-4.5 w-4.5 shrink-0 ${cfg.dotClass}`} />
      <span className="text-sm text-(--text-primary) flex-1 line-clamp-1">
        {notification.message}
      </span>
      {notification.time && (
        <span className="text-xs text-(--text-secondary) whitespace-nowrap">
          {new Date(notification.time).toLocaleDateString()}
        </span>
      )}
      <Badge
        variant="outline"
        className={`text-[10px] px-1.5 rounded-sm ${BADGE_COLOR_CLASSES[cfg.color] || ""}`}
      >
        {cfg.label}
      </Badge>
      {!isRead && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className="inline-flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={onMarkRead}
                aria-label="Mark as read"
              >
                <Check className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>Mark as read</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
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
  const [expanded, setExpanded] = useState(false);
  const { readIds, markRead, markAllRead } = useReadState(serverId);

  const filtered = useMemo(() => {
    if (!notifications) return [];
    if (filter === "all") return notifications;
    return notifications.filter(n => n.type === filter);
  }, [notifications, filter]);

  const displayed = expanded ? filtered : filtered.slice(0, COLLAPSED_COUNT);
  const hasMore = filtered.length > COLLAPSED_COUNT;

  const unreadCount = useMemo(() => {
    if (!notifications) return 0;
    return notifications.filter((n, i) => !readIds.has(n.id ?? i)).length;
  }, [notifications, readIds]);

  if (isError) {
    return (
      <div className="mb-6">
        <span className="text-sm text-(--status-error) font-medium">
          <Locale zh="無法加載通知" en="Failed to load notifications." />
        </span>
      </div>
    );
  }

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-(--text-primary) font-['Space_Grotesk'] tracking-tight">
            <Locale zh="通知" en="Notifications" />
          </span>
          {unreadCount > 0 && (
            <Badge className="rounded-full text-xs px-2">
              {unreadCount}
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 px-2 text-xs"
            onClick={() => markAllRead(notifications.map((n, i) => n.id ?? i))}
          >
            <Locale zh="全部已讀" en="Mark all read" />
          </Button>
        )}
      </div>

      <SegmentedControl
        value={filter}
        onValueChange={setFilter}
        items={[
          { value: "all", label: locale({ zh: "全部", en: "All" }) },
          { value: "info", label: "Info" },
          { value: "moderation", label: "Mod" },
          { value: "success", label: "OK" },
        ]}
        size="sm"
        className="mb-2.5"
      />

      <div className="flex flex-col gap-2">
        {displayed.map((n, i) => {
          const nId = n.id ?? i;
          return (
            <NotificationItem
              key={nId}
              notification={n}
              isRead={readIds.has(nId)}
              onMarkRead={() => markRead(nId)}
            />
          );
        })}
      </div>

      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-2"
          onClick={() => setExpanded(prev => !prev)}
        >
          {expanded
            ? locale({ zh: "收起", en: "Show less" })
            : locale({ zh: `顯示全部 (${filtered.length})`, en: `Show all (${filtered.length})` })
          }
          {expanded ? <ChevronUp className="ml-1 h-3.5 w-3.5" /> : <ChevronDown className="ml-1 h-3.5 w-3.5" />}
        </Button>
      )}
    </div>
  );
}
