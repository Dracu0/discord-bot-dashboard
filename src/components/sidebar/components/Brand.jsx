import React, { useContext } from "react";
import { Avatar, Flex, Group, Skeleton, Text, Divider } from "@mantine/core";
import { GuildContext } from "contexts/guild/GuildContext";
import { iconToUrl, useGuild } from "api/discord/DiscordApi";
import { config } from "../../../config/config";
import { useTextColor, useBrandBg, useColorValue } from "../../../utils/colors";

export function SidebarBrand() {
  const logoColor = useTextColor();
  const brandColor = useBrandBg();
  const { id } = useContext(GuildContext);

  return (
    <Flex align="center" direction="column" gap="md">
      {id != null ? (
        <GuildHeader id={id} logoColor={logoColor} />
      ) : (
        <Flex align="center" direction="column" gap="xs" my={20}>
          <Text
            fw={800}
            fz="xl"
            c={brandColor}
            ff="'Space Grotesk', 'DM Sans', sans-serif"
            style={{ letterSpacing: '-0.5px' }}
          >
            {config.name}
          </Text>
          <Text fz="xs" c={logoColor} fw={500} opacity={0.6}>
            Dashboard
          </Text>
        </Flex>
      )}
      <Divider w="80%" mb={20} />
    </Flex>
  );
}

function GuildHeader({ id, logoColor }) {
  const query = useGuild(id);
  const brandColor = useBrandBg();
  const subtleBg = useColorValue('var(--mantine-color-gray-1)', 'var(--mantine-color-navy-6)');

  return query.isLoading ? (
    <Skeleton w="80%" h={80} radius="xl" />
  ) : (
    <Flex direction="column" align="center" gap="xs" mt="xs">
      <Text
        fw={800}
        fz="xs"
        c={brandColor}
        ff="'Space Grotesk', 'DM Sans', sans-serif"
        style={{ letterSpacing: '1px', textTransform: 'uppercase' }}
      >
        {config.name}
      </Text>
      <Group
        align="center"
        px="md"
        py="xs"
        style={{ borderRadius: 16, background: subtleBg }}
      >
        <Avatar
          name={query.data.name}
          src={iconToUrl(query.data.id, query.data.icon)}
          size="sm"
          radius="xl"
        />
        <Text fw="bold" fz="lg" c={logoColor}>
          {query.data.name}
        </Text>
      </Group>
    </Flex>
  );
}

export default SidebarBrand;
