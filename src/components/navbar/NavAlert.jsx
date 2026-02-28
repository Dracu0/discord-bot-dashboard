import React, { useEffect, useState } from "react";
import { Box, Breadcrumbs, Flex, Text, Anchor } from "@mantine/core";
import { useAlertBg, useCardBg, useDetailColor, useTextColor, useBrandBg, useColorValue } from "../../utils/colors";
import { contentWidth } from "../../utils/layout-tokens";

export default function NavAlert({ rootText, childText, children, clip = true }) {
    const mainText = useTextColor();
    const secondaryText = useDetailColor();
    const navbarBg = useAlertBg();
    const menuBg = useCardBg();
    const brandAccent = useBrandBg();
    const margin = "5vw";
    const clipMargin = { base: 12, md: 30, lg: 30, xl: 30 };
    const borderColor = useColorValue('var(--mantine-color-gray-3)', 'rgba(139,92,246,0.12)');

    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const breadcrumbItems = [];
    breadcrumbItems.push(
        <Text key="root" c={brandAccent} fw={600} fz="sm">{rootText}</Text>
    );
    if (Array.isArray(childText)) {
        childText.forEach((text, i) =>
            breadcrumbItems.push(<Text key={i} c={secondaryText} fz="sm">{text}</Text>)
        );
    } else {
        breadcrumbItems.push(<Text key="child" c={secondaryText} fz="sm">{childText}</Text>);
    }

    return (
        <Box
            style={{
                zIndex: 30,
                position: 'fixed',
                backdropFilter: 'blur(32px) saturate(180%)',
                borderRadius: 20,
                border: `1.5px solid ${scrolled ? borderColor : 'transparent'}`,
                transition: 'box-shadow 0.3s ease, background 0.3s ease, border-color 0.3s ease',
                lineHeight: '25.6px',
            }}
            bg={navbarBg}
            mih={64}
            mx="auto"
            pb={8}
            px={{ base: 15, md: 10 }}
            ps={{ xl: 12 }}
            pt={8}
            left={clip ? undefined : margin}
            right={clip ? clipMargin : margin}
            top={{ base: 12, md: 16 }}
            w={clip ? contentWidth : undefined}
        >
            <Flex
                w="100%"
                direction={{ base: "column", md: "row" }}
                align={{ xl: "center" }}
            >
                <Box mb={{ base: 8, md: 0 }}>
                    <Breadcrumbs separator="/" fz="sm" mb={5}>
                        {breadcrumbItems}
                    </Breadcrumbs>
                    <Text
                        c={mainText}
                        fw="bold"
                        fz={{ base: 24, md: 34 }}
                        ff="'Space Grotesk', sans-serif"
                        style={{ letterSpacing: '-0.02em' }}
                    >
                        {Array.isArray(childText) ? childText[childText.length - 1] : childText}
                    </Text>
                </Box>
                <Flex
                    ms="auto"
                    w={{ base: '100%', md: 'auto' }}
                    align="center"
                    direction="row"
                    bg={menuBg}
                    p={10}
                    style={{
                        borderRadius: 20,
                        border: `1px solid ${borderColor}`,
                        overflow: 'visible',
                    }}
                >
                    {children}
                </Flex>
            </Flex>
        </Box>
    );
}