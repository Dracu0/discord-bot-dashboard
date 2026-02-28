import React from "react";
import { Box, Drawer, Flex, ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu2 } from "@tabler/icons-react";
import Content from "components/sidebar/components/Content";
import { useCardBg, useColorValue } from "../../utils/colors";

function Sidebar({ routes }) {
  const sidebarBg = useCardBg();
  const borderColor = useColorValue('var(--mantine-color-gray-3)', 'rgba(139,92,246,0.12)');

  return (
    <Box visibleFrom="xl" pos="fixed" mih="100%" style={{ zIndex: 20 }}>
      <Box
        bg={sidebarBg}
        w={300}
        h="100vh"
        mih="100%"
        style={{
          overflowX: 'hidden',
          border: `1px solid ${borderColor}`,
          borderRadius: '0 20px 20px 0',
          transition: '0.2s linear',
        }}
      >
        <Box style={{ overflowY: 'auto', height: '100%' }}>
          <Content w="100%" routes={routes} />
        </Box>
      </Box>
    </Box>
  );
}

export function SidebarResponsive({ routes }) {
  const sidebarBg = useCardBg();
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Flex hiddenFrom="xl" align="center">
      <ActionIcon variant="subtle" color="gray" onClick={open} size="lg">
        <IconMenu2 size={20} />
      </ActionIcon>

      <Drawer
        opened={opened}
        onClose={close}
        position="left"
        size={285}
        styles={{ body: { padding: 0 } }}
        withCloseButton
      >
        <Box bg={sidebarBg}>
          <Content routes={routes} />
        </Box>
      </Drawer>
    </Flex>
  );
}

export default Sidebar;
