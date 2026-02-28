import React, { useContext, useEffect, useState } from "react";
import { Box, Breadcrumbs, Flex, Text } from "@mantine/core";
import { SettingsContext } from "../../contexts/SettingsContext";
import { contentWidth, contentWidthCollapsed } from "../../utils/layout-tokens";

export default function NavAlert({ rootText, childText, children, clip = true }) {
    const { sidebarCollapsed } = useContext(SettingsContext);
    const width = sidebarCollapsed ? contentWidthCollapsed : contentWidth;
    const margin = "5vw";
    const clipMargin = { base: 12, md: 30, lg: 30, xl: 30 };

    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const breadcrumbItems = [];
    breadcrumbItems.push(
        <Text key="root" c="var(--accent-primary)" fw={600} fz="sm">
            {rootText}
        </Text>
    );
    if (Array.isArray(childText)) {
        childText.forEach((text, i) =>
            breadcrumbItems.push(
                <Text key={i} c="var(--text-secondary)" fz="sm">
                    {text}
                </Text>
            )
        );
    } else {
        breadcrumbItems.push(
            <Text key="child" c="var(--text-secondary)" fz="sm">
                {childText}
            </Text>
        );
    }

    return (
        <Box
            style={{
                zIndex: 30,
                position: "fixed",
                backdropFilter: "blur(20px) saturate(180%)",
                borderRadius: "var(--radius-lg)",
                border: `1px solid ${scrolled ? "var(--navbar-border)" : "transparent"}`,
                transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                lineHeight: "25.6px",
            }}
            bg="var(--navbar-bg)"
            mih={64}
            mx="auto"
            pb={8}
            px={{ base: 15, md: 10 }}
            ps={{ xl: 12 }}
            pt={8}
            left={clip ? undefined : margin}
            right={clip ? clipMargin : margin}
            top={{ base: 12, md: 16 }}
            w={clip ? width : undefined}
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
                        c="var(--text-primary)"
                        fw="bold"
                        fz={{ base: 24, md: 34 }}
                        ff="'Space Grotesk', sans-serif"
                        style={{ letterSpacing: "-0.02em" }}
                    >
                        {Array.isArray(childText)
                            ? childText[childText.length - 1]
                            : childText}
                    </Text>
                </Box>
                <Flex
                    ms="auto"
                    w={{ base: "100%", md: "auto" }}
                    align="center"
                    direction="row"
                    p={10}
                    style={{
                        borderRadius: "var(--radius-lg)",
                        background: "var(--surface-primary)",
                        border: "1px solid var(--border-subtle)",
                        overflow: "visible",
                    }}
                >
                    {children}
                </Flex>
            </Flex>
        </Box>
    );
}