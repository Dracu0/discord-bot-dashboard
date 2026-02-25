/* eslint-disable */
import React from "react";
import {NavLink, useLocation} from "react-router-dom";
// chakra imports
import {Box, Flex, HStack, Text} from "@chakra-ui/react";
import {useBrandBg, useNoteColor, useTextColor} from "utils/colors";
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

  return routes.map((route, index) =>
      <RouteItem key={index} route={route} />
  )
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

  const locale = useLocale()

  return (
      <NavLink to={path}>
        <HStack spacing={active ? "22px" : "26px"} py="5px">
          <Flex w="100%" alignItems="center" justifyContent="center">
            <Box color={active ? brandColor : inactiveColor} me={2}>
              {icon}
            </Box>

            <Text
                me="auto"
                color={active ? activeColor : inactiveColor}
                fontWeight={active ? "bold" : "normal"}
            >
              {locale(name)}
            </Text>
          </Flex>
          <Box
              h="36px"
              w="4px"
              bg={active ? brandColor : "transparent"}
              borderRadius="5px"
          />
        </HStack>
      </NavLink>
  );
}

export default SidebarLinks;
