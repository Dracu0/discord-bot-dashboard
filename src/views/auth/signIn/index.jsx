import React from "react";
// Chakra imports
import { Box, Button, Flex, Heading, Icon, Text, useColorModeValue } from "@chakra-ui/react";
// Custom components
import DefaultAuth from "layouts/auth/Default";
// Assets
import illustration from "assets/img/auth/Banner.jpg";
import { FaDiscord } from "react-icons/fa";
import { config } from "config/config";
import { Locale } from "../../../utils/Language";
import { useDetailColor, useNeuRaised, useTextColor } from "../../../utils/colors";

function SignIn({ loading = false }) {

  const textColor = useTextColor();
  const textColorSecondary = useDetailColor();
  const neuShadow = useNeuRaised();
  const cardBg = useColorModeValue("white", "navy.800");
  const brandGradient = "linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #22D3EE 100%)";

  const onSignIn = () => {
    window.location.href = `${config.serverUrl}/auth/discord`
  };

  return (
    <DefaultAuth illustrationBackground={illustration} image={illustration}>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        maxW="480px"
        w="100%"
      >
        {/* Brand Logo */}
        <Text
          fontSize="48px"
          fontWeight="800"
          fontFamily="'Space Grotesk', sans-serif"
          bgGradient={brandGradient}
          bgClip="text"
          letterSpacing="-0.03em"
          mb="8px"
        >
          Mocotron
        </Text>

        {/* Neumorphic Card */}
        <Box
          w="100%"
          bg={cardBg}
          borderRadius="20px"
          boxShadow={neuShadow}
          border="1px solid"
          borderColor={useColorModeValue(
            "rgba(255,255,255,0.6)",
            "rgba(139, 92, 246, 0.12)"
          )}
          p={{ base: "32px", md: "48px" }}
          mt="24px"
          transition="box-shadow 0.4s ease"
          _hover={{
            boxShadow: `${neuShadow}, 0 0 32px rgba(139, 92, 246, 0.15)`,
          }}
        >
          <Heading
            color={textColor}
            fontSize={{ base: "26px", md: "32px" }}
            fontFamily="'Space Grotesk', sans-serif"
            mb="12px"
          >
            <Locale zh="歡迎回來" en="Welcome Back" />
          </Heading>
          <Text
            mb="32px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="md"
            lineHeight="1.6"
          >
            <Locale zh="讓你的創意社群更上一層樓" en="Empower Your Creative Community" />
          </Text>

          <Button
            variant="brand"
            w="100%"
            h="56px"
            fontSize="lg"
            fontWeight="700"
            onClick={onSignIn}
            isLoading={loading}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "0 0 24px rgba(139, 92, 246, 0.4)",
            }}
            transition="all 0.2s ease"
          >
            <Icon as={FaDiscord} w="22px" h="22px" me="10px" />
            <Locale zh="Discord 登入" en="Login with Discord" />
          </Button>

          <Text
            mt="24px"
            color={textColorSecondary}
            fontWeight="400"
            fontSize="13px"
            opacity={0.7}
          >
            <Locale zh="您的所有個人信息都將被保密" en="Your data stays private and secure" />
          </Text>
        </Box>
      </Flex>
    </DefaultAuth>
  );
}

export default SignIn;