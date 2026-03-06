import { Card } from "components/ui/card";
import { SegmentedControl } from "components/ui/segmented-control";
import React, { useMemo, useState } from "react";
import Server from "views/admin/profile/components/Server";
import { QueryHolderSkeleton } from "../../../../contexts/components/AsyncContext";
import SearchInput from "../../../../components/fields/impl/SearchInput";
import { config } from "../../../../config/config";
import { Locale, useLocale } from "../../../../utils/Language";
import { useTextFilter } from "../../../../hooks/useTextFilter";

const SORT_OPTIONS = [
    { value: "default", label: "Default" },
    { value: "name", label: "A\u2013Z" },
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
        <Card className="mb-0 2xl:mb-5 gap-8" {...rest}>
            <div className="flex flex-col items-center">
                <p
                    className="text-(--text-primary) font-bold text-2xl mt-2.5"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    <Locale zh="您的服務器" en="Your Servers" />
                </p>
                <p className="text-(--text-secondary) text-base">
                    <Locale
                        zh={`把${config.name}邀請到你的服務器, 並且客製化你的機器人`}
                        en={`Invite ${config.name} to Your Server, And Customize the bot`}
                    />
                </p>

                <div className="flex items-end flex-wrap justify-center gap-3 mt-3">
                    <SearchInput value={filter} onChange={setFilter} groupStyle={{ maxWidth: 400 }} />
                    <SegmentedControl
                        value={sortBy}
                        onChange={setSortBy}
                        data={SORT_OPTIONS}
                        size="xs"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-3">
                <QueryHolderSkeleton count={3} query={query}>
                    <Servers includes={includes} guilds={query.data} sortBy={sortBy} />
                </QueryHolderSkeleton>
            </div>
        </Card>
    );
}

function Servers({ includes, guilds, sortBy }) {
    const filtered = useMemo(() => {
        const matched = (guilds || []).filter((server) => includes(server.name));
        return sortGuilds(matched, sortBy);
    }, [guilds, includes, sortBy]);

    if (filtered.length === 0) {
        return (
            <p className="text-(--text-muted) text-sm text-center py-5">
                <Locale zh="沒有找到服務器" en="No servers found" />
            </p>
        );
    }

    return filtered.map((server) => <Server key={server.id} server={server} />);
}
