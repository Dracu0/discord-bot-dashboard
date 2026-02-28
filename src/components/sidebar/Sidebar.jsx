import React, { useContext } from "react";
import { Box, Drawer, Flex, ActionIcon, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconMenu2, IconChevronsLeft, IconChevronsRight } from "@tabler/icons-react";
import Content from "components/sidebar/components/Content";
import { SettingsContext } from "../../contexts/SettingsContext";
import { SIDEBAR_FULL, SIDEBAR_COLLAPSED } from "../../utils/layout-tokens";

function Sidebar({ routes }) {
  const { sidebarCollapsed, updateSettings } = useContext(SettingsContext);
  const width = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_FULL;

  const toggle = () => updateSettings({ sidebarCollapsed: !sidebarCollapsed });

  return (
    <Box visibleFrom="xl" pos="fixed" mih="100%" style={{ zIndex: 20 }}>
      <Box
        w={width}
        h="100vh"
        mih="100%"
        style={{
          overflowX: "hidden",
          background: "var(--sidebar-bg)",
          borderRight: "1px solid var(--sidebar-border)",
          transition: "width 0.25s cubic-bezier(.4,0,.2,1)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box style={{ overflowY: "auto", flex: 1 }}>
          <Content routes={routes} collapsed={sidebarCollapsed} />
        </Box>

        {/* Collapse toggle */}
        <Flex justify="center" py="sm" style={{ borderTop: "1px solid var(--sidebar-border)" }}>
          <Tooltip label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"} position="right">
            <ActionIcon
              variant="subtle"
              color="gray"
              radius="xl"
              size="md"
              onClick={toggle}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!sidebarCollapsed}
            >
              {sidebarCollapsed ? <IconChevronsRight size={18} /> : <IconChevronsLeft size={18} />}
            </ActionIcon>
          </Tooltip>
        </Flex>
      </Box>
    </Box>
  );
}

export function SidebarResponsive({ routes }) {
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
        size={SIDEBAR_FULL}
        styles={{
          body: { padding: 0, background: "var(--sidebar-bg)" },
          header: { background: "var(--sidebar-bg)" },
        }}
        withCloseButton
      >
        <Content routes={routes} collapsed={false} onNavigate={close} />
      </Drawer>
    </Flex>
  );
}

export default Sidebar;
