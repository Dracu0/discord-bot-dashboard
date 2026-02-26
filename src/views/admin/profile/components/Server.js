// Chakra imports
import {Avatar, Button, Flex, Stack, Text, useColorModeValue} from "@chakra-ui/react";
// Custom components
import {Link} from "react-router-dom";
import Card from "components/card/Card.js";
import React from "react";
// Assets
import {iconToUrl} from "api/discord/DiscordApi";
import {Locale} from "utils/Language";
import {useCardBg, useNeuHover, useTextColor} from "../../../../utils/colors";

export default function Server({ server, ...rest }) {
  const { name, id, icon } = server;

  const textColorPrimary = useTextColor();
  const bg = useCardBg();
  const hoverBorder = useColorModeValue("brand.200", "brand.600");
  const neuHover = useNeuHover();

  return (
    <Card
      bg={bg}
      {...rest}
      p="14px"
      transition="all 0.25s ease"
      cursor="pointer"
      _hover={{
        transform: "translateY(-3px)",
        borderColor: hoverBorder,
        boxShadow: neuHover,
      }}
      border="1px solid"
      borderColor="transparent"
    >
      <Flex align="center" direction={{ base: "column", md: "row" }}>
        <Avatar
          h="140px"
          w="140px"
          src={icon && iconToUrl(id, icon)}
          name={name}
          bg={icon && "transparent"}
          borderRadius="16px"
          me="20px"
          loading="lazy"
        />
        <Stack
          mt={{ base: "10px", md: "0" }}
          alignItems={{ base: "center", md: "start" }}
        >
          <Text
            color={textColorPrimary}
            fontWeight="600"
            fontSize="2xl"
            mb="4px"
            fontFamily="'Space Grotesk', sans-serif"
          >
            {name}
          </Text>
          {server.exist? <ConfigButton server={server} /> : <InviteButton />}
        </Stack>
      </Flex>
    </Card>
  );
}

function InviteButton() {
  const url = "/invite";

  return <Link to={url} target="_blank">
    <Button fontWeight="500" variant={"outline"} fontSize="md">
      <Locale zh="邀請到服務器" en="Invite to Server" />
    </Button>
  </Link>
}

function ConfigButton({server}) {
  const url = `/guild/${server.id}`;

  return <Link to={url}>
    <Button fontWeight="500" variant="brand" fontSize="md">
      <Locale zh="配置服務器" en="Customize" />
    </Button>
  </Link>
}
