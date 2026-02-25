import React from "react";

// Chakra imports
import {Button, Flex, Link, Text} from "@chakra-ui/react";

export default function Banner({image, title, description, clip = true, children}) {
    return (
        <Flex
            direction="column"
            bgImage={image}
            bgGradient={!image && "linear(135deg, brand.600 0%, brand.500 40%, accent.cyan 100%)"}
            bgSize="cover"
            py={{base: "30px", md: "56px"}}
            px={{base: "30px", md: "64px"}}
            borderRadius="24px"
            position="relative"
            overflow="hidden"
            _before={{
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bg: image ? "blackAlpha.400" : "transparent",
                borderRadius: "24px",
                zIndex: 0,
            }}
        >
            <Text
                fontSize={{ base: "24px", md: "34px" }}
                color="white"
                mb="14px"
                maxW={clip && {
                    base: "100%",
                    md: "64%",
                    lg: "46%",
                    xl: "70%",
                    "2xl": "50%",
                    "3xl": "42%",
                }}
                fontWeight="700"
                fontFamily="'Space Grotesk', sans-serif"
                letterSpacing="-0.02em"
                lineHeight={{base: "32px", md: "42px"}}
                position="relative"
                zIndex={1}
            >
                {title}
            </Text>
            <Text
                fontSize="md"
                color="white"
                opacity="0.85"
                maxW={clip && {
                    base: "100%",
                    md: "64%",
                    lg: "40%",
                    xl: "56%",
                    "2xl": "46%",
                    "3xl": "34%",
                }}
                fontWeight="500"
                mb="40px"
                lineHeight="28px"
                position="relative"
                zIndex={1}
            >
                {description}
            </Text>
            <Flex align="center" justify="start" gap={5} position="relative" zIndex={1}>
                {children}
            </Flex>
        </Flex>
  );
}

export function BannerButton({url, ...props}) {
    return <Link href={url}>
        <Button
            variant="white"
            {...props}
        />
    </Link>
}