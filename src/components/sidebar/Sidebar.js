import React from "react";

// chakra imports
import {
    Box,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerOverlay,
    Flex,
    Icon,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import Content from "components/sidebar/components/Content";
import {renderThumb, renderTrack, renderView,} from "components/scrollbar/Scrollbar";
import {Scrollbars} from "react-custom-scrollbars-2";
import PropTypes from "prop-types";

// Assets
import {IoMenuOutline} from "react-icons/io5";
import {useCardBg, useNeuRaised} from "../../utils/colors";

function Sidebar({ routes }) {

  let variantChange = "0.2s linear";
  const neuShadow = useNeuRaised();
  // Chakra Color Mode
  let sidebarBg = useCardBg();
  const borderColor = useColorModeValue("rgba(255,255,255,0.6)", "rgba(139,92,246,0.08)");

  // SIDEBAR
  return (
    <Box display={{ base: "none", xl: "block" }} position="fixed" minH="100%" zIndex={20}>
      <Box
        bg={sidebarBg}
        transition={variantChange}
        w="300px"
        h="100vh"
        minH="100%"
        overflowX="hidden"
        boxShadow={neuShadow}
        border="1px solid"
        borderColor={borderColor}
        borderRadius="0 24px 24px 0"
      >
        <Scrollbars
          autoHide
          renderTrackVertical={renderTrack}
          renderThumbVertical={renderThumb}
          renderView={renderView}
        >
          <Content width="100%" routes={routes} />
        </Scrollbars>
      </Box>
    </Box>
  );
}

// FUNCTIONS
export function SidebarResponsive(props) {
  let sidebarBackgroundColor = useCardBg();
  let menuColor = useColorModeValue("gray.400", "white");
  // // SIDEBAR
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();

  const { routes } = props;
  // let isWindows = navigator.platform.startsWith("Win");
  //  BRAND

  return (
    <Flex display={{ sm: "flex", xl: "none" }} alignItems="center">
      <Flex ref={btnRef} w="max-content" h="max-content" onClick={onOpen}>
        <Icon
          as={IoMenuOutline}
          color={menuColor}
          my="auto"
          w="20px"
          h="20px"
          me="10px"
          _hover={{ cursor: "pointer" }}
        />
      </Flex>

      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={document.documentElement.dir === "rtl" ? "right" : "left"}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent w="285px" bg={sidebarBackgroundColor}>
          <DrawerCloseButton
            zIndex="3"
            onClose={onClose}
            _focus={{ boxShadow: "none" }}
            _hover={{ boxShadow: "none" }}
          />
          <DrawerBody p={0}>
            <Content routes={routes} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
}
// PROPS

Sidebar.propTypes = {
  logoText: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object),
  variant: PropTypes.string,
};

export default Sidebar;
