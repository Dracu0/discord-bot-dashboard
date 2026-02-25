import { mode } from "@chakra-ui/theme-tools";
import { neuLight, neuDark } from "../additions/neumorphic";

export const badgeStyles = {
  components: {
    Badge: {
      baseStyle: {
        borderRadius: "12px",
        lineHeight: "100%",
        padding: "7px",
        paddingLeft: "12px",
        paddingRight: "12px",
        fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
        fontWeight: "600",
        letterSpacing: "0.3px",
      },
      variants: {
        outline: () => ({
          borderRadius: "16px",
        }),
        brand: (props) => ({
          bg: mode("brand.500", "brand.400")(props),
          color: "white",
          boxShadow: mode(
            `${neuLight.flat}, 0 0 10px rgba(124, 58, 237, 0.15)`,
            `${neuDark.flat}, 0 0 10px rgba(139, 92, 246, 0.2)`
          )(props),
          _focus: {
            bg: mode("brand.500", "brand.400")(props),
          },
          _active: {
            bg: mode("brand.500", "brand.400")(props),
          },
          _hover: {
            bg: mode("brand.600", "brand.300")(props),
          },
        }),
      },
    },
  },
};
