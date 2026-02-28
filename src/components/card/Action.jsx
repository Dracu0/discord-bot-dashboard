import React, { useContext } from "react";
import { Box, Button, Flex, Group, Image, Text } from "@mantine/core";
import Card from "components/card/Card";
import { Link } from "react-router-dom";
import { GuildContext } from "contexts/guild/GuildContext";
import { Locale, useLocale } from "../../utils/Language";
import { useDetailColor, useTextColor, useColorValue } from "../../utils/colors";

export function Action({ id, action }) {
  const { id: serverId } = useContext(GuildContext);
  const configUrl = `/guild/${serverId}/actions/${id}`;
  const locale = useLocale();

  const textColor = useTextColor();
  const detailColor = useDetailColor();

  return (
    <Card
      p={{ base: 16, md: 20 }}
      style={{ transition: "all 0.25s ease" }}
    >
      <Flex direction="column" gap="sm">
        {action.banner ? (
          <Image h={{ base: "4rem", md: "5rem" }} fit="cover" radius={16} src={action.banner} />
        ) : (
          <Box
            h={{ base: "4rem", md: "5rem" }}
            style={{
              borderRadius: 16,
              background: "linear-gradient(135deg, var(--mantine-color-brand-6) 0%, var(--mantine-color-pink-5) 50%, var(--mantine-color-yellow-5) 100%)",
            }}
          />
        )}
        <Text
          c={textColor}
          fz={{ base: "xl", md: "lg" }}
          fw="bold"
          ff="'Space Grotesk', sans-serif"
        >
          {locale(action.name)}
        </Text>
        <Text c={detailColor} fz="md" mb="md">
          {action.description}
        </Text>
        <Group>
          <Link to={configUrl}>
            <Button px={40} variant="filled" color="brand">
              <Locale zh="打開" en="Open" />
            </Button>
          </Link>
        </Group>
      </Flex>
    </Card>
  );
}