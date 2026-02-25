/* eslint-disable */
import React from "react";
import {NavLink, useLocation} from "react-router-dom";
// chakra imports
import {Box, Flex, HStack, Text, useColorModeValue} from "@chakra-ui/react";
import {useBrandBg, useNoteColor, useTextColor, useNeuInset, useNeuFlat} from "utils/colors";
import {useLocale} from "utils/Language";
import {CgShapeCircle} from "react-icons/cg";

/**
 * Check if a path segment appears in the pathname as a proper segment
 * (not as a substring of another segment)
 */
function hasSegment(pathname, segment) {
  const segments = pathname.split('/').filter(Boolean);
  return segments.includes(segment);
}

/**
 * Check if the current path exactly ends with the given segment
 * (the last non-empty segment matches)
 */
function endsWithSegment(pathname, segment) {
  const segments = pathname.split('/').filter(Boolean);
  return segments[segments.length - 1] === segment;
}

export function SidebarLinks({ routes }) {
  const locale = useLocale();
  const categoryColor = useNoteColor();

  // Group routes by category
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
        <Box key={item.key} mt="18px" mb="8px" px="4px">
          <Text
            fontSize="xs"
            fontWeight="700"
            fontFamily="'Space Grotesk', 'DM Sans', sans-serif"
            color={categoryColor}
            textTransform="uppercase"
            letterSpacing="1.5px"
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
        <Item name={route.name} path={route.path} active={active} icon={<Box me={2}>{route.icon}</Box>} />

        <Flex direction="column" pl={7}>
          {includes && route.items && route.items.map((item, key) => {
            const path = `${route.path}/${item.path}`

            return <Item
                key={key}
                path={path}
                active={hasSegment(location.pathname, item.path)}
                name={item.name}
                icon={<CgShapeCircle />}
            />
          })}
        </Flex>
      </>
  );
}

function Item({active, name, path, icon}) {
  let activeColor = useTextColor();
  let inactiveColor = useNoteColor()
  let brandColor = useBrandBg();
  const neuInset = useNeuInset();
  const neuFlat = useNeuFlat();
  const activeBg = useColorModeValue("secondaryGray.300", "navy.700");

  const locale = useLocale()

  return (
      <NavLink to={path}>
        <HStack
          spacing={active ? "22px" : "26px"}
          py="5px"
          px="4px"
          my="2px"
          borderRadius="14px"
          bg={active ? activeBg : "transparent"}
          boxShadow={active ? neuInset : "none"}
          transition="all 0.2s ease"
          _hover={{
            bg: active ? activeBg : useColorModeValue("secondaryGray.200", "navy.600"),
            transform: active ? "none" : "translateX(2px)",
          }}
        >
          <Flex w="100%" alignItems="center" justifyContent="center">
            <Box color={active ? brandColor : inactiveColor} me={2}>
              {icon}
            </Box>

            <Text
                me="auto"
                color={active ? activeColor : inactiveColor}
                fontWeight={active ? "bold" : "normal"}
                fontFamily="'Space Grotesk', 'DM Sans', sans-serif"
                fontSize="sm"
            >
              {locale(name)}
            </Text>
          </Flex>
          <Box
              h="36px"
              w="4px"
              bg={active ? brandColor : "transparent"}
              borderRadius="5px"
              transition="all 0.2s ease"
          />
        </HStack>
      </NavLink>
  );
}

export default SidebarLinks;
