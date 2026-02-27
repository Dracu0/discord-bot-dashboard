import { mode } from "@chakra-ui/theme-tools";
import { neuLight, neuDark } from "../additions/neumorphic";

export const buttonStyles = {
  components: {
    Button: {
      baseStyle: {
        borderRadius: "16px",
        boxShadow: "none",
        transition: "all 0.2s ease",
        boxSizing: "border-box",
        fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
        fontWeight: "600",
        _focus: {
          boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.4)",
        },
        _active: {
          boxShadow: "none",
          transform: "scale(0.97)",
        },
      },
      variants: {
        white: (props) => ({
          bg: mode("white", "navy.700")(props),
          color: mode("navy.800", "white")(props),
          boxShadow: mode(neuLight.flat, neuDark.flat)(props),
          _hover: {
            boxShadow: mode(neuLight.raised, neuDark.raised)(props),
            transform: "translateY(-1px)",
          },
          _active: {
            boxShadow: mode(neuLight.pressed, neuDark.pressed)(props),
            transform: "translateY(0)",
          },
          fontWeight: "500",
          fontSize: "14px",
          py: "14px",
          px: "27",
        }),
        outline: () => ({
          borderRadius: "16px",
        }),
        brand: (props) => ({
          bg: mode("brand.500", "brand.400")(props),
          color: "white",
          boxShadow: mode(
            `${neuLight.flat}, 0 0 16px rgba(124, 58, 237, 0.2)`,
            `${neuDark.flat}, 0 0 16px rgba(139, 92, 246, 0.25)`
          )(props),
          _focus: {
            bg: mode("brand.500", "brand.400")(props),
            boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.5)",
          },
          _active: {
            bg: mode("brand.600", "brand.500")(props),
            boxShadow: mode(neuLight.pressed, neuDark.pressed)(props),
            transform: "translateY(0)",
          },
          _hover: {
            bg: mode("brand.600", "brand.300")(props),
            boxShadow: mode(
              `${neuLight.raised}, 0 0 20px rgba(124, 58, 237, 0.3)`,
              `${neuDark.raised}, 0 0 20px rgba(139, 92, 246, 0.35)`
            )(props),
            transform: "translateY(-1px)",
          },
        }),
        darkBrand: (props) => ({
          bg: mode("brand.800", "brand.400")(props),
          color: "white",
          boxShadow: mode(neuLight.flat, neuDark.flat)(props),
          _focus: {
            bg: mode("brand.800", "brand.400")(props),
          },
          _active: {
            bg: mode("brand.900", "brand.500")(props),
            boxShadow: mode(neuLight.pressed, neuDark.pressed)(props),
          },
          _hover: {
            bg: mode("brand.700", "brand.300")(props),
            boxShadow: mode(neuLight.raised, neuDark.raised)(props),
            transform: "translateY(-1px)",
          },
        }),
        lightBrand: (props) => ({
          bg: mode("brand.50", "whiteAlpha.100")(props),
          color: mode("brand.500", "white")(props),
          boxShadow: mode(neuLight.flat, neuDark.flat)(props),
          _focus: {
            bg: mode("brand.50", "whiteAlpha.100")(props),
          },
          _active: {
            bg: mode("brand.100", "whiteAlpha.200")(props),
            boxShadow: mode(neuLight.pressed, neuDark.pressed)(props),
          },
          _hover: {
            bg: mode("brand.100", "whiteAlpha.200")(props),
            boxShadow: mode(neuLight.raised, neuDark.raised)(props),
            transform: "translateY(-1px)",
          },
        }),
        light: (props) => ({
          bg: mode("secondaryGray.300", "whiteAlpha.100")(props),
          color: mode("secondaryGray.900", "white")(props),
          boxShadow: mode(neuLight.flat, neuDark.flat)(props),
          _focus: {
            bg: mode("secondaryGray.300", "whiteAlpha.100")(props),
          },
          _active: {
            bg: mode("secondaryGray.400", "whiteAlpha.200")(props),
            boxShadow: mode(neuLight.pressed, neuDark.pressed)(props),
          },
          _hover: {
            bg: mode("secondaryGray.400", "whiteAlpha.200")(props),
            boxShadow: mode(neuLight.raised, neuDark.raised)(props),
            transform: "translateY(-1px)",
          },
        }),
        action: (props) => ({
          fontWeight: "500",
          borderRadius: "50px",
          bg: mode("secondaryGray.300", "brand.400")(props),
          color: mode("brand.500", "white")(props),
          boxShadow: mode(neuLight.flat, neuDark.flat)(props),
          _focus: {
            bg: mode("secondaryGray.300", "brand.400")(props),
          },
          _active: {
            bg: mode("secondaryGray.400", "brand.500")(props),
            boxShadow: mode(neuLight.pressed, neuDark.pressed)(props),
          },
          _hover: {
            bg: mode("secondaryGray.200", "brand.300")(props),
            boxShadow: mode(neuLight.raised, neuDark.raised)(props),
            transform: "translateY(-1px)",
          },
        }),
        danger: (props) => ({
          bg: mode("red.500", "red.500")(props),
          color: "white",
          boxShadow: mode(neuLight.flat, neuDark.flat)(props),
          _focus: {
            bg: mode("red.500", "red.500")(props),
            boxShadow: "0 0 0 2px rgba(238, 93, 80, 0.4)",
          },
          _active: {
            bg: mode("red.600", "red.600")(props),
            boxShadow: mode(neuLight.pressed, neuDark.pressed)(props),
          },
          _hover: {
            bg: mode("red.600", "red.600")(props),
            boxShadow: mode(
              `${neuLight.raised}, 0 0 16px rgba(238, 93, 80, 0.2)`,
              `${neuDark.raised}, 0 0 16px rgba(238, 93, 80, 0.25)`
            )(props),
            transform: "translateY(-1px)",
          },
        }),
        setup: (props) => ({
          fontWeight: "500",
          borderRadius: "50px",
          bg: mode("transparent", "brand.400")(props),
          border: mode("1px solid", "0px solid")(props),
          borderColor: mode("secondaryGray.400", "transparent")(props),
          color: mode("secondaryGray.900", "white")(props),
          _focus: {
            bg: mode("transparent", "brand.400")(props),
          },
          _active: { bg: mode("transparent", "brand.400")(props) },
          _hover: {
            bg: mode("secondaryGray.100", "brand.300")(props),
            transform: "translateY(-1px)",
          },
        }),
      },
    },
  },
};
