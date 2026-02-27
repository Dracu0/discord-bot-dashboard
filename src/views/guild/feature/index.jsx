import React, { useContext, useMemo } from "react";

import { Box, Flex, Text } from "@chakra-ui/react";

// Custom components
import { updateFeatureOptions } from "api/internal";

import { useFeatureDetailQuery, useFeatureInfo, } from "contexts/FeatureDetailContext";
import { GuildContext } from "contexts/guild/GuildContext";
import { FeaturesContext } from "contexts/FeaturesContext";
import { ConfigGrid, ConfigGridSkeleton } from "components/fields/ConfigPanel";
import { config } from "config/config";
import NotFound from "../../info/Not_Found";
import { useParams } from "react-router-dom";
import { useQueryClient } from "react-query";
import { usePageState } from "utils/State";
import { useLocale, Locale } from "utils/Language";
import useBanner from "./components/Banner";

export default function Feature() {
    const { feature } = useParams()

    if (config.features[feature] == null) {
        return <NotFound />
    } else {
        return <FeaturePanel />
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
            flexDirection="column"
            mb="10"
        >
            {canToggle && !enabled && (
                <Box
                    bg="orange.500"
                    color="white"
                    px={4}
                    py={3}
                    borderRadius="12px"
                    mb={4}
                    fontSize="sm"
                    fontWeight="600"
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
                <Text color="red.400">Failed to load feature configuration.</Text>
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
        <Box opacity={enabled ? 1 : 0.5} pointerEvents={enabled ? "auto" : "none"}>
            <ConfigGrid
                onSave={onSave}
                options={options}
                onSaved={onSaved}
            />
        </Box>
    )
}