import { Box, Flex, Group, ActionIcon, Stack, Text } from "@mantine/core";
import Brand from "components/sidebar/components/Brand";
import Links from "components/sidebar/components/Links";
import React from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import { useTextColor, useColorValue } from "../../../utils/colors";
import { Locale } from "../../../utils/Language";

function SidebarContent({ routes, width }) {
  const navigate = useNavigate();
  const textColor = useTextColor();
  const hoverBg = useColorValue('var(--mantine-color-gray-1)', 'var(--mantine-color-navy-6)');

  return (
    <Flex w={width} direction="column" h="100%" pt={16} style={{ borderRadius: 30 }}>
      <Group px={20} mb={8}>
        <ActionIcon
          variant="subtle"
          color="gray"
          radius="xl"
          size="sm"
          onClick={() => navigate("/admin")}
          aria-label="Back to servers"
        >
          <IconArrowLeft size={18} />
        </ActionIcon>
        <Text fz="xs" c={textColor} fw={600} opacity={0.5}>
          <Locale zh="返回" en="Back" />
        </Text>
      </Group>
      <Brand />
      <Stack mt={8} mb="auto">
        <Box ps={16} pe={12}>
          <Links routes={routes} />
        </Box>
      </Stack>
    </Flex>
  );
}

export default SidebarContent;
