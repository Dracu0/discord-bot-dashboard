import React, { useContext, useMemo } from "react";

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
        <div className="flex flex-col mb-2.5">
            {canToggle && !enabled && (
                <div
                    className="px-4 py-3 mb-4 text-sm font-semibold rounded-[var(--radius-md)] border"
                    style={{
                        backgroundColor: "var(--status-warning-bg)",
                        color: "var(--status-warning)",
                        borderColor: "var(--status-warning)",
                    }}
                >
                    <Locale
                        zh="\u6b64\u529f\u80fd\u5df2\u505c\u7528\u3002\u555f\u7528\u5f8c\u8a2d\u5b9a\u624d\u6703\u751f\u6548\u3002"
                        en="This feature is currently disabled. Enable it using the toggle above for settings to take effect."
                    />
                </div>
            )}
            {query.isLoading ?
                <ConfigGridSkeleton />
                : query.error || !query.data ?
                <span className="text-red-400">Failed to load feature configuration.</span>
                :
                <FeatureConfigPanel detail={query.data} enabled={enabled} />
            }
        </div>
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
        <fieldset
            disabled={!enabled}
            style={{ border: "none", padding: 0, margin: 0, opacity: enabled ? 1 : 0.5 }}
        >
            <ConfigGrid
                onSave={onSave}
                options={options}
                onSaved={onSaved}
            />
        </fieldset>
    )
}
