import { mode } from "@chakra-ui/theme-tools";
import { neuLight, neuDark } from "../neumorphic";

const Card = {
  baseStyle: (props) => ({
    p: "20px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative",
    borderRadius: "24px",
    minWidth: "0px",
    wordWrap: "break-word",
    bg: mode("#ffffff", "navy.800")(props),
    backgroundClip: "border-box",
    boxShadow: mode(neuLight.raised, neuDark.raised)(props),
    border: "1px solid",
    borderColor: mode("rgba(255,255,255,0.6)", "rgba(139,92,246,0.08)")(props),
    transition: "all 0.25s ease",
    _hover: {
      transform: "translateY(-2px)",
      boxShadow: mode(
        "8px 8px 18px #d1cbe0, -8px -8px 18px #ffffff",
        "8px 8px 18px #0e0a19, -8px -8px 18px #342a52"
      )(props),
    },
  }),
};

export const CardComponent = {
  components: {
    Card,
  },
};
