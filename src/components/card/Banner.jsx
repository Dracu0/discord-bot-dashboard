import React from "react";
import { Anchor, Button, Flex, Text } from "@mantine/core";

export default function Banner({ image, title, description, clip = true, children }) {
  return (
    <Flex
      direction="column"
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        background: !image
          ? "linear-gradient(135deg, var(--mantine-color-brand-6) 0%, var(--mantine-color-brand-5) 40%, var(--mantine-color-cyan-5) 100%)"
          : undefined,
        backgroundSize: "cover",
        borderRadius: 16,
        position: "relative",
        overflow: "hidden",
      }}
      py={{ base: 16, md: 24 }}
      px={{ base: 20, md: 32 }}
    >
      {image && (
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.4)",
            borderRadius: 16,
            zIndex: 0,
          }}
        />
      )}
      <Flex align="center" justify="space-between" wrap="wrap" gap="sm" style={{ position: "relative", zIndex: 1 }}>
        <Flex direction="column" style={{ flex: 1, minWidth: 0 }}>
          <Text
            fz={{ base: 18, md: 22 }}
            c="white"
            maw={clip ? { base: "100%", md: "80%" } : undefined}
            fw={700}
            ff="'Space Grotesk', sans-serif"
            lts="-0.02em"
            lh={{ base: "24px", md: "28px" }}
          >
            {title}
          </Text>
          {description && (
            <Text
              fz="sm"
              c="white"
              opacity={0.85}
              maw={clip ? { base: "100%", md: "75%" } : undefined}
              fw={500}
              mt={4}
              lh="20px"
              lineClamp={2}
            >
              {description}
            </Text>
          )}
        </Flex>
        <Flex align="center" gap="xs" style={{ flexShrink: 0 }}>
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
}

export function BannerButton({ url, ...props }) {
  return (
    <Anchor href={url} underline="never">
      <Button variant="white" size="sm" miw={40} {...props} />
    </Anchor>
  );
}