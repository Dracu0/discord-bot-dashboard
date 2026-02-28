import { Box, Button, Flex, Group, Image, Switch, Text, Title, Tooltip } from "@mantine/core";
import { Link } from "react-router-dom";
import Card from "components/card/Card";
import React, { useContext } from "react";
import { GuildContext } from "../../contexts/guild/GuildContext";
import { Locale, useLocale } from "../../utils/Language";
import { useEnableFeatureMutation } from "../../api/utils";

export default function Feature({ banner, name, description, id: featureId, enabled, canToggle }) {
  const { id: serverId } = useContext(GuildContext);
  const configUrl = `/guild/${serverId}/features/${featureId}`;
  const enableMutation = useEnableFeatureMutation(serverId, featureId);
  const locale = useLocale();

  return (
    <Card
      component={Link}
      to={configUrl}
      p={0}
      style={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        textDecoration: "none",
        opacity: canToggle && !enabled ? 0.7 : 1,
      }}
    >
      {banner ? (
        <Image h={{ base: 56, md: 72 }} src={banner} fit="cover" />
      ) : (
        <Box
          h={{ base: 56, md: 72 }}
          style={{
            background: "linear-gradient(135deg, var(--mantine-color-brand-5) 0%, var(--mantine-color-brand-3) 50%, var(--mantine-color-cyan-5) 100%)",
          }}
        />
      )}

      <Flex direction="column" gap={8} p={16} style={{ flex: 1 }}>
        <Flex align="center" justify="space-between" gap="xs">
          <Title order={4} c="var(--text-primary)" ff="'Space Grotesk', sans-serif" lh={1.3}>
            {locale(name)}
          </Title>
          {canToggle && (
            <Switch
              checked={enabled}
              onChange={(e) => {
                e.preventDefault();
                e.stopPropagation();
                enableMutation.mutate(!enabled);
              }}
              onClick={(e) => e.preventDefault()}
              disabled={enableMutation.isPending}
              size="sm"
              color="green"
              style={{ flexShrink: 0 }}
            />
          )}
        </Flex>
        <Tooltip label={description} position="top" openDelay={500}>
          <Text c="var(--text-secondary)" fz="sm" fw={400} lineClamp={2} lh={1.5}>
            {description}
          </Text>
        </Tooltip>
        <Group mt="auto" pt={8}>
          <Button variant="light" color="brand" fz="xs" radius="md" size="xs" px={16}>
            <Locale zh="配置" en="Configure" />
          </Button>
        </Group>
      </Flex>
    </Card>
  );
}
