import React, { useContext } from "react";
import { Avatar, Flex, Group, Skeleton, Text, Divider, Tooltip } from "@mantine/core";
import { GuildContext } from "contexts/guild/GuildContext";
import { iconToUrl, useGuild } from "api/discord/DiscordApi";
import { config } from "../../../config/config";

export function SidebarBrand({ collapsed }) {
  const { id } = useContext(GuildContext);

  return (
    <Flex align="center" direction="column" gap="md">
      {id != null ? (
        <GuildHeader id={id} collapsed={collapsed} />
      ) : (
        <Flex align="center" direction="column" gap="xs" my={20}>
          {collapsed ? (
            <Tooltip label={config.name} position="right">
              <Text
                fw={800}
                fz="lg"
                c="var(--accent-primary)"
                ff="'Space Grotesk', 'DM Sans', sans-serif"
              >
                {config.name.charAt(0)}
              </Text>
            </Tooltip>
          ) : (
            <>
              <Text
                fw={800}
                fz="xl"
                c="var(--accent-primary)"
                ff="'Space Grotesk', 'DM Sans', sans-serif"
                style={{ letterSpacing: "-0.5px" }}
              >
                {config.name}
              </Text>
              <Text fz="xs" c="var(--text-muted)" fw={500}>
                Dashboard
              </Text>
            </>
          )}
        </Flex>
      )}
      {!collapsed && <Divider w="80%" mb={20} color="var(--sidebar-border)" />}
    </Flex>
  );
}

function GuildHeader({ id, collapsed }) {
  const query = useGuild(id);

  if (query.isLoading) {
    return <Skeleton w={collapsed ? 40 : "80%"} h={collapsed ? 40 : 80} radius="xl" />;
  }

  const icon = iconToUrl(query.data.id, query.data.icon);

  if (collapsed) {
    return (
      <Flex direction="column" align="center" gap={4} mt="xs">
        <Tooltip label={query.data.name} position="right">
          <Avatar name={query.data.name} src={icon} size="sm" radius="xl" />
        </Tooltip>
      </Flex>
    );
  }

  return (
    <Flex direction="column" align="center" gap="xs" mt="xs">
      <Text
        fw={800}
        fz="xs"
        c="var(--accent-primary)"
        ff="'Space Grotesk', 'DM Sans', sans-serif"
        style={{ letterSpacing: "1px", textTransform: "uppercase" }}
      >
        {config.name}
      </Text>
      <Group
        align="center"
        px="md"
        py="xs"
        style={{ borderRadius: 16, background: "var(--surface-secondary)" }}
      >
        <Avatar name={query.data.name} src={icon} size="sm" radius="xl" />
        <Text fw="bold" fz="lg" c="var(--text-primary)">
          {query.data.name}
        </Text>
      </Group>
    </Flex>
  );
}

export default SidebarBrand;
