import { Box, Flex, Switch, Text } from "@mantine/core";
import React from "react";
import { useColorValue } from "../../../utils/colors";

export default function Default(props) {
  const { id, label, isChecked, onChange, reversed, ...rest } = props;
  const textColorPrimary = useColorValue("var(--mantine-color-dark-7)", "white");
  const brandColor = useColorValue("var(--mantine-color-brand-5)", "var(--mantine-color-brand-3)");
  const labelColor = isChecked ? brandColor : textColorPrimary;

  return (
    <Box w="100%" fw={500} {...rest}>
      <Flex
        direction={reversed ? "row-reverse" : "row"}
        align="center"
        justify={reversed ? "start" : "space-between"}
        gap="md"
      >
        <label htmlFor={id} style={{ cursor: "pointer", maxWidth: "75%", marginBottom: 0 }}>
          <Text ta="start" c={labelColor} fz="md" fw={500} style={{ transition: "color 0.2s ease" }}>
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
