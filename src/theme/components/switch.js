import { mode } from "@chakra-ui/theme-tools";
import { neuLight, neuDark } from "../additions/neumorphic";

export const switchStyles = {
  components: {
    Switch: {
      baseStyle: {
        thumb: {
          fontWeight: 400,
          borderRadius: "50%",
          w: "16px",
          h: "16px",
          _checked: { transform: "translate(20px, 0px)" },
        },
        track: {
          display: "flex",
          alignItems: "center",
          boxSizing: "border-box",
          w: "40px",
          h: "20px",
          p: "2px",
          ps: "2px",
          _focus: {
            boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.4)",
          },
        },
      },

      variants: {
        main: (props) => ({
          track: {
            bg: mode("secondaryGray.400", "navy.700")(props),
            boxShadow: mode(neuLight.inset, neuDark.inset)(props),
            borderRadius: "12px",
            _checked: {
              bg: mode("brand.500", "brand.400")(props),
              boxShadow: mode(
                `${neuLight.flat}, 0 0 8px rgba(124, 58, 237, 0.3)`,
                `${neuDark.flat}, 0 0 8px rgba(139, 92, 246, 0.35)`
              )(props),
            },
          },
          thumb: {
            bg: "white",
            boxShadow: mode(neuLight.flat, neuDark.flat)(props),
          },
        }),
      },
    },
  },
};
