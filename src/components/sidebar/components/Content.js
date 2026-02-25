// chakra imports
import {Avatar, Box, Flex, HStack, Icon, Stack, Text, useColorModeValue} from "@chakra-ui/react";
//   Custom components
import Brand from "components/sidebar/components/Brand";
import Links from "components/sidebar/components/Links";
import React, {useContext} from "react";
import {UserDataContext} from "../../../contexts/UserDataContext";
import {avatarToUrl} from "../../../api/discord/DiscordApi";
import {useBrandBg, useTextColor, useNeuInset, useNeuFlat} from "../../../utils/colors";
import {NavLink} from "react-router-dom";
import {IoIosArrowRoundBack} from "react-icons/io";
import {Locale} from "../../../utils/Language";

// FUNCTIONS

function SidebarContent(props) {
  const { routes, width } = props;
  // SIDEBAR
  return (
    <Flex
      w={width}
      direction="column"
      height="100%"
      pt="25px"
      borderRadius="30px"
    >
      <Brand />
      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="16px" pe="12px">
          <Links routes={routes} />
        </Box>
      </Stack>
      <UserPreview />
    </Flex>
  );
}

function UserPreview() {
  const {id, username, avatar} = useContext(UserDataContext)
  const color = useTextColor()
  const neuInset = useNeuInset()
  const cardBg = useColorModeValue("secondaryGray.300", "navy.700")
  const brand = useBrandBg()

  return <Box
      pos="relative"
      m={3}
      p={4}
      borderRadius="20px"
      bg={cardBg}
      boxShadow={neuInset}
  >
    <Box pos="absolute" top={0} left={0} m={3}>
      <NavLink to="../">
        <Icon as={IoIosArrowRoundBack} w="28px" h="28px" color={color} opacity={0.6} _hover={{ opacity: 1 }}/>
      </NavLink>
    </Box>

    <Flex direction="column" align="center" pt={4} gap={2}>
      <Text fontSize="xs" fontWeight="600" color={color} opacity={0.5}
        fontFamily="'Space Grotesk', 'DM Sans', sans-serif"
        textTransform="uppercase"
        letterSpacing="1px"
      >
        <Locale zh="登錄為" en="Logged As"/>
      </Text>

      <Avatar
          size="md"
          name={username}
          src={avatarToUrl(id, avatar)}
          border="2px solid"
          borderColor={brand}
      />
      <Text color={color} fontSize="md" fontWeight="bold">{username}</Text>
    </Flex>
  </Box>
}

export default SidebarContent;
