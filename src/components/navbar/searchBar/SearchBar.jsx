import React, { useContext, useEffect, useMemo, useState } from "react";
import { useDisclosure } from "hooks/useDisclosure";
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

export function SearchBar({ className, ...rest }) {
    const [opened, { open, close }] = useDisclosure();

    const [search, setSearch] = useState("");
    const location = useLocation();
    useEffect(close, [location.pathname, close]);

    useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                open();
            }
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open]);

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
        [search, locale]
    );

    const empty = features.length === 0 && actions.length === 0;

    return (
        <div className="flex flex-col gap-5">
            {empty ? (
                <p>
                    <Locale zh="\u6c92\u6709\u627e\u5230\u7d50\u679c" en="No Result Found" />
                </p>
            ) : (
                <Content features={features} actions={actions} />
            )}
        </div>
    );
}

function Content({ features, actions }) {
    const { enabled } = useContext(FeaturesContext);

    return (
        <>
            <h4 className="text-lg font-semibold">
                <Locale zh="\u529f\u80fd" en="Features" />
            </h4>
            {features.map(([id, feature]) => (
                <Feature key={id} id={id} {...feature} enabled={enabled.includes(id)} />
            ))}
            <h4 className="text-lg font-semibold">
                <Locale zh="\u52d5\u4f5c" en="Actions" />
            </h4>
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
                zh: `\u641c\u7d22\u529f\u80fd: ${all ? "\u5168\u90e8" : search}`,
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
                <div className="flex flex-col gap-4">
                    <div className="animate-pulse rounded-lg bg-muted h-[100px]" />
                    <div className="animate-pulse rounded-lg bg-muted h-[100px]" />
                </div>
            }
        >
            <FeaturesContext.Provider value={features.data}>
                {children}
            </FeaturesContext.Provider>
        </Query>
    );
}
