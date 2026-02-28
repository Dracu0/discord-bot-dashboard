import React from "react";
import { MantineProvider } from "@mantine/core";
import { theme } from "../src/theme/theme";

import "@mantine/core/styles.css";
import "../src/assets/css/App.css";

/** @type { import('storybook').Preview } */
export default {
  decorators: [
    (Story) => (
      <MantineProvider theme={theme} defaultColorScheme="dark">
        <Story />
      </MantineProvider>
    ),
  ],
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#1a1b2e" },
        { name: "light", value: "#f5f5f5" },
      ],
    },
  },
};
