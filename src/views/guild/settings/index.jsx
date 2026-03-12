import React, {useContext, useMemo, useCallback} from "react";
import { LayoutPanelTop, MonitorCog, Palette, Settings2, Sidebar } from "lucide-react";
import {usePageInfo} from "contexts/PageInfoContext";
import {SettingsContext} from "../../../contexts/SettingsContext";
import {ConfigGrid} from "components/fields/ConfigPanel";
import {config} from "config/config";
import {useLocale, Locale} from "utils/Language";
import PageContainer from "components/layout/PageContainer";
import PageHeader from "components/layout/PageHeader";
import PageSection from "components/layout/PageSection";
import Card from "components/card/Card";
import MetricCard from "components/card/MetricCard";
import { Badge } from "components/ui/badge";

const THEME_LABELS = {
    system: { zh: "跟隨系統", en: "Match system" },
    light: { zh: "淺色", en: "Light" },
    dark: { zh: "深色", en: "Dark" },
};

const ACCENT_LABELS = {
    brand: { zh: "品牌紫", en: "Brand violet" },
    blue: { zh: "藍色", en: "Blue" },
    teal: { zh: "青綠", en: "Teal" },
    green: { zh: "綠色", en: "Green" },
    orange: { zh: "橘色", en: "Orange" },
    pink: { zh: "粉色", en: "Pink" },
};

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
                description={<Locale zh="管理語言、主題與工作區偏好。" en="Manage language, theme, and workspace preferences." />}
                meta={<SettingsHeaderMeta />}
            />
            <PageSection
                title={<Locale zh="體驗概覽" en="Experience overview" />}
                description={<Locale zh="目前介面設定摘要。" en="Current interface configuration summary." />}
            >
                <SettingsOverview />
            </PageSection>
            <PageSection
                title={<Locale zh="工作區偏好" en="Workspace preferences" />}
                description={<Locale zh="更新外觀與操作偏好。" en="Update appearance and behavior preferences." />}
            >
                <SettingsConfigPanel />
            </PageSection>
            <PageSection
                title={<Locale zh="設定提示" en="Settings guidance" />}
                description={<Locale zh="常用設定建議。" en="Recommended setting adjustments." />}
            >
                <SettingsGuidance />
            </PageSection>
        </PageContainer>
    );
}

function SettingsConfigPanel() {
    const appSettings = useContext(SettingsContext);

    const options = useMemo(
        () => config.settings({
            language: appSettings.language,
            colorScheme: appSettings.colorScheme,
            accentColor: appSettings.accentColor,
            sidebarCollapsed: appSettings.sidebarCollapsed,
        }),
        [appSettings.accentColor, appSettings.colorScheme, appSettings.language, appSettings.sidebarCollapsed]
    );

    const onSave = useCallback((changes) => {
        const updates = {};
        for (const [key, value] of changes) {
            updates[key] = value;
        }
        appSettings.updateSettings(updates);
        return Promise.resolve(updates);
    }, [appSettings]);

    const onSaved = useCallback(() => {}, []);

    return (
        <div className="space-y-4">
            <ConfigGrid options={options} onSave={onSave} onSaved={onSaved} />
        </div>
    );
}

function SettingsHeaderMeta() {
    const appSettings = useContext(SettingsContext);
    const locale = useLocale();

    return (
        <>
            <Badge variant="secondary">{locale({ zh: `語言 · ${appSettings.language === "zh" ? "中文" : "English"}`, en: `Language · ${appSettings.language === "zh" ? "Chinese" : "English"}` })}</Badge>
            <Badge variant="secondary">{locale({ zh: `主題 · ${locale(THEME_LABELS[appSettings.colorScheme] || THEME_LABELS.system)}`, en: `Theme · ${locale(THEME_LABELS[appSettings.colorScheme] || THEME_LABELS.system)}` })}</Badge>
            <Badge variant="secondary">{locale({ zh: `側欄 · ${appSettings.sidebarCollapsed ? "精簡" : "展開"}`, en: `Sidebar · ${appSettings.sidebarCollapsed ? "Compact" : "Expanded"}` })}</Badge>
        </>
    );
}

