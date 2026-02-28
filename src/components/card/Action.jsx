import React, { useContext } from "react";
import { Box, Button, Flex, Group, Text } from "@mantine/core";
import Card from "components/card/Card";
import { Link } from "react-router-dom";
import { GuildContext } from "contexts/guild/GuildContext";
import { Locale, useLocale } from "../../utils/Language";
import { IconArrowRight } from "@tabler/icons-react";

export function Action({ id, action }) {
  const { id: serverId } = useContext(GuildContext);
  const configUrl = `/guild/${serverId}/actions/${id}`;
  const locale = useLocale();

  return (
    <Card component={Link} to={configUrl} p={0} style={{ overflow: "hidden", textDecoration: "none", display: "flex", flexDirection: "row" }}>
      <Box
        w={4}
        style={{
          flexShrink: 0,
          background: "linear-gradient(180deg, var(--mantine-color-brand-6), var(--mantine-color-pink-5))",
          borderRadius: "var(--radius-lg) 0 0 var(--radius-lg)",
        }}
      />

      <Flex align="center" justify="space-between" gap="md" p={16} style={{ flex: 1, minWidth: 0 }}>
        <Flex direction="column" gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Text
            c="var(--text-primary)"
            fz="lg"
            fw={600}
            ff="'Space Grotesk', sans-serif"
            truncate
          >
            {locale(action.name)}
          </Text>
          <Text c="var(--text-secondary)" fz="sm" lineClamp={1} lh={1.5}>
            {action.description}
          </Text>
        </Flex>

        <Group style={{ flexShrink: 0 }}>
          <Button
            variant="filled"
            color="brand"
            size="sm"
            radius="md"
            h={36}
            fz="sm"
            fw={500}
            rightSection={<IconArrowRight size={14} />}
          >
            <Locale zh="打開" en="Open" />
          </Button>
        </Group>
      </Flex>
    </Card>
  );
}