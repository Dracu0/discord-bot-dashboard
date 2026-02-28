import React from "react";
import { Badge, Group, Text, Tooltip } from "@mantine/core";
import { useBotStatus } from "hooks/useWebSocket";
import { Locale } from "utils/Language";

const STATUS_MAP = {
  online: { color: "green", label: { zh: "在線", en: "Online" } },
  idle: { color: "yellow", label: { zh: "閒置", en: "Idle" } },
  dnd: { color: "red", label: { zh: "請勿打擾", en: "Busy" } },
  offline: { color: "gray", label: { zh: "離線", en: "Offline" } },
};

export default function BotStatusIndicator() {
  const botStatus = useBotStatus();
  const status = botStatus?.status || "offline";
  const cfg = STATUS_MAP[status] || STATUS_MAP.offline;
  const ping = botStatus?.ping;

  return (
    <Group gap={8} align="center">
      <Tooltip
        label={ping != null ? `Ping: ${ping}ms` : "No data yet"}
        position="bottom"
      >
        <Badge
          color={cfg.color}
          variant="dot"
          size="lg"
          radius="md"
          styles={{ root: { cursor: "default", textTransform: "none" } }}
        >
          <Text component="span" fz="xs" fw={600}>
            <Locale {...cfg.label} />
          </Text>
        </Badge>
      </Tooltip>
    </Group>
  );
}
