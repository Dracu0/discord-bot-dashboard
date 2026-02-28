import React, { useContext, useMemo, useState } from "react";
import { ActionIcon, Badge, Box, Button, Group, SegmentedControl, Stack, Text, Tooltip } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "api/internal";
import { GuildContext } from "contexts/guild/GuildContext";
import { IconAlertCircle, IconShield, IconCircleCheck, IconCheck, IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { Locale, useLocale } from "utils/Language";

const TYPE_CONFIG = {
  info: { icon: IconAlertCircle, color: "blue", label: "Info" },
  moderation: { icon: IconShield, color: "orange", label: "Mod" },
  success: { icon: IconCircleCheck, color: "green", label: "OK" },
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
    <Group
      p="12px 16px"
      gap="sm"
      align="center"
      style={{
        background: "var(--surface-secondary)",
        borderRadius: "var(--radius-md)",
        opacity: isRead ? 0.6 : 1,
        transition: "opacity 0.2s ease",
      }}
    >
      <IconComp size={18} color={`var(--mantine-color-${cfg.color}-4)`} />
      <Text fz="sm" c="var(--text-primary)" style={{ flex: 1 }} lineClamp={1}>
        {notification.message}
      </Text>
      {notification.time && (
        <Text fz="xs" c="var(--text-secondary)" style={{ whiteSpace: "nowrap" }}>
          {new Date(notification.time).toLocaleDateString()}
        </Text>
      )}
      <Badge color={cfg.color} fz={10} radius="sm" px={6}>
        {cfg.label}
      </Badge>
      {!isRead && (
        <Tooltip label="Mark as read">
          <ActionIcon variant="subtle" size="sm" color="gray" onClick={onMarkRead} aria-label="Mark as read">
            <IconCheck size={14} />
          </ActionIcon>
        </Tooltip>
      )}
    </Group>
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
      <Box mb={24}>
        <Text fz="sm" c="var(--status-error)" fw={500}>
          <Locale zh="無法加載通知" en="Failed to load notifications." />
        </Text>
      </Box>
    );
  }

  if (!notifications || notifications.length === 0) return null;

  return (
    <Box mb={24}>
      <Group justify="space-between" align="center" mb={10}>
        <Group gap="xs">
          <Text
            fz="sm"
            fw={600}
            c="var(--text-primary)"
            ff="'Space Grotesk', sans-serif"
            lts="-0.01em"
          >
            <Locale zh="通知" en="Notifications" />
          </Text>
          {unreadCount > 0 && (
            <Badge size="sm" color="blue" variant="filled" radius="xl">
              {unreadCount}
            </Badge>
          )}
        </Group>
        {unreadCount > 0 && (
          <Button
            variant="subtle"
            size="compact-xs"
            onClick={() => markAllRead(notifications.map((n, i) => n.id ?? i))}
          >
            <Locale zh="全部已讀" en="Mark all read" />
          </Button>
        )}
      </Group>

      <SegmentedControl
        size="xs"
        mb={10}
        value={filter}
        onChange={setFilter}
        data={[
          { value: "all", label: locale({ zh: "全部", en: "All" }) },
          { value: "info", label: "Info" },
          { value: "moderation", label: "Mod" },
          { value: "success", label: "OK" },
        ]}
      />

      <Stack gap={8}>
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
      </Stack>

      {hasMore && (
        <Button
          variant="subtle"
          size="compact-sm"
          mt={8}
          fullWidth
          onClick={() => setExpanded(prev => !prev)}
          rightSection={expanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
        >
          {expanded
            ? locale({ zh: "收起", en: "Show less" })
            : locale({ zh: `顯示全部 (${filtered.length})`, en: `Show all (${filtered.length})` })
          }
        </Button>
      )}
    </Box>
  );
}
