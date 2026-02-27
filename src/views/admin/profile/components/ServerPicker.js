// Chakra imports
import {Flex, SimpleGrid, Text} from "@chakra-ui/react";
// Custom components
import Card from "components/card/Card.js";
import React from "react";
import Server from "views/admin/profile/components/Server";
import {QueryHolderSkeleton} from "../../../../contexts/components/AsyncContext";
import SearchInput from "../../../../components/fields/impl/SearchInput";
import {config} from "../../../../config/config";
import {Locale} from "../../../../utils/Language";
import {useDetailColor, useNeuFlat, useTextColor} from "../../../../utils/colors";
import {useTextFilter} from "../../../../hooks/useTextFilter";

export default function ServerPicker({query, ...rest}) {

    const textColorPrimary = useTextColor();
    const textColorSecondary = useDetailColor();

    const {query: filter, setQuery: setFilter, includes} = useTextFilter()

    return (
        <Card mb={{base: "0px", "2xl": "20px"}} gap="2rem" {...rest}>
            <Flex direction="column" align="center">
                <Text
                    color={textColorPrimary}
                    fontWeight="bold"
                    fontSize="2xl"
                    mt="10px"
                    fontFamily="'Space Grotesk', sans-serif"
                >
                    <Locale zh="您的服務器" en="Your Servers" />
                </Text>
                <Text color={textColorSecondary} fontSize="md">
                    <Locale
                        zh={`把${config.name}邀請到你的服務器, 並且客製化你的機器人`}
                        en={`Invite ${config.name} to Your Server, And Customize the bot`}
                    />
                </Text>

                <SearchInput value={filter} onChange={setFilter} groupStyle={{
                    mt: 5,
                    maxW: "900px"
                }}/>
            </Flex>
            <SimpleGrid columns={{base: 1, lg: 2, "2xl": 3}} gap={5}>
                <QueryHolderSkeleton count={3} query={query}>
                    <Servers includes={includes} guilds={query.data}/>
                </QueryHolderSkeleton>
            </SimpleGrid>
        </Card>
    );
}

function Servers({includes, guilds}) {
    const neuFlat = useNeuFlat();

    return guilds
        .filter(server => includes(server.name))
        .map((server) => {
            return (
                <Server
                    key={server.id}
                    boxShadow={neuFlat}
                    server={server}
                />
            );
        })
}