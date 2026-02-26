import {mode} from "@chakra-ui/theme-tools";
import {neuLight, neuDark} from "../additions/neumorphic";

export const inputStyles = {
    components: {
        Input: {
            baseStyle: {
                field: {
                    fontWeight: 400,
                    borderRadius: "12px",
                },
            },

            variants: {
                main: (props) => ({
                    field: {
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
                    },
                }),
                auth: (props) => ({
                    field: {
                        fontWeight: "500",
                        color: mode("navy.700", "white")(props),
                        bg: mode("secondaryGray.300", "navy.700")(props),
                        border: "1px solid",
                        borderColor: mode(
                            "rgba(255,255,255,0.5)",
                            "rgba(139,92,246,0.15)"
                        )(props),
                        borderRadius: "16px",
                        boxShadow: mode(neuLight.inset, neuDark.inset)(props),
                        _placeholder: {color: "secondaryGray.500", fontWeight: "400"},
                        _focus: {
                            boxShadow: mode(
                                `${neuLight.inset}, 0 0 0 2px rgba(124, 58, 237, 0.3)`,
                                `${neuDark.inset}, 0 0 0 2px rgba(139, 92, 246, 0.4)`
                            )(props),
                            borderColor: mode("brand.300", "brand.400")(props),
                        },
                    },
                }),
                authSecondary: (props) => ({
                    field: {
                        bg: "transparent",
                        border: "1px solid",
                        borderColor: "secondaryGray.100",
                        borderRadius: "16px",
                        _placeholder: {color: "secondaryGray.600"},
                    },
                }),
                search: (props) => ({
                    field: {
                        border: "none",
                        py: "11px",
                        borderRadius: "inherit",
                        _placeholder: {color: "secondaryGray.500"},
                    },
                }),
            },
        },
        NumberInput: {
            baseStyle: {
                field: {
                    fontWeight: 400,
                },
            },

            variants: {
                main: (props) => ({
                    field: {
                        bg: mode("secondaryGray.300", "navy.700")(props),
                        border: "1px solid",
                        borderColor: mode("rgba(255,255,255,0.5)", "rgba(139,92,246,0.1)")(props),
                        borderRadius: "16px",
                        boxShadow: mode(neuLight.inset, neuDark.inset)(props),
                        _placeholder: {color: "secondaryGray.500"},
                        _focus: {
                            boxShadow: mode(
                                `${neuLight.inset}, 0 0 0 2px rgba(124, 58, 237, 0.3)`,
                                `${neuDark.inset}, 0 0 0 2px rgba(139, 92, 246, 0.4)`
                            )(props),
                            borderColor: mode("brand.300", "brand.400")(props),
                        },
                    },
                }),
                auth: (props) => ({
                    field: {
                        bg: "transparent",
                        border: "1px solid",

                        borderColor: "secondaryGray.100",
                        borderRadius: "16px",
                        _placeholder: {color: "secondaryGray.600"},
                    },
                }),
                authSecondary: (props) => ({
                    field: {
                        bg: "transparent",
                        border: "1px solid",

                        borderColor: "secondaryGray.100",
                        borderRadius: "16px",
                        _placeholder: {color: "secondaryGray.600"},
                    },
                }),
                search: (props) => ({
                    field: {
                        border: "none",
                        py: "11px",
                        borderRadius: "inherit",
                        _placeholder: {color: "secondaryGray.600"},
                    },
                }),
            },
        },
        Select: {
            baseStyle: {
                field: {
                    fontWeight: 400,
                },
            },

            variants: {
                main: (props) => ({
                    field: {
                        bg: mode("transparent", "navy.800")(props),
                        border: "1px solid",
                        color: "secondaryGray.600",
                        borderColor: mode("secondaryGray.100", "whiteAlpha.100")(props),
                        borderRadius: "16px",
                        _placeholder: {color: "secondaryGray.600"},
                    },
                    icon: {
                        color: "secondaryGray.600",
                    },
                }),
                mini: (props) => ({
                    field: {
                        bg: mode("transparent", "navy.800")(props),
                        border: "0px solid transparent",
                        fontSize: "0px",
                        p: "10px",
                        _placeholder: {color: "secondaryGray.600"},
                    },
                    icon: {
                        color: "secondaryGray.600",
                    },
                }),
                subtle: (props) => ({
                    box: {
                        width: "unset",
                    },
                    field: {
                        bg: "transparent",
                        border: "0px solid",
                        color: "secondaryGray.600",
                        borderColor: "transparent",
                        width: "max-content",
                        _placeholder: {color: "secondaryGray.600"},
                    },
                    icon: {
                        color: "secondaryGray.600",
                    },
                }),
                transparent: (props) => ({
                    field: {
                        bg: "transparent",
                        border: "0px solid",
                        width: "min-content",
                        color: mode("secondaryGray.600", "secondaryGray.600")(props),
                        borderColor: "transparent",
                        padding: "0px",
                        paddingLeft: "8px",
                        paddingRight: "20px",
                        fontWeight: "700",
                        fontSize: "14px",
                        _placeholder: {color: "secondaryGray.600"},
                    },
                    icon: {
                        transform: "none !important",
                        position: "unset !important",
                        width: "unset",
                        color: "secondaryGray.600",
                        right: "0px",
                    },
                }),
                auth: (props) => ({
                    field: {
                        bg: "transparent",
                        border: "1px solid",

                        borderColor: "secondaryGray.100",
                        borderRadius: "16px",
                        _placeholder: {color: "secondaryGray.600"},
                    },
                }),
                authSecondary: (props) => ({
                    field: {
                        bg: "transparent",
                        border: "1px solid",

                        borderColor: "secondaryGray.100",
                        borderRadius: "16px",
                        _placeholder: {color: "secondaryGray.600"},
                    },
                }),
                search: (props) => ({
                    field: {
                        border: "none",
                        py: "11px",
                        borderRadius: "inherit",
                        _placeholder: {color: "secondaryGray.600"},
                    },
                }),
            },
        },
        // PinInputField: {
        //   variants: {
        //     main: (props) => ({
        //       field: {
        //         bg: "red !important",
        //         border: "1px solid",
        //         color: mode("secondaryGray.900", "white")(props),
        //         borderColor: mode("secondaryGray.100", "whiteAlpha.100")(props),
        //         borderRadius: "16px",
        //         _placeholder: { color: "secondaryGray.600" },
        //       },
        //     }),
        //   },
        // },
    },
};
