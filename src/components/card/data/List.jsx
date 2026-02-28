import { Flex, Text } from "@mantine/core";
import Card from "components/card/Card";
import React from "react";

export function List({ title, description, icon, items }) {
  return (
    <Card p={0}>
      <Flex direction="column" w="100%" px={22} py={18}>
        <Text c="var(--text-primary)" fz="xl" fw={600}>
          {title}
        </Text>
        <Text c="var(--text-secondary)">{description}</Text>
      </Flex>
      {items.map((item, key) => (
        <ListItem key={key} icon={icon} {...item} />
      ))}
    </Card>
  );
}

function ListItem({ name, description, value, icon: IconComp }) {
  return (
    <Card
      p={0}
      px={24}
      py={21}
      radius={0}
      withBorder={false}
      style={{ background: "transparent", transition: "0.2s linear" }}
    >
      <Flex direction="column" justify="center">
        <Flex pos="relative" align="center">
          <Flex direction="column" w={{ base: "70%", md: "100%" }} me={{ base: 4, md: 16, xl: 24 }}>
            <Text c="var(--text-primary)" fz="md" mb={5} fw="bold" me={14}>
              {name}
            </Text>
            <Text c="var(--text-muted)" fz="sm" fw={400} me={14}>
              {description}
            </Text>
          </Flex>
          <Flex me={{ base: 4, md: 16, xl: 24 }} align="center">
            {IconComp && <IconComp size={18} color="var(--text-primary)" style={{ marginRight: 7 }} />}
            <Text fw={700} fz="md" c="var(--text-primary)">
              {value}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
}