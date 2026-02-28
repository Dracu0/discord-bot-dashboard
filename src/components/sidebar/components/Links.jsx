import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Box, Flex, Text, Tooltip, UnstyledButton } from "@mantine/core";
import { useLocale } from "utils/Language";
import { IconCircle } from "@tabler/icons-react";

function hasSegment(pathname, segment) {
  const segments = pathname.split("/").filter(Boolean);
  return segments.includes(segment);
}

function endsWithSegment(pathname, segment) {
  const segments = pathname.split("/").filter(Boolean);
  return segments[segments.length - 1] === segment;
}

export function SidebarLinks({ routes, collapsed, onNavigate }) {
  const locale = useLocale();

  const grouped = [];
  let lastCategory = null;

  routes.forEach((route, index) => {
    const cat = route.category ? locale(route.category) : null;
    if (cat && cat !== lastCategory) {
      grouped.push({ type: "category", label: cat, key: `cat-${index}` });
      lastCategory = cat;
    }
    grouped.push({ type: "route", route, key: `route-${index}` });
  });

  return grouped.map((item) => {
    if (item.type === "category") {
      if (collapsed) return null;
      return (
        <Box key={item.key} mt={18} mb={8} px={4}>
          <Text
            fz={11}
            fw={700}
            ff="'Space Grotesk', 'DM Sans', sans-serif"
            c="var(--text-muted)"
            tt="uppercase"
            style={{ letterSpacing: "1.5px" }}
          >
            {item.label}
          </Text>
        </Box>
      );
    }
    return (
      <RouteItem
        key={item.key}
        route={item.route}
        collapsed={collapsed}
        onNavigate={onNavigate}
      />
    );
  });
}

function RouteItem({ route, collapsed, onNavigate }) {
  const location = useLocation();
  const active = endsWithSegment(location.pathname, route.path);
  const includes = hasSegment(location.pathname, route.path);

  return (
    <>
      <Item
        name={route.name}
        path={route.path}
        active={active}
        icon={route.icon}
        collapsed={collapsed}
        onNavigate={onNavigate}
      />

      {!collapsed && (
        <Flex direction="column" pl="xl">
          {includes &&
            route.items &&
            route.items.map((item, key) => {
              const path = `${route.path}/${item.path}`;
              return (
                <Item
                  key={key}
                  path={path}
                  active={hasSegment(location.pathname, item.path)}
                  name={item.name}
                  icon={<IconCircle size={8} />}
                  collapsed={false}
                  onNavigate={onNavigate}
                />
              );
            })}
        </Flex>
      )}
    </>
  );
}

function Item({ active, name, path, icon, collapsed, onNavigate }) {
  const locale = useLocale();
  const label = locale(name);

  const button = (
    <UnstyledButton
      py={collapsed ? 10 : 6}
      px={collapsed ? 0 : 10}
      my={2}
      w="100%"
      onClick={onNavigate}
      style={{
        borderRadius: "var(--radius-md)",
        background: active ? "var(--sidebar-active)" : "transparent",
        transition: "all 0.2s ease",
        display: "flex",
        justifyContent: collapsed ? "center" : "flex-start",
        alignItems: "center",
      }}
      styles={{
        root: {
          "&:hover": {
            background: active ? "var(--sidebar-active)" : "var(--sidebar-hover)",
          },
        },
      }}
    >
      <Flex align="center" gap={collapsed ? 0 : 10} justify={collapsed ? "center" : "flex-start"} w="100%">
        <Box
          c={active ? "var(--accent-primary)" : "var(--text-muted)"}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            width: collapsed ? 24 : 20,
          }}
        >
          {icon}
        </Box>
        {!collapsed && (
          <Text
            style={{ flex: 1 }}
            c={active ? "var(--text-primary)" : "var(--text-secondary)"}
            fw={active ? 600 : 400}
            ff="'Space Grotesk', 'DM Sans', sans-serif"
            fz="sm"
            truncate
          >
            {label}
          </Text>
        )}
        {!collapsed && active && (
          <Box
            w={4}
            h={20}
            style={{
              borderRadius: 4,
              background: "var(--accent-primary)",
              flexShrink: 0,
            }}
          />
        )}
      </Flex>
    </UnstyledButton>
  );

  return (
    <NavLink to={path} style={{ textDecoration: "none" }}>
      {collapsed ? (
        <Tooltip label={label} position="right" withArrow>
          {button}
        </Tooltip>
      ) : (
        button
      )}
    </NavLink>
  );
}

export default SidebarLinks;
