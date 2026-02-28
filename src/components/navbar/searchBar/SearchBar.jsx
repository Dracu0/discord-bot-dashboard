import React, { useContext, useEffect, useMemo, useState } from "react";
import { Skeleton, Stack, Text, Title } from "@mantine/core";
import { useDisclosure, useHotkeys } from "@mantine/hooks";
import { FeaturesContext } from "contexts/FeaturesContext";
import Feature from "../../card/Feature";
import { useLocation } from "react-router-dom";
import SearchInput from "../../fields/impl/SearchInput";
import { GuildContext } from "contexts/guild/GuildContext";
import { useQuery } from "@tanstack/react-query";
import { getFeatures } from "api/internal";
import { Query } from "contexts/components/AsyncContext";
import { config } from "../../../config/config";
import { Action } from "../../card/Action";
import { Locale, useLocale } from "../../../utils/Language";
import Modal from "../../modal/Modal";

export function SearchBar({ ...rest }) {
    const [opened, { open, close }] = useDisclosure();

    const [search, setSearch] = useState("");
    const location = useLocation();
    useEffect(close, [location.pathname, close]);

    useHotkeys([["mod+K", open]]);

    const groupStyle = {
        w: { base: "100%", md: "200px" },
        ...rest,
    };
    return (
        <>
            <SearchModal isOpen={opened} onClose={close} search={search} />
            <SearchInput value={search} onChange={setSearch} groupStyle={groupStyle} onSearch={open} />
        </>
    );
}

function SearchList({ search }) {
    const locale = useLocale();

    function filter(map) {
        return Object.entries(map).filter(([, feature]) =>
            locale(feature.name).includes(search)
        );
    }

    const { features, actions } = useMemo(
        () => ({
            features: filter(config.features),
            actions: filter(config.actions),
        }),
        [search]
    );

    const empty = features.length === 0 && actions.length === 0;

    return (
        <Stack gap={20}>
            {empty ? (
                <Text>
                    <Locale zh="沒有找到結果" en="No Result Found" />
                </Text>
            ) : (
                <Content features={features} actions={actions} />
            )}
        </Stack>
    );
}

function Content({ features, actions }) {
    const { enabled } = useContext(FeaturesContext);

    return (
        <>
            <Title order={4}>
                <Locale zh="功能" en="Features" />
            </Title>
            {features.map(([id, feature]) => (
                <Feature key={id} id={id} {...feature} enabled={enabled.includes(id)} />
            ))}
            <Title order={4}>
                <Locale zh="動作" en="Actions" />
            </Title>
            {actions.map(([id, action]) => (
                <Action key={id} action={{ id, ...action }} />
            ))}
        </>
    );
}

function SearchModal({ isOpen, onClose, search }) {
    const all = search.length === 0;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="xl"
            scrollBehavior="inside"
            header={{
                zh: `搜索功能: ${all ? "全部" : search}`,
                en: `Search Filter: ${all ? "All" : search}`,
            }}
        >
            <DataProvider>
                <SearchList search={search} />
            </DataProvider>
        </Modal>
    );
}

function DataProvider({ children }) {
    const { id: serverId } = useContext(GuildContext);

    const features = useQuery({
        queryKey: ["features", serverId],
        queryFn: () => getFeatures(serverId),
        retry: 0,
    });

    return (
        <Query
            query={features}
            placeholder={
                <Stack>
                    <Skeleton radius="lg" height={100} />
                    <Skeleton radius="lg" height={100} />
                </Stack>
            }
        >
            <FeaturesContext.Provider value={features.data}>
                {children}
            </FeaturesContext.Provider>
        </Query>
    );
}
