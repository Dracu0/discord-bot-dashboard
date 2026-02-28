import { Box, Button, Center, Image, Stack, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import not_found from "assets/img/info/not_found_404.svg";
import { Locale } from "utils/Language";
import { IconArrowLeft } from "@tabler/icons-react";

export default function NotFound() {

    return (
        <Center h={{ base: "calc(100vh - 90px)", md: "calc(100vh - 80px)" }} pos="relative">
            <Stack align="center" gap={0}>
                <Image w={{ base: 250, md: 350 }} mx="auto" src={not_found} alt="Not Found" opacity={0.8} />
                <Title
                    order={1}
                    mt={12}
                    fz={{ base: 48, md: 64 }}
                    fw={800}
                    ff="'Space Grotesk', sans-serif"
                    style={{
                        background: "linear-gradient(to right, var(--mantine-color-brand-4), var(--mantine-color-cyan-4))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    404
                </Title>
                <Text fz="lg" c="var(--text-primary)" fw={600} mt={4}>
                    <Locale zh="找不到頁面" en="Page Not Found" />
                </Text>
                <Text fz="sm" c="var(--text-secondary)" mt={4} ta="center" maw={360}>
                    <Locale zh="您請求的資源不存在" en="The page you're looking for doesn't exist or has been moved" />
                </Text>
                <Button
                    component={Link}
                    to="/"
                    variant="filled"
                    color="brand"
                    mt={24}
                    size="md"
                    radius="md"
                    leftSection={<IconArrowLeft size={18} />}
                >
                    <Locale zh="返回首頁" en="Go Home" />
                </Button>
            </Stack>
        </Center>
    );
}