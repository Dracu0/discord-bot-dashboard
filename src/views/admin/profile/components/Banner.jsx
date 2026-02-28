import { Avatar, Box, Flex, Text } from "@mantine/core";
import Card from "components/card/Card";
import React from "react";
import { config } from "../../../../config/config";
import { Locale } from "../../../../utils/Language";
import { useColorValue, useDetailColor, useTextColor } from "../../../../utils/colors";

export default function Banner(props) {
    const { banner, avatar, name, joinedServers, servers } = props;
    const textColorPrimary = useTextColor();
    const textColorSecondary = useDetailColor();
    const borderColor = useColorValue("white", "var(--mantine-color-dark-7)");

    return (
        <Card mb={{ base: 0, lg: 20 }} style={{ alignItems: "center" }}>
            <Box
                w="100%"
                h={140}
                style={{
                    borderRadius: 20,
                    backgroundImage: banner ? `url(${banner})` : undefined,
                    background: !banner
                        ? "linear-gradient(135deg, var(--mantine-color-brand-5) 0%, var(--mantine-color-brand-4) 50%, #22D3EE 100%)"
                        : undefined,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            />
            <Avatar
                mx="auto"
                src={avatar}
                size={90}
                mt={-45}
                style={{
                    border: `4px solid ${borderColor}`,
                    boxShadow: "0 4px 20px rgba(139, 92, 246, 0.3)",
                }}
            />
            <Text c={textColorPrimary} fw="bold" fz="xl" mt={12} ff="'Space Grotesk', sans-serif">
                {name}
            </Text>
            <Text c={textColorSecondary} fz="sm">
                <Locale zh="歡迎回到" en="Welcome back to" /> {config.name}
            </Text>
            <Flex w="max-content" mx="auto" mt={26} wrap="wrap" gap={32}>
                {joinedServers && (
                    <Flex align="center" direction="column">
                        <Text c="brand.4" fz="2xl" fw={700} ff="'Space Grotesk', sans-serif">
                            {joinedServers}
                        </Text>
                        <Text c={textColorSecondary} fz="sm" fw={400}>
                            <Locale zh="已加入的服務器" en="Joined Servers" />
                        </Text>
                    </Flex>
                )}
                {servers && (
                    <Flex align="center" direction="column">
                        <Text c="brand.4" fz="2xl" fw={700} ff="'Space Grotesk', sans-serif">
                            {servers}
                        </Text>
                        <Text c={textColorSecondary} fz="sm" fw={400}>
                            <Locale zh="您擁有的服務器" en="Total Servers" />
                        </Text>
                    </Flex>
                )}
            </Flex>
        </Card>
    );
}
