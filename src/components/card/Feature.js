// Chakra imports
import {Box, Button, ButtonGroup, Flex, Heading, Image, Text, useColorModeValue} from "@chakra-ui/react";
import {Link} from "react-router-dom";
// Custom components
import Card from "components/card/Card.js";
// Assets
import React, {useContext} from "react";
import {GuildContext} from "../../contexts/guild/GuildContext";
import {Locale, useLocale} from "../../utils/Language";
import {useEnableFeatureMutation} from "../../api/utils";
import {useDetailColor, useTextColor} from "../../utils/colors";

export default function Feature({banner, name, description, id: featureId, enabled}) {
    const {id: serverId} = useContext(GuildContext);
    const configUrl = `/guild/${serverId}/features/${featureId}`
    const enableMutation = useEnableFeatureMutation(serverId, featureId)
    const locale = useLocale()

    const textColor = useTextColor();
    const detailColor = useDetailColor();
    const hoverBorder = useColorModeValue("brand.200", "brand.600");

    return (
        <Card
            p="20px"
            overflow="hidden"
            gap={3}
            transition="all 0.25s ease"
            border="1px solid"
            borderColor="transparent"
            _hover={{
                transform: "translateY(-4px)",
                borderColor: hoverBorder,
            }}
        >
            {banner?
                <Image
                    h={20}
                    src={banner}
                    bgSize="cover"
                    rounded="16px"
                />:
                <Box
                    h={20}
                    bgGradient="linear(135deg, brand.500 0%, brand.300 50%, accent.cyan 100%)"
                    rounded="16px"
                />
            }

            <Flex direction="column" justify="space-between" gap={3}>
                <Flex direction="column">
                    <Heading
                        size="md"
                        color={textColor}
                        fontFamily="'Space Grotesk', sans-serif"
                    >
                        {locale(name)}
                    </Heading>
                    <Text
                        color={detailColor}
                        fontSize="sm"
                        fontWeight="400"
                    >
                        {description}
                    </Text>
                </Flex>
                <ButtonGroup mt="5">
                    {enabled && (
                        <ConfigButton configUrl={configUrl}/>
                    )}
                    <EnableButton
                        enabled={enabled}
                        isLoading={enableMutation.isLoading}
                        onChange={enableMutation.mutate}
                    />
                </ButtonGroup>
            </Flex>
        </Card>
    );
}

function ConfigButton({configUrl}) {
    return (
        <Link
            to={configUrl}
        >
            <Button
                variant="brand"
                fontSize="sm"
                borderRadius="70px"
                px="24px"
                py="5px"
            >
                <Locale zh="配置此功能" en="Configure"/>
            </Button>
        </Link>
    );
}

function EnableButton({enabled, isLoading, onChange}) {
    return (
        <Button
            onClick={() => onChange(!enabled)}
            isLoading={isLoading}
            fontSize="sm"
            borderRadius="70px"
            px="24px"
            py="5px"
        >
            {enabled?
                <Locale zh="禁用此功能" en="Disable"/>
                 :
                <Locale zh="啟用此功能" en="Enable"/>
            }
        </Button>
    );
}
