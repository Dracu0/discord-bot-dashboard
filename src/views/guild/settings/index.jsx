import React, {useContext, useMemo, useState, useCallback} from "react";
import { Settings2 } from "lucide-react";
import {usePageInfo} from "contexts/PageInfoContext";
import {SettingsContext} from "../../../contexts/SettingsContext";
import {ConfigGrid} from "components/fields/ConfigPanel";
import {config} from "config/config";
import {useLocale, Locale} from "utils/Language";
import PageContainer from "components/layout/PageContainer";
import PageHeader from "components/layout/PageHeader";
import PageSection from "components/layout/PageSection";

export default function SettingsPanel() {
    const locale = useLocale();
    usePageInfo(
        locale({zh: "設置", en: "Settings"})
    );

    return (
        <PageContainer>
            <PageHeader
                icon={<Settings2 size={24} />}
                title={<Locale zh="設定" en="Settings" />}
                description={<Locale zh="調整儀表板語言與體驗偏好，讓每次管理都更順手。" en="Personalize the dashboard experience with language and interface preferences that stick across sessions." />}
            />
            <PageSection
                title={<Locale zh="偏好設定" en="Preferences" />}
                description={<Locale zh="更新介面語言與其他個人化設定。" en="Update your display language and other dashboard preferences." />}
            >
                <SettingsConfigPanel />
            </PageSection>
        </PageContainer>
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
    );

    const onSave = useCallback((changes) => {
        const updates = {};
        for (const [key, value] of changes) {
            updates[key] = value;
        }
        appSettings.updateSettings(updates);
        return Promise.resolve(updates);
    }, [appSettings]);

    const onSaved = useCallback(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
    }, []);

    return (
        <ConfigGrid options={options} onSave={onSave} onSaved={onSaved} />
    );
}
