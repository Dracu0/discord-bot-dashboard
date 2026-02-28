import React from "react";
import { Box, Button, Flex, Text, Title } from "@mantine/core";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/Banner.jpg";
import { IconBrandDiscord } from "@tabler/icons-react";
import { config } from "config/config";
import { Locale } from "../../../utils/Language";

function SignIn({ loading = false }) {

    const onSignIn = () => {
        window.location.href = `${config.serverUrl}/auth/discord`;
    };

    return (
        <DefaultAuth illustrationBackground={illustration} image={illustration}>
            <Flex direction="column" align="center" justify="center" ta="center" maw={440} w="100%">
                {/* Brand Logo */}
                <Text
                    fz={{ base: 40, md: 48 }}
                    fw={800}
                    ff="'Space Grotesk', sans-serif"
                    lts="-0.03em"
                    mb={4}
                    style={{
                        background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #22D3EE 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {config.name || "Mocotron"}
                </Text>
                <Text c="var(--text-muted)" fz="sm" fw={400} mb={24}>
                    <Locale zh="Discord 機器人管理面板" en="Discord Bot Dashboard" />
                </Text>

                {/* Card */}
                <Box
                    w="100%"
                    p={{ base: 28, md: 40 }}
                    style={{
                        backgroundColor: "var(--surface-primary)",
                        borderRadius: "var(--radius-xl)",
                        border: "1px solid var(--border-default)",
                        boxShadow: "var(--shadow-lg)",
                    }}
                >
                    <Title
                        order={2}
                        c="var(--text-primary)"
                        fz={{ base: 24, md: 28 }}
                        ff="'Space Grotesk', sans-serif"
                        mb={8}
                    >
                        <Locale zh="歡迎回來" en="Welcome Back" />
                    </Title>
                    <Text mb={28} c="var(--text-secondary)" fw={400} fz="md" lh={1.6}>
                        <Locale zh="讓你的創意社群更上一層樓" en="Empower Your Creative Community" />
                    </Text>

                    <Button
                        variant="filled"
                        color="#5865F2"
                        w="100%"
                        h={52}
                        fz="md"
                        fw={600}
                        radius="md"
                        onClick={onSignIn}
                        loading={loading}
                        leftSection={<IconBrandDiscord size={22} />}
                        styles={{
                            root: {
                                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                                "&:hover": { transform: "translateY(-1px)" },
                                "&:active": { transform: "scale(0.98)" },
                            },
                        }}
                    >
                        <Locale zh="Discord 登入" en="Continue with Discord" />
                    </Button>

                    <Text mt={20} c="var(--text-muted)" fw={400} fz={12}>
                        <Locale zh="您的所有個人信息都將被保密" en="Your data stays private and secure" />
                    </Text>
                </Box>
            </Flex>
        </DefaultAuth>
    );
}

export default SignIn;