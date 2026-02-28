import { Flex, SimpleGrid, Text } from "@mantine/core";
import Card from "components/card/Card";
import React from "react";
import Server from "views/admin/profile/components/Server";
import { QueryHolderSkeleton } from "../../../../contexts/components/AsyncContext";
import SearchInput from "../../../../components/fields/impl/SearchInput";
import { config } from "../../../../config/config";
import { Locale } from "../../../../utils/Language";
import { useTextFilter } from "../../../../hooks/useTextFilter";

export default function ServerPicker({ query, ...rest }) {
    const { query: filter, setQuery: setFilter, includes } = useTextFilter();

    return (
        <Card mb={{ base: 0, "2xl": 20 }} gap="2rem" {...rest}>
            <Flex direction="column" align="center">
                <Text c="var(--text-primary)" fw="bold" fz="2xl" mt={10} ff="'Space Grotesk', sans-serif">
                    <Locale zh="您的服務器" en="Your Servers" />
                </Text>
                <Text c="var(--text-secondary)" fz="md">
                    <Locale
                        zh={`把${config.name}邀請到你的服務器, 並且客製化你的機器人`}
                        en={`Invite ${config.name} to Your Server, And Customize the bot`}
                    />
                </Text>

                <SearchInput value={filter} onChange={setFilter} groupStyle={{ mt: 5, maw: 900 }} />
            </Flex>
            <SimpleGrid cols={{ base: 1, lg: 2, "2xl": 3 }} spacing={5}>
                <QueryHolderSkeleton count={3} query={query}>
                    <Servers includes={includes} guilds={query.data} />
                </QueryHolderSkeleton>
            </SimpleGrid>
        </Card>
    );
}

function Servers({ includes, guilds }) {
    return guilds
        .filter((server) => includes(server.name))
        .map((server) => <Server key={server.id} server={server} />);
}