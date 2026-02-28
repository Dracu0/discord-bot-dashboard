import { Box, Button, Center, Image, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import not_found from "assets/img/info/not_found_404.svg";
import { Locale } from "utils/Language";
import { useColorValue } from "utils/colors";

export default function NotFound() {
    const textColor = useColorValue("var(--mantine-color-gray-7)", "white");
    const detailColor = useColorValue("var(--mantine-color-gray-5)", "rgba(255,255,255,0.6)");

    return (
        <Center h={{ base: "calc(100vh - 90px)", md: "calc(100vh - 80px)" }} pos="relative">
            <Box pos="relative" ta="center">
                <Image w={350} mx="auto" src={not_found} alt="Not Found" opacity={0.8} />
                <Title
                    order={1}
                    mt={6}
                    fz="4xl"
                    ff="'Space Grotesk', sans-serif"
                    style={{
                        background: "linear-gradient(to right, var(--mantine-color-brand-4), var(--mantine-color-cyan-4))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    404
                </Title>
                <Text fz="lg" c={textColor} fw={600} mt={2}>
                    <Locale zh="找不到頁面" en="Page Not Found" />
                </Text>
                <Text fz="md" c={detailColor} mt={1}>
                    <Locale zh="您請求的資源不存在" en="The resource you requested could not be found" />
                </Text>
                <Button component={Link} to="/" variant="filled" color="brand" mt={8} size="lg">
                    <Locale zh="返回首頁" en="Go Home" />
                </Button>
            </Box>
        </Center>
    );
}