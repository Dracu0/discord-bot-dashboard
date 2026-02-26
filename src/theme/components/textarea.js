import {mode} from "@chakra-ui/theme-tools";
import {neuLight, neuDark} from "../additions/neumorphic";

export const textareaStyles = {
    components: {
        Textarea: {
            baseStyle: {
                    fontWeight: 400,
                    borderRadius: "12px",
            },

            variants: {
                main: (props) => ({
                    bg: mode("secondaryGray.300", "navy.700")(props),
                    border: "1px solid",
                    color: mode("secondaryGray.900", "white")(props),
                    borderColor: mode("rgba(255,255,255,0.5)", "rgba(139,92,246,0.1)")(props),
                    borderRadius: "16px",
                    fontSize: "sm",
                    p: "16px",
                    boxShadow: mode(neuLight.inset, neuDark.inset)(props),
                    _placeholder: {color: "secondaryGray.500"},
                    _focus: {
                        boxShadow: mode(
                            `${neuLight.inset}, 0 0 0 2px rgba(124, 58, 237, 0.3)`,
                            `${neuDark.inset}, 0 0 0 2px rgba(139, 92, 246, 0.4)`
                        )(props),
                        borderColor: mode("brand.300", "brand.400")(props),
                    },
                }),
                auth: (props) => ({
                    bg: mode("secondaryGray.300", "navy.700")(props),
                    border: "1px solid",
                    borderColor: mode("rgba(255,255,255,0.5)", "rgba(139,92,246,0.1)")(props),
                    borderRadius: "16px",
                    boxShadow: mode(neuLight.inset, neuDark.inset)(props),
                    _placeholder: {color: "secondaryGray.500"},
                }),
                authSecondary: (props) => ({
                    bg: mode("secondaryGray.300", "navy.700")(props),
                    border: "1px solid",
                    borderColor: mode("rgba(255,255,255,0.5)", "rgba(139,92,246,0.1)")(props),
                    borderRadius: "16px",
                    boxShadow: mode(neuLight.inset, neuDark.inset)(props),
                    _placeholder: {color: "secondaryGray.500"},
                }),
                search: (props) => ({
                    border: "none",
                    py: "11px",
                    borderRadius: "inherit",
                    _placeholder: {color: "secondaryGray.500"},
                }),
            },
        },
    },
};