function SettingsOverview() {
    const appSettings = useContext(SettingsContext);
    const locale = useLocale();

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <OverviewCard
                icon={<MonitorCog className="h-5 w-5" />}
                label={<Locale zh="顯示主題" en="Display theme" />}
                value={locale(THEME_LABELS[appSettings.colorScheme] || THEME_LABELS.system)}
                detail={<Locale zh="亮色、暗色或跟隨系統。" en="Set light, dark, or system mode." />}
            />
            <OverviewCard
                icon={<Palette className="h-5 w-5" />}
                label={<Locale zh="強調色" en="Accent color" />}
                value={locale(ACCENT_LABELS[appSettings.accentColor] || ACCENT_LABELS.brand)}
                detail={<Locale zh="套用主要操作與焦點樣式。" en="Used for primary actions and focus states." />}
            />
            <OverviewCard
                icon={<Sidebar className="h-5 w-5" />}
                label={<Locale zh="側欄模式" en="Sidebar mode" />}
                value={locale(appSettings.sidebarCollapsed ? { zh: "預設精簡", en: "Compact by default" } : { zh: "預設展開", en: "Expanded by default" })}
                detail={<Locale zh="設定預設精簡或展開導覽。" en="Set compact or expanded navigation by default." />}
            />
            <OverviewCard
                icon={<LayoutPanelTop className="h-5 w-5" />}
                label={<Locale zh="介面語言" en="Interface language" />}
                value={appSettings.language === "zh" ? "中文" : "English"}
                detail={<Locale zh="切換介面語言。" en="Change dashboard language." />}
            />
        </div>
    );
}

function OverviewCard({ icon, label, value, detail }) {
    return (
        <MetricCard
            icon={icon}
            label={label}
            value={value}
            detail={detail}
            variant="interactive"
            iconContainerClassName="border border-(--accent-primary)/15 bg-(--accent-primary)/10"
            detailClassName="mt-0.5"
        />
    );
}

function SettingsGuidance() {
    return (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <Card variant="panel" className="p-5">
                <div className="space-y-4">
                    <div>
                        <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-(--text-primary)">
                            <Locale zh="建議的第一步" en="Recommended first tweaks" />
                        </h3>
                        <p className="mt-1 text-sm leading-6 text-(--text-secondary)">
                            <Locale zh="先完成這三項即可快速校正工作區。" en="Start with these three settings for a quick baseline." />
                        </p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                        <GuidanceTile
                            title={<Locale zh="主題" en="Theme" />}
                            description={<Locale zh="先設定符合環境的亮暗模式。" en="Match theme to your workspace lighting." />}
                        />
                        <GuidanceTile
                            title={<Locale zh="強調色" en="Accent" />}
                            description={<Locale zh="設定主要操作色彩。" en="Set the color for primary actions." />}
                        />
                        <GuidanceTile
                            title={<Locale zh="側欄模式" en="Sidebar" />}
                            description={<Locale zh="小螢幕建議使用精簡側欄。" en="Use compact sidebar on smaller screens." />}
                        />
                    </div>
                </div>
            </Card>
            <Card variant="default" className="p-5 md:p-6">
                <div className="space-y-3">
                    <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-(--text-primary)">
                        <Locale zh="同步與儲存" en="Sync & persistence" />
                    </h3>
                    <ul className="space-y-2 text-sm leading-6 text-(--text-secondary)">
                        <li><Locale zh="變更會立即套用，並同步到帳號偏好。" en="Changes apply immediately and sync to account settings." /></li>
                        <li><Locale zh="已儲存設定可在可用時跨裝置同步。" en="Saved settings sync across devices when available." /></li>
                        <li><Locale zh="可用底部儲存列進行復原、重做、儲存或捨棄。" en="Use the save bar to undo, redo, save, or discard changes." /></li>
                    </ul>
                </div>
            </Card>
        </div>
    );
}

function GuidanceTile({ title, description }) {
    return (
        <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-primary) p-4">
            <p className="font-['Space_Grotesk'] text-base font-semibold text-(--text-primary)">{title}</p>
            <p className="mt-2 text-sm leading-6 text-(--text-secondary)">{description}</p>
        </div>
    );
}
