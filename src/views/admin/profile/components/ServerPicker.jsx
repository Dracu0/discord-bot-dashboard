import { SegmentedControl } from "components/ui/segmented-control";
import React, { useMemo, useState } from "react";
import Server from "views/admin/profile/components/Server";
import { QueryHolderSkeleton } from "../../../../contexts/components/AsyncContext";
import SearchInput from "../../../../components/fields/impl/SearchInput";
import { Locale } from "../../../../utils/Language";
import { useTextFilter } from "../../../../hooks/useTextFilter";
import PageSection from "../../../../components/layout/PageSection";

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

export default function ServerPicker({ query }) {
    const { query: filter, setQuery: setFilter, includes } = useTextFilter();
    const [sortBy, setSortBy] = useState("default");

    return (
        <PageSection
            title={<Locale zh="您的伺服器" en="Your Servers" />}
            description={<Locale zh="選擇伺服器以開啟儀表板或邀請機器人。" en="Select a server to open its dashboard or send an invite." />}
            actions={
                <div className="flex flex-wrap items-end gap-3">
                    <SearchInput value={filter} onChange={setFilter} groupStyle={{ maxWidth: 260 }} />
                    <SegmentedControl
                        value={sortBy}
                        onChange={setSortBy}
                        data={SORT_OPTIONS}
                        size="xs"
                    />
                </div>
            }
        >
            <QueryHolderSkeleton count={3} query={query}>
                <Servers includes={includes} guilds={query.data} sortBy={sortBy} />
            </QueryHolderSkeleton>
        </PageSection>
    );
}

function Servers({ includes, guilds, sortBy }) {
    const filtered = useMemo(() => {
        const matched = (guilds || []).filter((server) => includes(server.name));
        return sortGuilds(matched, sortBy);
    }, [guilds, includes, sortBy]);

    if (filtered.length === 0) {
        return (
            <p className="text-(--text-muted) text-sm text-center py-8">
                <Locale zh="沒有找到伺服器" en="No servers found" />
            </p>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((server) => <Server key={server.id} server={server} />)}
        </div>
    );
}
