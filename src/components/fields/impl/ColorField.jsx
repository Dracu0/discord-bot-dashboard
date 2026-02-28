import { HexColorPicker } from "react-colorful";
import { Box, Flex } from "@mantine/core";

export default function ColorField({ value, onChange }) {
  const color = value || "#aabbcc";

  return (
    <Flex direction={{ base: "column", md: "row" }} gap={40}>
      <Box mih={{ base: 150, md: 200 }} style={{ flex: 1, background: color, borderRadius: 8 }} />
      <Box w={{ base: "100%", md: 300 }} maw={{ md: "50%" }}>
        <HexColorPicker style={{ width: "100%" }} color={color} onChange={onChange} />
      </Box>
    </Flex>
  );
}