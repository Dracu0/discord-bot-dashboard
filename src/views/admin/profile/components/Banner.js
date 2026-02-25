// Chakra imports
import {Avatar, Box, Flex, Text, useColorModeValue} from "@chakra-ui/react";
import Card from "components/card/Card.js";
import React from "react";
import {config} from "../../../../config/config";
import {Locale} from "../../../../utils/Language";
import {useDetailColor, useTextColor} from "../../../../utils/colors";

export default function Banner(props) {
  const { banner, avatar, name, joinedServers, servers } = props;
  const textColorPrimary = useTextColor();
  const textColorSecondary = useDetailColor();
  const borderColor = useColorModeValue(
    "white !important",
    "navy.800 !important"
  );

  return (
    <Card mb={{ base: "0px", lg: "20px" }} align="center">
      <Box
        bgGradient="linear(135deg, brand.500 0%, brand.400 50%, accent.cyan 100%)"
        bg={banner && `url(${banner})`}
        bgPosition="center"
        bgSize="cover"
        borderRadius="20px"
        h="140px"
        w="100%"
      />
      <Avatar
        mx="auto"
        src={avatar}
        h="90px"
        w="90px"
        mt="-45px"
        border="4px solid"
        borderColor={borderColor}
        boxShadow="0 4px 20px rgba(139, 92, 246, 0.3)"
      />
      <Text
        color={textColorPrimary}
        fontWeight="bold"
        fontSize="xl"
        mt="12px"
        fontFamily="'Space Grotesk', sans-serif"
      >
        {name}
      </Text>
      <Text color={textColorSecondary} fontSize="sm">
        <Locale zh="歡迎回到" en="Welcome back to" /> {config.name}
      </Text>
      <Flex w="max-content" mx="auto" mt="26px" flexWrap="wrap" gap={8}>
          {
              joinedServers && <Flex align="center" direction="column">
                  <Text
                    color="brand.400"
                    fontSize="2xl"
                    fontWeight="700"
                    fontFamily="'Space Grotesk', sans-serif"
                  >
                      {joinedServers}
                  </Text>
                  <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
                      <Locale zh="已加入的服務器" en="Joined Servers" />
                  </Text>
              </Flex>
          }
          {
              servers && <Flex align="center" direction="column">
                  <Text
                    color="brand.400"
                    fontSize="2xl"
                    fontWeight="700"
                    fontFamily="'Space Grotesk', sans-serif"
                  >
                      {servers}
                  </Text>
                  <Text color={textColorSecondary} fontSize="sm" fontWeight="400">
                      <Locale zh="您擁有的服務器" en="Total Servers" />
                  </Text>
              </Flex>
          }
      </Flex>
    </Card>
  );
}
