// Chakra imports
import {Box, Flex, useColorModeValue} from "@chakra-ui/react";
import PropTypes from "prop-types";
import React from "react";
import FixedPlugin from "components/fixedPlugin/FixedPlugin";

function AuthIllustration(props) {
  const { children } = props;
  const bgGradient = useColorModeValue(
    "linear(to-br, gray.50, gray.100)",
    "linear(to-br, #0F0A1A, #1A1230, #231B36)"
  );

  return (
    <Flex
      position="relative"
      minH="100vh"
      bgGradient={bgGradient}
      overflow="hidden"
    >
      {/* Decorative glow orbs */}
      <Box
        position="absolute"
        top="-20%"
        left="-10%"
        w={{base: "250px", md: "500px"}}
        h={{base: "250px", md: "500px"}}
        borderRadius="full"
        bg="brand.500"
        filter="blur(180px)"
        opacity="0.15"
        pointerEvents="none"
        display={{base: "none", sm: "block"}}
      />
      <Box
        position="absolute"
        bottom="-15%"
        right="-5%"
        w={{base: "200px", md: "400px"}}
        h={{base: "200px", md: "400px"}}
        borderRadius="full"
        bg="accent.cyan"
        filter="blur(160px)"
        opacity="0.1"
        pointerEvents="none"
        display={{base: "none", sm: "block"}}
      />

      <Flex
        w="100%"
        minH="100vh"
        justifyContent="center"
        alignItems="center"
        px={{ base: "20px", md: "0px" }}
      >
        {children}
      </Flex>
      <FixedPlugin />
    </Flex>
  );
}

AuthIllustration.propTypes = {
  illustrationBackground: PropTypes.string,
  image: PropTypes.any,
};

export default AuthIllustration;
