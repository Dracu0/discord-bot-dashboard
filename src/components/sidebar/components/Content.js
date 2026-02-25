// chakra imports
import {Box, Flex, HStack, Icon, IconButton, Stack, Text, useColorModeValue} from "@chakra-ui/react";
//   Custom components
import Brand from "components/sidebar/components/Brand";
import Links from "components/sidebar/components/Links";
import React from "react";
import {useNavigate} from "react-router-dom";
import {IoArrowBack} from "react-icons/io5";
import {useTextColor, useNeuFlat} from "../../../utils/colors";
import {Locale} from "../../../utils/Language";

// FUNCTIONS

function SidebarContent(props) {
  const { routes, width } = props;
  const navigate = useNavigate();
  const textColor = useTextColor();
  const neuFlat = useNeuFlat();
  const hoverBg = useColorModeValue("secondaryGray.300", "navy.700");

  return (
    <Flex
      w={width}
      direction="column"
      height="100%"
      pt="16px"
      borderRadius="30px"
    >
      <HStack px="20px" mb="8px">
        <IconButton
          icon={<Icon as={IoArrowBack} w="18px" h="18px" />}
          aria-label="Back to servers"
          size="sm"
          variant="ghost"
          color={textColor}
          opacity={0.6}
          borderRadius="12px"
          boxShadow={neuFlat}
          _hover={{ opacity: 1, bg: hoverBg }}
          onClick={() => navigate("/admin")}
        />
        <Text fontSize="xs" color={textColor} opacity={0.5} fontWeight="600">
          <Locale zh="返回" en="Back" />
        </Text>
      </HStack>
      <Brand />
      <Stack direction="column" mb="auto" mt="8px">
        <Box ps="16px" pe="12px">
          <Links routes={routes} />
        </Box>
      </Stack>
    </Flex>
  );
}

export default SidebarContent;
