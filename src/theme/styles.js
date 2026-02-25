import {mode} from "@chakra-ui/theme-tools";

export const globalStyles = {
  colors: {
    brand: {
      50: "#F3EEFF",
      100: "#E0D4FF",
      200: "#C5ADFF",
      300: "#A47AFF",
      400: "#8B5CF6",
      500: "#7C3AED",
      600: "#6D28D9",
      700: "#5B21B6",
      800: "#4C1D95",
      900: "#3B0F7A",
    },
    brandScheme: {
      100: "#E0D4FF",
      200: "#C5ADFF",
      300: "#A47AFF",
      400: "#8B5CF6",
      500: "#7C3AED",
      600: "#6D28D9",
      700: "#5B21B6",
      800: "#4C1D95",
      900: "#3B0F7A",
    },
    brandTabs: {
      100: "#E0D4FF",
      200: "#C5ADFF",
      300: "#A47AFF",
      400: "#8B5CF6",
      500: "#7C3AED",
      600: "#6D28D9",
      700: "#5B21B6",
      800: "#4C1D95",
      900: "#3B0F7A",
    },
    secondaryGray: {
      100: "#E5DFF0",
      200: "#D8D0E8",
      300: "#F0ECF7",
      400: "#E0D9ED",
      500: "#9B8FB5",
      600: "#A89DC0",
      700: "#7E72A0",
      800: "#6A5E8A",
      900: "#2D2150",
    },
    red: {
      100: "#FEF0F0",
      500: "#EE5D50",
      600: "#E31A1A",
    },
    blue: {
      50: "#F0EDFC",
      500: "#6366F1",
    },
    orange: {
      100: "#FFF8E0",
      500: "#FBBF24",
    },
    green: {
      100: "#ECFDF5",
      300: "#6EE7B7",
      500: "#10B981",
    },
    navy: {
      50: "#d4ccf0",
      100: "#b3a5e0",
      200: "#9580d0",
      300: "#7B61C2",
      400: "#4C3A8A",
      500: "#3A2A6E",
      600: "#352560",
      700: "#2A2043",
      800: "#231B36",
      900: "#1A1230",
    },
    gray: {
      100: "#FAF8FE",
    },
    accent: {
      cyan: "#22D3EE",
      pink: "#F472B6",
      gold: "#FBBF24",
    },
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        overflowX: "hidden",
        bg: mode("secondaryGray.300", "navy.900")(props),
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "-0.3px",
      },
      input: {
        color: "gray.700",
      },
      html: {
        fontFamily: "'DM Sans', sans-serif",
        scrollBehavior: "smooth",
      },
      "h1, h2, h3, h4, h5, h6": {
        fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
      },
      "*:focus-visible": {
        outline: "2px solid",
        outlineColor: mode("brand.500", "brand.400")(props),
        outlineOffset: "2px",
        borderRadius: "4px",
      },
      ".skip-to-content": {
        position: "absolute",
        top: "-100px",
        left: "16px",
        bg: "brand.500",
        color: "white",
        px: "16px",
        py: "8px",
        borderRadius: "8px",
        zIndex: 9999,  /* skip-to-content must be topmost */
        fontWeight: "600",
        transition: "top 0.2s ease",
        _focus: {
          top: "16px",
        },
      },
      "::-webkit-scrollbar": {
        width: "10px",
        borderRadius: "8px",
        backgroundColor: "transparent",
      },
      "::-webkit-scrollbar-thumb": {
        width: "6px",
        borderRadius: "8px",
        backgroundColor: mode(
          "rgba(124, 58, 237, 0.15)",
          "rgba(139, 92, 246, 0.2)"
        )(props),
      },
      "::-webkit-scrollbar-thumb:hover": {
        backgroundColor: mode(
          "rgba(124, 58, 237, 0.3)",
          "rgba(139, 92, 246, 0.35)"
        )(props),
      },
    }),
  },
};
