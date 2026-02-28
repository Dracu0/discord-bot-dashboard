import React, { useContext } from "react";
import { Box, Button, Flex, Group, Image, Text } from "@mantine/core";
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
    <Card component={Link} to={configUrl} p={0} style={{ overflow: "hidden", textDecoration: "none" }}>
      {action.banner ? (
        <Image h={{ base: 56, md: 72 }} fit="cover" src={action.banner} />
      ) : (
        <Box
          h={{ base: 56, md: 72 }}
          style={{
            background: "linear-gradient(135deg, var(--mantine-color-brand-6) 0%, var(--mantine-color-pink-5) 50%, var(--mantine-color-yellow-5) 100%)",
          }}
        />
      )}
      <Flex direction="column" gap={8} p={16}>
        <Text
          c="var(--text-primary)"
          fz="lg"
          fw={600}
          ff="'Space Grotesk', sans-serif"
        >
          {locale(action.name)}
        </Text>
        <Text c="var(--text-secondary)" fz="sm" lineClamp={2} lh={1.5}>
          {action.description}
        </Text>
        <Group mt={4}>
          <Button
            variant="light"
            color="brand"
            size="xs"
            radius="md"
            rightSection={<IconArrowRight size={14} />}
          >
            <Locale zh="打開" en="Open" />
          </Button>
        </Group>
      </Flex>
    </Card>
  );
}