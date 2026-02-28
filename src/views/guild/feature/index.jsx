import React, { useContext, useMemo } from "react";

import { Box, Flex, Text } from "@mantine/core";

import { updateFeatureOptions } from "api/internal";

import { useFeatureDetailQuery, useFeatureInfo } from "contexts/FeatureDetailContext";
import { GuildContext } from "contexts/guild/GuildContext";
import { FeaturesContext } from "contexts/FeaturesContext";
import { ConfigGrid, ConfigGridSkeleton } from "components/fields/ConfigPanel";
import { config } from "config/config";
import NotFound from "../../info/Not_Found";
import { useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { usePageState } from "utils/State";
import { useLocale, Locale } from "utils/Language";
import useBanner from "./components/Banner";

export default function Feature() {
    const { feature } = useParams()

    if (config.features[feature] == null) {
        return <NotFound />
    } else {
        return <FeaturePanel key={feature} />
    }
}

function FeaturePanel() {
    const { id, name, canToggle } = useFeatureInfo()
    const locale = useLocale()
    const query = useFeatureDetailQuery(id)
    const featuresData = useContext(FeaturesContext)
    const enabled = !canToggle || featuresData?.enabled?.includes(id)
    useBanner(locale(name))

    return (
        <Flex
            direction="column"
            mb={10}
        >
            {canToggle && !enabled && (
                <Box
                    bg="var(--status-warning-bg)"
                    c="var(--status-warning)"
                    px={16}
                    py={12}
                    mb={16}
                    fz="sm"
                    fw={600}
                    style={{ borderRadius: "var(--radius-md)", border: "1px solid var(--status-warning)" }}
                >
                    <Locale
                        zh="此功能已停用。啟用後設定才會生效。"
                        en="This feature is currently disabled. Enable it using the toggle above for settings to take effect."
                    />
                </Box>
            )}
            {query.isLoading ?
                <ConfigGridSkeleton />
                : query.error || !query.data ?
                <Text c="red.4">Failed to load feature configuration.</Text>
                :
                <FeatureConfigPanel detail={query.data} enabled={enabled} />
            }
        </Flex>
    );
}

function FeatureConfigPanel({ detail, enabled }) {
    const { id: serverId } = useContext(GuildContext);
    const featuresData = useContext(FeaturesContext);
    const state = usePageState({ data: featuresData.data })
    const info = useFeatureInfo()
    const { values } = detail

    const client = useQueryClient()
    const options = useMemo(
        () => info.options(values, state),
        [info.id, values]
    )

    const onSave = (changes) => updateFeatureOptions(serverId, info.id, changes);
    const onSaved = (data) => {

        return client.setQueryData(["feature_detail", serverId, info.id], current => 
            current ? { ...current, values: data } : current
        )
    }

    return (
        <Box
            component="fieldset"
            disabled={!enabled}
            style={{ border: "none", padding: 0, margin: 0, opacity: enabled ? 1 : 0.5 }}
        >
            <ConfigGrid
                onSave={onSave}
                options={options}
                onSaved={onSaved}
            />
        </Box>
    )
}