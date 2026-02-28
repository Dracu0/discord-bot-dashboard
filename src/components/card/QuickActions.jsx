import React, { useContext } from "react";
import { Box, Button, Group, Text, Tooltip } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconPuzzle, IconSettings, IconHandStop } from "@tabler/icons-react";
import { GuildContext } from "contexts/guild/GuildContext";
import { Locale } from "utils/Language";

const actions = [
  {
    icon: IconPuzzle,
    label: { zh: "管理功能", en: "Manage Features" },
    path: "features",
    color: "brand",
  },
  {
    icon: IconHandStop,
    label: { zh: "管理動作", en: "Manage Actions" },
    path: "actions",
    color: "brand",
  },
  {
    icon: IconSettings,
    label: { zh: "伺服器設定", en: "Server Settings" },
    path: "settings",
    color: "gray",
  },
];

export default function QuickActions() {
  const { id: serverId } = useContext(GuildContext);

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
        <Locale zh="快捷操作" en="Quick Actions" />
      </Text>
      <Group gap={10}>
        {actions.map(({ icon: Icon, label, path, color }) => (
          <Tooltip key={path} label={<Locale {...label} />} position="bottom">
            <Button
              component={Link}
              to={`/guild/${serverId}/${path}`}
              variant="light"
              color={color}
              size="sm"
              radius="md"
              leftSection={<Icon size={16} />}
            >
              <Locale {...label} />
            </Button>
          </Tooltip>
        ))}
      </Group>
    </Box>
  );
}
