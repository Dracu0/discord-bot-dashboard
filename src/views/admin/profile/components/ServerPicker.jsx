import { Flex, Group, SegmentedControl, Stack, Text } from "@mantine/core";
import Card from "components/card/Card";
import React, { useMemo, useState } from "react";
import Server from "views/admin/profile/components/Server";
import { QueryHolderSkeleton } from "../../../../contexts/components/AsyncContext";
import SearchInput from "../../../../components/fields/impl/SearchInput";
import { config } from "../../../../config/config";
import { Locale, useLocale } from "../../../../utils/Language";
import { useTextFilter } from "../../../../hooks/useTextFilter";

const SORT_OPTIONS = [
    { value: "default", label: "Default" },
    { value: "name", label: "A–Z" },
    { value: "joined", label: "Joined" },
];

function sortGuilds(guilds, sortBy) {
    if (sortBy === "name") {
        return [...guilds].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortBy === "joined") {
        return [...guilds].sort((a, b) => {
            if (a.exist === b.exist) return a.name.localeCompare(b.name);
            return a.exist ? -1 : 1;
        });
    }
    return guilds;
}

export default function ServerPicker({ query, ...rest }) {
    const { query: filter, setQuery: setFilter, includes } = useTextFilter();
    const [sortBy, setSortBy] = useState("default");

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

                <Group mt={12} gap="sm" align="flex-end" wrap="wrap" justify="center">
                    <SearchInput value={filter} onChange={setFilter} groupStyle={{ maw: 400 }} />
                    <SegmentedControl
                        value={sortBy}
                        onChange={setSortBy}
                        data={SORT_OPTIONS}
                        size="xs"
                    />
                </Group>
            </Flex>
            <Stack gap={12}>
                <QueryHolderSkeleton count={3} query={query}>
                    <Servers includes={includes} guilds={query.data} sortBy={sortBy} />
                </QueryHolderSkeleton>
            </Stack>
        </Card>
    );
}

function Servers({ includes, guilds, sortBy }) {
    const filtered = useMemo(() => {
        const matched = guilds.filter((server) => includes(server.name));
        return sortGuilds(matched, sortBy);
    }, [guilds, includes, sortBy]);

    if (filtered.length === 0) {
        return (
            <Text c="var(--text-muted)" fz="sm" ta="center" py={20}>
                <Locale zh="沒有找到服務器" en="No servers found" />
            </Text>
        );
    }

    return filtered.map((server) => <Server key={server.id} server={server} />);
}