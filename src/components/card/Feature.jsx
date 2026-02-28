import { Box, Button, Flex, Group, Switch, Text, Title, Tooltip } from "@mantine/core";
import { Link } from "react-router-dom";
import Card from "components/card/Card";
import React, { useContext } from "react";
import { GuildContext } from "../../contexts/guild/GuildContext";
import { Locale, useLocale } from "../../utils/Language";

export default function Feature({ banner, name, description, id: featureId, enabled, canToggle, onToggle, isToggling }) {
  const { id: serverId } = useContext(GuildContext);
  const configUrl = `/guild/${serverId}/features/${featureId}`;
  const locale = useLocale();

  return (
    <Card
      component={Link}
      to={configUrl}
      p={0}
      style={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        textDecoration: "none",
        opacity: canToggle && !enabled ? 0.7 : 1,
      }}
    >
      <Box
        w={4}
        style={{
          flexShrink: 0,
          background: enabled
            ? "var(--mantine-color-green-5)"
            : "linear-gradient(180deg, var(--mantine-color-brand-5), var(--mantine-color-brand-3))",
          borderRadius: "var(--radius-lg) 0 0 var(--radius-lg)",
        }}
      />

      <Flex align="center" justify="space-between" gap="md" p={16} style={{ flex: 1, minWidth: 0 }}>
        <Flex direction="column" gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Title order={4} c="var(--text-primary)" ff="'Space Grotesk', sans-serif" lh={1.3} truncate>
            {locale(name)}
          </Title>
          <Tooltip label={description} position="top" openDelay={500}>
            <Text c="var(--text-secondary)" fz="sm" fw={400} lineClamp={1} lh={1.5}>
              {description}
            </Text>
          </Tooltip>
        </Flex>

        <Group gap="sm" style={{ flexShrink: 0 }}>
          {canToggle && (
            <Switch
              checked={enabled}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggle?.(!enabled);
              }}
              onClick={(e) => e.preventDefault()}
              disabled={isToggling}
              size="sm"
              color="green"
            />
          )}
          <Button variant="filled" color="brand" size="sm" radius="md" h={36} fz="sm" fw={500}>
            <Locale zh="配置" en="Configure" />
          </Button>
        </Group>
      </Flex>
    </Card>
  );
}
