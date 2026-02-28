import React from "react";
import SignIn from "views/auth/signIn";
import { Box } from "@mantine/core";

export default function Auth() {
  document.documentElement.dir = "ltr";
  return (
    <Box
      bg="var(--surface-primary)"
      mih="100vh"
      pos="relative"
      w="100%"
      style={{ transition: "all 0.25s cubic-bezier(.4,0,.2,1)" }}
    >
      <SignIn />
    </Box>
  );
}
