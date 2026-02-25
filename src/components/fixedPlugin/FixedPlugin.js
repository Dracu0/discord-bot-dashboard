// Chakra Imports
import { Button, Icon, useColorMode } from "@chakra-ui/react";
// Custom Icons
import { IoMdMoon, IoMdSunny } from "react-icons/io";
import React from "react";

export default function FixedPlugin(props) {
  const { ...rest } = props;
  const { colorMode, toggleColorMode } = useColorMode();
  let bgButton = "linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #22D3EE 100%)";

  return (
    <Button
      {...rest}
      h='56px'
      w='56px'
      bg={bgButton}
      zIndex='50'
      position='fixed'
      variant='no-effects'
      left={document.documentElement.dir === "rtl" ? "35px" : ""}
      right={document.documentElement.dir === "rtl" ? "" : "35px"}
      bottom='30px'
      border='1px solid'
      borderColor='rgba(139, 92, 246, 0.3)'
      borderRadius='50px'
      onClick={toggleColorMode}
      display='flex'
      p='0px'
      align='center'
      justify='center'
      boxShadow='0 4px 24px rgba(124, 58, 237, 0.4)'
      _hover={{
        transform: "scale(1.1)",
        boxShadow: "0 6px 32px rgba(124, 58, 237, 0.5)",
      }}
      transition="all 0.25s ease"
    >
      <Icon
        h='22px'
        w='22px'
        color='white'
        as={colorMode === "light" ? IoMdMoon : IoMdSunny}
      />
    </Button>
  );
}
