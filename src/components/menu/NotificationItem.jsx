import { Box, Center, Flex, Image, Text } from "@mantine/core";
import { IconArrowUp } from "@tabler/icons-react";
import React from "react";

export function NotificationItem({ title, description, image }) {
    return (
        <>
            <Box
                style={{ borderRadius: 8, overflow: "hidden" }}
                me={14}
                h={{ base: 60, md: 70 }}
                w={{ base: 60, md: 70 }}
            >
                {image ? <Image src={image} /> : <ItemIcon />}
            </Box>

            <Flex direction="column">
                <Text mb={5} fw="bold" c="var(--text-primary)" fz="md">
                    {title}
                </Text>
                <Flex align="center">
                    <Text fz="sm" lh={1} c="var(--text-secondary)">
                        {description}
                    </Text>
                </Flex>
            </Flex>
        </>
    );
}

function ItemIcon() {
    return (
        <Center
            h="100%"
            style={{ background: "linear-gradient(135deg, #868CFF 0%, #4318FF 100%)" }}
        >
            <IconArrowUp size={28} color="white" />
        </Center>
    );
}