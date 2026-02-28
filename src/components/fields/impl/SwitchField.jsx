import { Box, Flex, Switch, Text } from "@mantine/core";
import React from "react";

export default function Default(props) {
  const { id, label, isChecked, onChange, reversed, ...rest } = props;

  return (
    <Box w="100%" fw={500} {...rest}>
      <Flex
        direction={reversed ? "row-reverse" : "row"}
        align="center"
        justify={reversed ? "start" : "space-between"}
        gap="md"
      >
        <label htmlFor={id} style={{ cursor: "pointer", maxWidth: "75%", marginBottom: 0 }}>
          <Text
            ta="start"
            c={isChecked ? "var(--accent-primary)" : "var(--text-primary)"}
            fz="md"
            fw={500}
            style={{ transition: "color 0.2s ease" }}
          >
            {label}
          </Text>
        </label>
        <Switch
          checked={isChecked}
          id={id}
          size="md"
          onChange={onChange}
          color="brand"
        />
      </Flex>
    </Box>
  );
}
