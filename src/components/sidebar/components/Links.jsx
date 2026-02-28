/* eslint-disable */
import React from "react";
import {NavLink, useLocation} from "react-router-dom";
import {Box, Flex, Group, Text, UnstyledButton} from "@mantine/core";
import {useBrandBg, useNoteColor, useTextColor, useColorValue} from "utils/colors";
import {useLocale} from "utils/Language";
import {IconCircle} from "@tabler/icons-react";

function hasSegment(pathname, segment) {
  const segments = pathname.split('/').filter(Boolean);
  return segments.includes(segment);
}

function endsWithSegment(pathname, segment) {
  const segments = pathname.split('/').filter(Boolean);
  return segments[segments.length - 1] === segment;
}

export function SidebarLinks({ routes }) {
  const locale = useLocale();
  const categoryColor = useNoteColor();

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
      return (
        <Box key={item.key} mt={18} mb={8} px={4}>
          <Text
            fz="xs"
            fw={700}
            ff="'Space Grotesk', 'DM Sans', sans-serif"
            c={categoryColor}
            tt="uppercase"
            style={{ letterSpacing: '1.5px' }}
          >
            {item.label}
          </Text>
        </Box>
      );
    }
    return <RouteItem key={item.key} route={item.route} />;
  });
}

function RouteItem({route}) {
  const location = useLocation();
  const active = endsWithSegment(location.pathname, route.path);
  const includes = hasSegment(location.pathname, route.path);

  return (
      <>
        <Item name={route.name} path={route.path} active={active} icon={<Box me="xs">{route.icon}</Box>} />

        <Flex direction="column" pl="xl">
          {includes && route.items && route.items.map((item, key) => {
            const path = `${route.path}/${item.path}`

            return <Item
                key={key}
                path={path}
                active={hasSegment(location.pathname, item.path)}
                name={item.name}
                icon={<IconCircle size={12} />}
            />
          })}
        </Flex>
      </>
  );
}

function Item({active, name, path, icon}) {
  const activeColor = useTextColor();
  const inactiveColor = useNoteColor();
  const brandColor = useBrandBg();
  const activeBg = useColorValue('var(--mantine-color-gray-1)', 'var(--mantine-color-navy-6)');
  const hoverBg = useColorValue('var(--mantine-color-gray-0)', 'var(--mantine-color-navy-5)');
  const locale = useLocale();

  return (
      <NavLink to={path} style={{ textDecoration: 'none' }}>
        <UnstyledButton
          py={5}
          px={4}
          my={2}
          w="100%"
          style={{
            borderRadius: 14,
            background: active ? activeBg : 'transparent',
            transition: 'all 0.2s ease',
          }}
          styles={{
            root: {
              '&:hover': {
                background: active ? activeBg : hoverBg,
                transform: active ? 'none' : 'translateX(2px)',
              },
            },
          }}
        >
          <Group gap={active ? 22 : 26} wrap="nowrap">
            <Flex w="100%" align="center" justify="center">
              <Box c={active ? brandColor : inactiveColor} me="xs">
                {icon}
              </Box>
              <Text
                  style={{ flex: 1 }}
                  c={active ? activeColor : inactiveColor}
                  fw={active ? 'bold' : 'normal'}
                  ff="'Space Grotesk', 'DM Sans', sans-serif"
                  fz="sm"
              >
                {locale(name)}
              </Text>
            </Flex>
            <Box
                h={36}
                w={4}
                bg={active ? brandColor : 'transparent'}
                style={{ borderRadius: 5, transition: 'all 0.2s ease' }}
            />
          </Group>
        </UnstyledButton>
      </NavLink>
  );
}

export default SidebarLinks;
