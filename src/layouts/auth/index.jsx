import React from "react";
import SignIn from "views/auth/signIn";
import { Box } from "@mantine/core";
import { useSurfaceBg } from "../../utils/colors";

export default function Auth() {
  const authBg = useSurfaceBg();
  document.documentElement.dir = "ltr";
  return (
    <Box
      bg={authBg}
      mih="100vh"
      pos="relative"
      w="100%"
      style={{ transition: "all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)" }}
    >
      <SignIn />
    </Box>
  );
}
