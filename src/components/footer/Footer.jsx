import React from "react";
import { Anchor, Flex, Text } from "@mantine/core";
import { homepage } from "variables/links";
import { config } from "config/config";
import { Locale } from "../../utils/Language";

export default function Footer({ children }) {
    return (
        <Flex
            style={{ zIndex: 1 }}
            direction={{ base: "column", xl: "row" }}
            align={{ base: "center", xl: "flex-start" }}
            justify="space-between"
            px={{ base: 16, sm: 24, md: 50 }}
            pb={30}
        >
            <Text
                c="var(--text-secondary)"
                ta={{ base: "center", xl: "start" }}
                mb={{ base: 20, xl: 0 }}
                fz="sm"
            >
                &copy; {new Date().getFullYear()}
                <Text span fw={500} ms={4}>
                    {config.name} Dashboard.
                    <Locale
                        zh=" 版權所有。基於"
                        en=" All Rights Reserved. Built with"
                    />
                    <Anchor mx={3} c="brand.4" href={homepage} target="_blank" fw={600}>
                        Discord Dashboard
                    </Anchor>
                </Text>
            </Text>
            {children}
        </Flex>
    );
}
