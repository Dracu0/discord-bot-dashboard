import React from "react";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "../src/components/ui/tooltip";

import "../src/assets/css/App.css";

/** @type { import('storybook').Preview } */
export default {
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <TooltipProvider>
          <Story />
        </TooltipProvider>
      </ThemeProvider>
    ),
  ],
  parameters: {
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0c1222" },
        { name: "light", value: "#f8fafc" },
      ],
    },
  },
};
