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
            py={{base: "16px", md: "24px"}}
            px={{base: "20px", md: "32px"}}
            borderRadius="16px"
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
                borderRadius: "16px",
                zIndex: 0,
            }}
        >
            <Flex align="center" justify="space-between" wrap="wrap" gap={3} position="relative" zIndex={1}>
                <Flex direction="column" flex="1" minW="0">
                    <Text
                        fontSize={{ base: "18px", md: "22px" }}
                        color="white"
                        maxW={clip && {
                            base: "100%",
                            md: "80%",
                        }}
                        fontWeight="700"
                        fontFamily="'Space Grotesk', sans-serif"
                        letterSpacing="-0.02em"
                        lineHeight={{base: "24px", md: "28px"}}
                    >
                        {title}
                    </Text>
                    {description && (
                        <Text
                            fontSize="sm"
                            color="white"
                            opacity="0.85"
                            maxW={clip && {
                                base: "100%",
                                md: "75%",
                            }}
                            fontWeight="500"
                            mt="4px"
                            lineHeight="20px"
                            noOfLines={2}
                        >
                            {description}
                        </Text>
                    )}
                </Flex>
                <Flex align="center" gap={2} flexShrink={0}>
                    {children}
                </Flex>
            </Flex>
        </Flex>
  );
}

export function BannerButton({url, ...props}) {
    return <Link href={url}>
        <Button
            variant="white"
            size="sm"
            minH="40px"
            {...props}
        />
    </Link>
}