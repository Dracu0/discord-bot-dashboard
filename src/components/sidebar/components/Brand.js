import React, {useContext} from "react";

// Chakra imports
import {Avatar, Flex, HStack, Skeleton, Text, useColorModeValue} from "@chakra-ui/react";

// Custom components
import {HSeparator} from "components/separator/Separator";
import {GuildContext} from "contexts/guild/GuildContext";
import {iconToUrl, useGuild} from "api/discord/DiscordApi";
import {config} from "../../../config/config";
import {useTextColor, useBrandBg} from "../../../utils/colors";

export function SidebarBrand() {
  let logoColor = useTextColor()
  const brandColor = useBrandBg()
  const {id} = useContext(GuildContext)

  return (
    <Flex align="center" direction="column" gap={5}>
        {
            id != null? (
                <GuildHeader id={id} logoColor={logoColor} />
            ) : (
                <Flex align="center" direction="column" gap={2} my="20px">
                  <Text
                    fontWeight="800"
                    fontSize="xl"
                    color={brandColor}
                    fontFamily="'Space Grotesk', 'DM Sans', sans-serif"
                    letterSpacing="-0.5px"
                  >
                    {config.name}
                  </Text>
                  <Text
                    fontSize="xs"
                    color={logoColor}
                    fontWeight="500"
                    opacity={0.6}
                  >
                    Dashboard
                  </Text>
                </Flex>
            )
        }
      <HSeparator mb="20px" />
    </Flex>
  );
}

function GuildHeader({id, logoColor}) {
  const query = useGuild(id)
  const brandColor = useBrandBg()
  const subtleBg = useColorModeValue("secondaryGray.300", "navy.700")

  return query.isLoading?
      <Skeleton w="80%" h="5rem" rounded="xl" />
      :
      <Flex direction="column" align="center" gap={2} mt={2}>
        <Text
          fontWeight="800"
          fontSize="xs"
          color={brandColor}
          fontFamily="'Space Grotesk', 'DM Sans', sans-serif"
          letterSpacing="1px"
          textTransform="uppercase"
        >
          {config.name}
        </Text>
        <HStack
          align="center"
          px={4}
          py={2}
          borderRadius="16px"
          bg={subtleBg}
        >
          <Avatar
            name={query.data.name}
            src={iconToUrl(query.data.id, query.data.icon)}
            size="sm"
          />
          <Text fontWeight="bold" fontSize="lg" color={logoColor}>
            {query.data.name}
          </Text>
        </HStack>
      </Flex>
}

export default SidebarBrand;
