import React, {useContext, useMemo, useState, useCallback} from "react";
import { CheckCircle2, LayoutPanelTop, MonitorCog, Palette, Settings2, Sidebar } from "lucide-react";
import {usePageInfo} from "contexts/PageInfoContext";
import {SettingsContext} from "../../../contexts/SettingsContext";
import {ConfigGrid} from "components/fields/ConfigPanel";
import {config} from "config/config";
import {useLocale, Locale} from "utils/Language";
import PageContainer from "components/layout/PageContainer";
import PageHeader from "components/layout/PageHeader";
import PageSection from "components/layout/PageSection";
import Card from "components/card/Card";
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
                description={<Locale zh="調整儀表板語言與體驗偏好，讓每次管理都更順手。" en="Personalize the dashboard experience with language and interface preferences that stick across sessions." />}
                meta={<SettingsHeaderMeta />}
            />
            <PageSection
                title={<Locale zh="體驗概覽" en="Experience overview" />}
                description={<Locale zh="快速查看目前的語言、主題、側欄與品牌強調色設定。" en="Quickly review the current language, theme, sidebar behavior, and accent styling before making changes." />}
            >
                <SettingsOverview />
            </PageSection>
            <PageSection
                title={<Locale zh="工作區偏好" en="Workspace preferences" />}
                description={<Locale zh="在這裡調整外觀與操作模式，變更會自動同步到本機與帳號偏好。" en="Tune the interface style and workspace behavior here. Changes sync to local storage and your saved account preferences." />}
            >
                <SettingsConfigPanel />
            </PageSection>
            <PageSection
                title={<Locale zh="設定提示" en="Settings guidance" />}
                description={<Locale zh="一些小提醒，幫助你更快理解哪些設定最值得先調整。" en="A few practical notes to help you decide which preferences are worth adjusting first." />}
            >
                <SettingsGuidance />
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

    const onSaved = useCallback(() => {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
    }, []);

    return (
        <div className="space-y-4">
            {saved && (
                <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    <Locale zh="偏好設定已儲存。" en="Your preferences were saved." />
                </div>
            )}
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
                detail={<Locale zh="同步你的亮/暗色偏好與整體視覺氛圍。" en="Controls how the dashboard follows your light or dark viewing preference." />}
            />
            <OverviewCard
                icon={<Palette className="h-5 w-5" />}
                label={<Locale zh="強調色" en="Accent color" />}
                value={locale(ACCENT_LABELS[appSettings.accentColor] || ACCENT_LABELS.brand)}
                detail={<Locale zh="套用在按鈕、焦點狀態與重要提示上的主色調。" en="Used across call-to-action buttons, focus states, and highlight surfaces." />}
            />
            <OverviewCard
                icon={<Sidebar className="h-5 w-5" />}
                label={<Locale zh="側欄模式" en="Sidebar mode" />}
                value={locale(appSettings.sidebarCollapsed ? { zh: "預設精簡", en: "Compact by default" } : { zh: "預設展開", en: "Expanded by default" })}
                detail={<Locale zh="決定你開啟儀表板時要保留更多內容空間，或維持完整導覽。" en="Choose whether to prioritize more content space or keep the full navigation visible." />}
            />
            <OverviewCard
                icon={<LayoutPanelTop className="h-5 w-5" />}
                label={<Locale zh="介面語言" en="Interface language" />}
                value={appSettings.language === "zh" ? "中文" : "English"}
                detail={<Locale zh="切換頁面文案與系統介面語言。" en="Switch the language used across dashboard labels and helper copy." />}
            />
        </div>
    );
}

function OverviewCard({ icon, label, value, detail }) {
    return (
        <Card variant="interactive" className="h-full p-4 md:p-5">
            <div className="flex h-full flex-col gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-(--accent-primary)/15 bg-(--accent-primary)/10 text-(--accent-primary)">
                    {icon}
                </div>
                <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--text-muted)">{label}</p>
                    <p className="font-['Space_Grotesk'] text-xl font-semibold text-(--text-primary)">{value}</p>
                    <p className="text-sm leading-6 text-(--text-secondary)">{detail}</p>
                </div>
            </div>
        </Card>
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
                            <Locale zh="如果你剛完成整體 UI 更新，這三項設定最值得先微調。" en="If you are dialing in the refreshed UI, these are the three preferences most worth adjusting first." />
                        </p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-3">
                        <GuidanceTile
                            title={<Locale zh="主題" en="Theme" />}
                            description={<Locale zh="先確認亮/暗色是否和你的工作環境一致，頁面層次會更舒服。" en="Start by matching the theme to your workspace lighting so depth and contrast feel right." />}
                        />
                        <GuidanceTile
                            title={<Locale zh="強調色" en="Accent" />}
                            description={<Locale zh="更換品牌色可以立刻改變整個面板的視覺性格。" en="Changing the accent color is the fastest way to shift the personality of the interface." />}
                        />
                        <GuidanceTile
                            title={<Locale zh="側欄模式" en="Sidebar" />}
                            description={<Locale zh="若你常在小螢幕操作，精簡側欄能替內容區騰出不少空間。" en="If you work on narrower screens, a compact sidebar frees up a surprising amount of room." />}
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
                        <li><Locale zh="偏好設定會先套用到目前工作階段，再同步到帳號偏好。" en="Preference changes apply immediately in the current session, then sync back to your saved account profile." /></li>
                        <li><Locale zh="如果你切換裝置或瀏覽器，已儲存的設定仍會盡可能恢復。" en="Saved settings are designed to follow you across sessions and browsers whenever the account sync is available." /></li>
                        <li><Locale zh="任何欄位改動後都能使用底部儲存條快速復原、重做或儲存。" en="Whenever a field changes, the save bar lets you undo, redo, save, or discard without leaving the page." /></li>
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
