import { Box, Center, Heading, Image, Text, Button, useColorModeValue } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import not_found from "assets/img/info/not_found_404.svg"
import { Locale } from "utils/Language";

export default function NotFound() {
    const textColor = useColorModeValue("gray.700", "white");
    const detailColor = useColorModeValue("gray.500", "whiteAlpha.600");

    return <Center h={{base: "calc(100vh - 90px)", md: "calc(100vh - 80px)"}} position="relative">
        <Box position="relative" textAlign="center">
            <Image width={350} mx="auto" src={not_found} alt="Not Found" opacity={0.8} />
            <Heading
                mt={6}
                fontSize="4xl"
                fontFamily="'Space Grotesk', sans-serif"
                bgGradient="linear(to-r, brand.400, accent.cyan)"
                bgClip="text"
            >
                404
            </Heading>
            <Text fontSize="lg" color={textColor} fontWeight="600" mt={2}>
                <Locale zh="找不到頁面" en="Page Not Found" />
            </Text>
            <Text fontSize="md" color={detailColor} mt={1}>
                <Locale zh="您請求的資源不存在" en="The resource you requested could not be found" />
            </Text>
            <Link to="/">
                <Button variant="brand" mt={8} size="lg">
                    <Locale zh="返回首頁" en="Go Home" />
                </Button>
            </Link>
        </Box>
    </Center>
}