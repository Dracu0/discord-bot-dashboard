import React, {useContext} from "react";
import {Box, Button, Flex, HStack, Image, Text, useColorModeValue} from "@chakra-ui/react";
import Card from "components/card/Card";
import {Link} from "react-router-dom";
import {GuildContext} from "contexts/guild/GuildContext";
import {Locale, useLocale} from "../../utils/Language";
import {useDetailColor, useNeuHover, useTextColor} from "../../utils/colors";

export function Action({id, action}) {
    const {id: serverId} = useContext(GuildContext)
    const configUrl = `/guild/${serverId}/actions/${id}`
    const locale = useLocale()

    const textColor = useTextColor();
    const detailColor = useDetailColor();
    const hoverBorder = useColorModeValue("brand.200", "brand.600");

    return (
        <Card
            p="20px"
            transition="all 0.25s ease"
            border="1px solid"
            borderColor="transparent"
            _hover={{
                transform: "translateY(-4px)",
                borderColor: hoverBorder,
            }}
        >
            <Flex direction="column" gap={3}>
                {action.banner?
                    <Image
                        h="5rem"
                        objectFit="cover"
                        rounded="16px"
                        src={action.banner}
                    /> :
                    <Box
                        h="5rem"
                        rounded="16px"
                        bgGradient="linear(135deg, brand.600 0%, accent.pink 50%, accent.gold 100%)"
                    />
                }
                <Text
                    color={textColor}
                    fontSize={{ base: "xl", md: "lg" }}
                    fontWeight="bold"
                    fontFamily="'Space Grotesk', sans-serif"
                >
                    {locale(action.name)}
                </Text>
                <Text
                    color={detailColor}
                    fontSize="md"
                    mb={5}
                >
                    {action.description}
                </Text>
                <HStack>
                    <Link to={configUrl}>
                        <Button px={10} variant="brand">
                            <Locale zh='打開' en="Open" />
                        </Button>
                    </Link>
                </HStack>
            </Flex>
        </Card>
    );
}