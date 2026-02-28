import { Box, Flex } from "@mantine/core";
import React from "react";
import FixedPlugin from "components/fixedPlugin/FixedPlugin";

function AuthIllustration({ children }) {
  return (
    <Flex pos="relative" mih="100vh" bg="var(--surface-primary)" style={{ overflow: 'hidden' }}>
      {/* Decorative glow orbs */}
      <Box
        pos="absolute"
        top="-20%"
        left="-10%"
        w={{ base: 250, md: 500 }}
        h={{ base: 250, md: 500 }}
        style={{
          borderRadius: '50%',
          background: 'var(--mantine-color-brand-5)',
          filter: 'blur(180px)',
          opacity: 0.15,
          pointerEvents: 'none',
        }}
        visibleFrom="sm"
      />
      <Box
        pos="absolute"
        bottom="-15%"
        right="-5%"
        w={{ base: 200, md: 400 }}
        h={{ base: 200, md: 400 }}
        style={{
          borderRadius: '50%',
          background: '#22D3EE',
          filter: 'blur(160px)',
          opacity: 0.1,
          pointerEvents: 'none',
        }}
        visibleFrom="sm"
      />

      <Flex w="100%" mih="100vh" justify="center" align="center" px={{ base: 20, md: 0 }}>
        {children}
      </Flex>
      <FixedPlugin />
    </Flex>
  );
}

export default AuthIllustration;
