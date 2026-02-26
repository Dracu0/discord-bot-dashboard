import { mode } from "@chakra-ui/theme-tools";
import { neuLight, neuDark } from "../neumorphic";

const Card = {
  baseStyle: (props) => ({
    p: "16px",
    display: "flex",
    flexDirection: "column",
    width: "100%",
    position: "relative",
    borderRadius: "20px",
    minWidth: "0px",
    wordWrap: "break-word",
    bg: mode("#ffffff", "navy.800")(props),
    backgroundClip: "border-box",
    boxShadow: mode(neuLight.raised, neuDark.raised)(props),
    border: "1px solid",
    borderColor: mode("rgba(255,255,255,0.6)", "rgba(139,92,246,0.12)")(props),
    transition: "box-shadow 0.25s ease, border-color 0.25s ease, transform 0.25s ease",
  }),
};

export const CardComponent = {
  components: {
    Card,
  },
};
