import React, {useContext, useMemo, useState, useCallback} from "react";

import {usePageInfo} from "contexts/PageInfoContext";
import {SettingsContext} from "../../../contexts/SettingsContext";
import {ConfigGrid} from "components/fields/ConfigPanel";
import {config} from "config/config";
import {useLocale} from "utils/Language";

export default function SettingsPanel() {
    const locale = useLocale()
    usePageInfo(
        locale({zh: "\u8a2d\u7f6e", en: "Settings"})
    )

    return (
        <div style={{ paddingTop: "80px" }}>
            <SettingsConfigPanel />
        </div>
    );
}

function SettingsConfigPanel() {
    const appSettings = useContext(SettingsContext);
    const [saved, setSaved] = useState(false);

    const options = useMemo(
        () => config.settings({
            language: appSettings.language,
        }),
        [appSettings.language]
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
