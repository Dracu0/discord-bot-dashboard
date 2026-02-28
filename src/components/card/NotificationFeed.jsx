import React, { useContext } from "react";
import { Badge, Box, Group, Stack, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "api/internal";
import { GuildContext } from "contexts/guild/GuildContext";
import { IconAlertCircle, IconShield, IconCircleCheck } from "@tabler/icons-react";

const TYPE_CONFIG = {
  info: { icon: IconAlertCircle, color: "blue", label: "Info" },
  moderation: { icon: IconShield, color: "orange", label: "Mod" },
  success: { icon: IconCircleCheck, color: "green", label: "OK" },
};

function NotificationItem({ notification }) {
  const cfg = TYPE_CONFIG[notification.type] || TYPE_CONFIG.info;
  const IconComp = cfg.icon;

  return (
    <Group
      p="12px 16px"
      gap="sm"
      align="center"
      style={{ background: "var(--surface-secondary)", borderRadius: "var(--radius-md)" }}
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
    </Group>
  );
}

export default function NotificationFeed() {
  const { id: serverId } = useContext(GuildContext);
  const { data: notifications } = useQuery({
    queryKey: ["notifications", serverId],
    queryFn: () => getNotifications(serverId),
    staleTime: 60_000,
    refetchInterval: 60_000,
  });

  if (!notifications || notifications.length === 0) return null;

  return (
    <Box mb={24}>
      <Text
        fz="sm"
        fw={600}
        c="var(--text-primary)"
        mb={10}
        ff="'Space Grotesk', sans-serif"
        lts="-0.01em"
      >
        Notifications
      </Text>
      <Stack gap={8}>
        {notifications.map((n, i) => (
          <NotificationItem key={i} notification={n} />
        ))}
      </Stack>
    </Box>
  );
}
