import React from "react";
import { Anchor, Flex } from "@mantine/core";
import { config } from "config/config";
import Footer from "./Footer";
import { useLocale } from "utils/Language";

export default function AdminFooter() {
    const locale = useLocale();

    return (
        <Footer>
            <Flex gap={{ base: 20, md: 44 }}>
                {config.footer.map((item, i) => (
                    <Anchor key={i} fw={500} c="var(--text-secondary)" href={item.url}>
                        {locale(item.name)}
                    </Anchor>
                ))}
            </Flex>
        </Footer>
    );
}
