import React from "react";
import { Box, Button, Flex, Text, Title } from "@mantine/core";
import DefaultAuth from "layouts/auth/Default";
import illustration from "assets/img/auth/Banner.jpg";
import { IconBrandDiscord } from "@tabler/icons-react";
import { config } from "config/config";
import { Locale } from "../../../utils/Language";
import { useColorValue, useDetailColor, useTextColor } from "../../../utils/colors";

function SignIn({ loading = false }) {
    const textColor = useTextColor();
    const textColorSecondary = useDetailColor();
    const cardBg = useColorValue("white", "var(--mantine-color-dark-7)");

    const onSignIn = () => {
        window.location.href = `${config.serverUrl}/auth/discord`;
    };

    return (
        <DefaultAuth illustrationBackground={illustration} image={illustration}>
            <Flex direction="column" align="center" justify="center" ta="center" maw={480} w="100%">
                {/* Brand Logo */}
                <Text
                    fz={48}
                    fw={800}
                    ff="'Space Grotesk', sans-serif"
                    lts="-0.03em"
                    mb={8}
                    style={{
                        background: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 50%, #22D3EE 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Mocotron
                </Text>

                {/* Card */}
                <Box
                    w="100%"
                    p={{ base: 32, md: 48 }}
                    mt={24}
                    style={{
                        backgroundColor: cardBg,
                        borderRadius: 20,
                        border: "1px solid var(--mantine-color-default-border)",
                        transition: "box-shadow 0.4s ease",
                    }}
                >
                    <Title
                        order={2}
                        c={textColor}
                        fz={{ base: 26, md: 32 }}
                        ff="'Space Grotesk', sans-serif"
                        mb={12}
                    >
                        <Locale zh="歡迎回來" en="Welcome Back" />
                    </Title>
                    <Text mb={32} c={textColorSecondary} fw={400} fz="md" lh={1.6}>
                        <Locale zh="讓你的創意社群更上一層樓" en="Empower Your Creative Community" />
                    </Text>

                    <Button
                        variant="filled"
                        color="brand"
                        w="100%"
                        h={56}
                        fz="lg"
                        fw={700}
                        onClick={onSignIn}
                        loading={loading}
                        leftSection={<IconBrandDiscord size={22} />}
                    >
                        <Locale zh="Discord 登入" en="Login with Discord" />
                    </Button>

                    <Text mt={24} c={textColorSecondary} fw={400} fz={13} style={{ opacity: 0.7 }}>
                        <Locale zh="您的所有個人信息都將被保密" en="Your data stays private and secure" />
                    </Text>
                </Box>
            </Flex>
        </DefaultAuth>
    );
}

export default SignIn;