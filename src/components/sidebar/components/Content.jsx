import { Box, Flex, Group, ActionIcon, Stack, Text, Tooltip } from "@mantine/core";
import Brand from "components/sidebar/components/Brand";
import Links from "components/sidebar/components/Links";
import React from "react";
import { useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import { Locale } from "../../../utils/Language";

function SidebarContent({ routes, collapsed, onNavigate }) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/admin");
    onNavigate?.();
  };

  return (
    <Flex direction="column" h="100%" pt={16}>
      <Group px={collapsed ? 0 : 20} mb={8} justify={collapsed ? "center" : "flex-start"}>
        <Tooltip label="Back to servers" position="right" disabled={!collapsed}>
          <ActionIcon
            variant="subtle"
            color="gray"
            radius="xl"
            size="sm"
            onClick={handleBack}
            aria-label="Back to servers"
          >
            <IconArrowLeft size={18} />
          </ActionIcon>
        </Tooltip>
        {!collapsed && (
          <Text fz="xs" c="var(--text-muted)" fw={600}>
            <Locale zh="返回" en="Back" />
          </Text>
        )}
      </Group>
      <Brand collapsed={collapsed} />
      <Stack mt={8} mb="auto">
        <Box ps={collapsed ? 8 : 16} pe={collapsed ? 8 : 12}>
          <Links routes={routes} collapsed={collapsed} onNavigate={onNavigate} />
        </Box>
      </Stack>
    </Flex>
  );
}

export default SidebarContent;
