import { Box, Button, Flex, Group, Image, Text, Title, Tooltip } from "@mantine/core";
import { Link } from "react-router-dom";
import Card from "components/card/Card";
import React, { useContext } from "react";
import { GuildContext } from "../../contexts/guild/GuildContext";
import { Locale, useLocale } from "../../utils/Language";
import { useEnableFeatureMutation } from "../../api/utils";
import { useDetailColor, useTextColor, useColorValue } from "../../utils/colors";

export default function Feature({ banner, name, description, id: featureId, enabled, canToggle }) {
  const { id: serverId } = useContext(GuildContext);
  const configUrl = `/guild/${serverId}/features/${featureId}`;
  const enableMutation = useEnableFeatureMutation(serverId, featureId);
  const locale = useLocale();

  const textColor = useTextColor();
  const detailColor = useDetailColor();
  const hoverBorder = useColorValue("var(--mantine-color-brand-2)", "var(--mantine-color-brand-6)");
  const statusColor = enabled ? "var(--mantine-color-green-4)" : "var(--mantine-color-red-4)";

  return (
    <Card
      p={16}
      style={{
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        transition: "all 0.25s ease",
        cursor: "pointer",
      }}
    >
      {banner ? (
        <Image h={{ base: 64, md: 80 }} src={banner} fit="cover" radius={16} />
      ) : (
        <Box
          h={{ base: 64, md: 80 }}
          style={{
            background: "linear-gradient(135deg, var(--mantine-color-brand-5) 0%, var(--mantine-color-brand-3) 50%, var(--mantine-color-cyan-5) 100%)",
            borderRadius: 16,
          }}
        />
      )}

      <Flex direction="column" justify="space-between" gap="sm">
        <Flex direction="column">
          <Flex align="center" gap="xs">
            {canToggle && (
              <Box w={8} h={8} style={{ borderRadius: "50%", background: statusColor, flexShrink: 0 }} />
            )}
            <Title order={4} c={textColor} ff="'Space Grotesk', sans-serif">
              {locale(name)}
            </Title>
          </Flex>
          <Tooltip label={description} position="top" openDelay={500}>
            <Text c={detailColor} fz="sm" fw={400} lineClamp={2}>
              {description}
            </Text>
          </Tooltip>
        </Flex>
        <Group mt="md">
          <ConfigButton configUrl={configUrl} />
          {canToggle && (
            <EnableButton
              enabled={enabled}
              isLoading={enableMutation.isPending}
              onChange={enableMutation.mutate}
              featureName={locale(name)}
            />
          )}
        </Group>
      </Flex>
    </Card>
  );
}

function ConfigButton({ configUrl }) {
  return (
    <Link to={configUrl}>
      <Button variant="filled" color="brand" fz="sm" radius="xl" px={24} py={5}>
        <Locale zh="配置此功能" en="Configure" />
      </Button>
    </Link>
  );
}

function EnableButton({ enabled, isLoading, onChange, featureName }) {
  return (
    <Button
      onClick={() => onChange(!enabled)}
      loading={isLoading}
      fz="sm"
      radius="xl"
      px={24}
      py={5}
    >
      {enabled ? (
        <Locale zh={`禁用${featureName}`} en={`Disable ${featureName}`} />
      ) : (
        <Locale zh={`啟用${featureName}`} en={`Enable ${featureName}`} />
      )}
    </Button>
  );
}
