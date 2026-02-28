import { Box, Flex, Text } from "@mantine/core";
import Card from "components/card/Card";
import React from "react";
import { useDetailColor, useTextColor } from "../../../utils/colors";

export default function Default(props) {
  const { startContent, endContent, name, value } = props;
  const textColor = useTextColor();
  const textColorSecondary = useDetailColor();

  return (
    <Card py={15}>
      <Flex
        my="auto"
        h="100%"
        align={{ base: "center", xl: "start" }}
        justify={{ base: "center", xl: "center" }}
      >
        {startContent}

        <Box my="auto" ms={startContent ? 18 : 0}>
          <Text lh={1} c={textColorSecondary} fz="sm" fw={500}>
            {name}
          </Text>
          <Text c={textColor} fz="2xl" ff="'Space Grotesk', sans-serif" fw={700}>
            {value}
          </Text>
        </Box>
        <Flex ms="auto" w="max-content">
          {endContent}
        </Flex>
      </Flex>
    </Card>
  );
}
