import React, {useContext, useMemo, useState, useCallback} from "react";

import {Box} from "@mantine/core";

import {usePageInfo} from "contexts/PageInfoContext";
import {SettingsContext} from "../../../contexts/SettingsContext";
import {ConfigGrid} from "components/fields/ConfigPanel";
import {config} from "config/config";
import {useLocale} from "utils/Language";
import {PAGE_PT} from "utils/layout-tokens";

export default function SettingsPanel() {
    const locale = useLocale()
    usePageInfo(
        locale({zh: "設置", en: "Settings"})
    )

    return (
        <Box pt={PAGE_PT}>
            <SettingsConfigPanel />
        </Box>
    );
}

function SettingsConfigPanel() {
    const appSettings = useContext(SettingsContext);
    const [saved, setSaved] = useState(false);

    const options = useMemo(
        () => config.settings({
            language: appSettings.language,
            fixedWidth: appSettings.fixedWidth,
            devMode: appSettings.devMode,
        }),
        [appSettings.language, appSettings.fixedWidth, appSettings.devMode]
    )

    const onSave = useCallback((changes) => {
        const updates = {};
        for (const [key, value] of changes) {
            updates[key] = value;
        }
        appSettings.updateSettings(updates);
        return Promise.resolve(updates);
    }, [appSettings])

    const onSaved = useCallback(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
    }, [])

    return (
        <ConfigGrid options={options} onSave={onSave} onSaved={onSaved} />
    )
}