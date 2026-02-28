import { Box, Flex } from "@mantine/core";
import { OptionField } from "../OptionPanel";

export default function PairField({ element, value, onChange }) {
  const [first, second] = value || [];

  return (
    <Flex direction={{ base: "column", sm: "row" }} gap="sm">
      <Box w="fit-content">
        <OptionField
          option={element.first}
          value={first}
          onChange={(v) => onChange([v, second])}
        />
      </Box>
      <Box w="100%">
        <OptionField
          option={element.second}
          value={second}
          onChange={(v) => onChange([first, v])}
        />
      </Box>
    </Flex>
  );
}