import React, { useContext, useMemo, useState } from "react";
import {
    Activity,
    BellRing,
    LayoutDashboard,
    MessageSquareWarning,
    ServerCog,
    ShieldAlert,
    Sparkles,
    Trophy,
    Users,
    Wifi,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { usePageInfo } from "../../../contexts/PageInfoContext";
import { GuildDetailContext, ServerDetailProvider } from "../../../contexts/guild/GuildDetailContext";
import { getServerAdvancedDetails } from "api/internal";
import { GuildContext } from "contexts/guild/GuildContext";
import { FeaturesContext } from "contexts/FeaturesContext";
import { useLocale, Locale } from "utils/Language";
import NotificationFeed from "components/card/NotificationFeed";
import { UserDataContext } from "contexts/UserDataContext";
import BotStatusIndicator from "components/card/BotStatusIndicator";
import QuickActions from "components/card/QuickActions";
import OnboardingWizard from "components/card/OnboardingWizard";
import ActiveUsers from "components/card/ActiveUsers";
import PageContainer from "components/layout/PageContainer";
import PageHeader from "components/layout/PageHeader";
import PageSection from "components/layout/PageSection";
import Card from "components/card/Card";
import MetricCard from "components/card/MetricCard";
import LeaderboardTable from "components/card/data/LeaderboardTable";
import DataTable from "components/card/data/DataTable";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const locale = useLocale();

    usePageInfo(locale({ zh: "儀表板", en: "Dashboard" }));

    return <ServerDetailProvider>
        <UserReports />
    </ServerDetailProvider>;
}

export function UserReports() {
    const { detail } = useContext(GuildDetailContext);
    const { enabled: enabledFeatures, query: featuresQuery } = useContext(FeaturesContext);
    const { id: serverId } = useContext(GuildContext);
    const user = useContext(UserDataContext);
    const [wizardDismissed, setWizardDismissed] = useState(false);

    const query = useQuery({
        queryKey: ["server_advanced_detail", serverId],
        queryFn: () => getServerAdvancedDetails(serverId),
        enabled: Boolean(serverId),
    });

    const advanced = query.data || {};

    const onlineRatio = detail?.members ? Math.round(((detail?.online || 0) / detail.members) * 100) : 0;
    const enabledSystems = [detail?.welcomeEnabled, detail?.xpEnabled, detail?.suggestionsEnabled, detail?.modLogEnabled].filter(Boolean).length;
    const pendingSuggestions = advanced?.suggestions?.pending || 0;
    const recentActions = advanced?.moderation?.recentActions || [];
    const leaderboard = advanced?.xp?.leaderboard || [];

    const healthItems = [
        {
            title: <Locale zh="歡迎流程" en="Welcome flow" />,
            value: detail?.welcomeEnabled ? <Locale zh="已啟用" en="Enabled" /> : <Locale zh="尚未設定" en="Needs setup" />,
            tone: detail?.welcomeEnabled ? "success" : "warning",
        },
        {
            title: <Locale zh="XP 系統" en="XP system" />,
            value: detail?.xpEnabled ? <Locale zh="已啟用" en="Enabled" /> : <Locale zh="已停用" en="Disabled" />,
            tone: detail?.xpEnabled ? "success" : "neutral",
        },
        {
            title: <Locale zh="建議審核" en="Suggestion review" />,
            value: pendingSuggestions > 0
                ? <Locale zh={`待處理 ${pendingSuggestions} 筆`} en={`${pendingSuggestions} pending`} />
                : <Locale zh="沒有待處理項目" en="Queue clear" />,
            tone: pendingSuggestions > 0 ? "warning" : "success",
        },
        {
            title: <Locale zh="模組覆蓋率" en="System coverage" />,
            value: <Locale zh={`已啟用 ${enabledSystems}/4`} en={`${enabledSystems}/4 enabled`} />,
            tone: enabledSystems >= 3 ? "success" : "neutral",
        },
    ];

    const moderationColumns = [
        {
            header: "Action",
            accessor: "action",
            wrapper: (value) => (
                <span className="inline-flex items-center rounded-full bg-(--accent-primary)/10 px-2.5 py-1 text-xs font-semibold text-(--accent-primary)">
                    {toTitleLabel(value) || "—"}
                </span>
            ),
        },
        {
            header: "Target",
            accessor: "targetId",
            wrapper: (value) => <ModerationIdCell value={value} label="User ID" />,
        },
        {
            header: "Moderator",
            accessor: "moderatorId",
            wrapper: (value) => <ModerationIdCell value={value} label="Moderator" />,
        },
        {
            header: "Reason",
            accessor: "reason",
            wrapper: (value) => (
                <div className="max-w-56">
                    <span className="block line-clamp-2 text-sm font-medium text-(--text-primary)">{value || "No reason provided"}</span>
                </div>
            ),
        },
        {
            header: "Date",
            accessor: "createdAt",
            wrapper: (value) => (
                <div className="min-w-28">
                    <span className="block text-sm font-medium text-(--text-primary)">
                        {value ? new Date(value).toLocaleDateString() : "—"}
                    </span>
                    <span className="block text-xs text-(--text-muted)">
                        {value ? new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                    </span>
                </div>
            ),
        },
    ];

    return (
        <PageContainer>
            {user && (
                <PageHeader
                    icon={<LayoutDashboard size={24} />}
                    title={<Locale zh={`歡迎回來，${user.username}`} en={`Welcome back, ${user.username}`} />}
                    description={<Locale zh="集中查看伺服器狀態、近期活動與常用操作，讓日常管理更俐落。" en="Keep tabs on server health, recent activity, and the controls you use most in one polished overview." />}
                    meta={<>
                        <span><Locale zh="即時總覽" en="Live overview" /></span>
                        <span className="h-1 w-1 rounded-full bg-(--text-muted)" />
                        <span><Locale zh="快速掌握伺服器狀態與待辦事項" en="See health, queue pressure, and next actions at a glance" /></span>
                    </>}
                    actions={<>
                        <ActiveUsers guildId={serverId} page="Dashboard" />
                        <BotStatusIndicator />
                    </>}
                />
            )}

            {!wizardDismissed && enabledFeatures.length === 0 && featuresQuery?.data && (
                <OnboardingWizard
                    enabledFeatures={enabledFeatures}
                    onDismiss={() => setWizardDismissed(true)}
                />
            )}

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="xl:col-span-7">
                    <PageSection
                        title={<Locale zh="指揮中心" en="Command Center" />}
                        description={<Locale zh="快速前往最常用的管理區塊，並在同一處理清目前的優先事項。" en="Jump into the tools you use most and keep the current priorities visible in one focused workspace." />}
                        className="rounded-[30px] border border-(--border-subtle) bg-(--surface-card) px-5 py-5 shadow-(--shadow-sm) md:px-6 md:py-6"
                        contentClassName="space-y-0"
                    >
                        <QuickActions />
                    </PageSection>
                </div>
                <div className="xl:col-span-5">
                    <NotificationFeed />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                <div className="space-y-6 xl:col-span-8">
                    <PageSection
                        title={<Locale zh="整體狀態" en="At-a-glance status" />}
                        description={<Locale zh="用更清楚的摘要來掌握成員活躍度、功能覆蓋率與目前的待辦壓力。" en="Track activity, feature coverage, and queue pressure with a clearer executive summary." />}
                    >
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <InsightMetricCard
                                icon={<Users className="h-5 w-5" />}
                                label={<Locale zh="成員規模" en="Member footprint" />}
                                value={detail?.members || 0}
                                helper={<Locale zh={`${detail?.online || 0} 位在線`} en={`${detail?.online || 0} currently online`} />}
                                tone="default"
                            />
                            <InsightMetricCard
                                icon={<Wifi className="h-5 w-5" />}
                                label={<Locale zh="在線比例" en="Presence rate" />}
                                value={`${onlineRatio}%`}
                                helper={<Locale zh="根據目前在線成員估算" en="Based on currently active members" />}
                                tone="accent"
                            />
                            <InsightMetricCard
                                icon={<Sparkles className="h-5 w-5" />}
                                label={<Locale zh="已啟用系統" en="Enabled systems" />}
                                value={`${enabledSystems}/4`}
                                helper={<Locale zh="歡迎、XP、建議、模組紀錄" en="Welcome, XP, suggestions, and mod log" />}
                                tone="success"
                            />
                            <InsightMetricCard
                                icon={<MessageSquareWarning className="h-5 w-5" />}
                                label={<Locale zh="待審項目" en="Review queue" />}
                                value={pendingSuggestions}
                                helper={<Locale zh="建議系統待處理數量" en="Pending suggestions awaiting action" />}
                                tone={pendingSuggestions > 0 ? "warning" : "default"}
                            />
                        </div>
                    </PageSection>

                    <PageSection
                        title={<Locale zh="服務健康" en="Service health" />}
                        description={<Locale zh="快速查看核心模組目前是否正常啟用，以及哪裡可能需要你優先調整。" en="See which core systems are already running well and where the dashboard is signaling you to take action next." />}
                    >
                        <Card variant="panel">
                            <div className="mb-5 flex items-start justify-between gap-4">
                                <div>
                                    <h3 className="font-['Space_Grotesk'] text-lg font-semibold text-(--text-primary)">
                                        <Locale zh="伺服器健康面板" en="Server health board" />
                                    </h3>
                                    <p className="mt-1 text-sm leading-6 text-(--text-secondary)">
                                        <Locale zh="這些指標反映出功能開啟狀態、審核壓力與整體配置完整度。" en="These indicators summarize system readiness, moderation pressure, and overall setup completeness." />
                                    </p>
                                </div>
                                <Badge variant="secondary" className="shrink-0">
                                    <Locale zh="即時摘要" en="Live summary" />
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {healthItems.map((item, index) => (
                                    <HealthListItem key={index} {...item} />
                                ))}
                            </div>
                        </Card>
                    </PageSection>
                </div>

                <div className="space-y-6 xl:col-span-4">
                    <PageSection
                        title={<Locale zh="下一步建議" en="Recommended next moves" />}
                        description={<Locale zh="根據目前狀態，這些入口最值得優先查看。" en="Based on the current state of your server, these are the best next places to visit." />}
                    >
                        <Card variant="panel">
                            <div className="space-y-3">
                                <DashboardActionHint
                                    to={`/guild/${serverId}/features`}
                                    icon={<ServerCog className="h-4.5 w-4.5" />}
                                    title={<Locale zh="檢查功能覆蓋率" en="Review feature coverage" />}
                                    description={<Locale zh="確認歡迎訊息、XP 與自動化模組是否都符合目前伺服器需求。" en="Confirm welcome flows, XP, and automation modules still match how your server is operating." />}
                                />
                                <DashboardActionHint
                                    to={`/guild/${serverId}/actions`}
                                    icon={<BellRing className="h-4.5 w-4.5" />}
                                    title={<Locale zh="清理審核佇列" en="Clear the action queue" />}
                                    description={<Locale zh="檢查建議與管理任務，避免待處理項目累積。" en="Check suggestions and task workflows before the review queue starts piling up." />}
                                />
                                <DashboardActionHint
                                    to={`/guild/${serverId}/leaderboard`}
                                    icon={<Trophy className="h-4.5 w-4.5" />}
                                    title={<Locale zh="查看成長動能" en="Inspect growth momentum" />}
                                    description={<Locale zh="快速看哪些成員最活躍，XP 競爭是否正在升溫。" en="See which members are leading engagement and whether your leveling pace is heating up." />}
                                />
                                <DashboardActionHint
                                    to={`/guild/${serverId}/audit-log`}
                                    icon={<ShieldAlert className="h-4.5 w-4.5" />}
                                    title={<Locale zh="稽核近期變更" en="Review recent changes" />}
                                    description={<Locale zh="前往審計日誌，檢查最近是否有重要配置或管理動作。" en="Open the audit log to verify recent configuration changes and moderator actions." />}
                                />
                            </div>
                        </Card>
                    </PageSection>

                    <PageSection
                        title={<Locale zh="活躍概況" en="Activity pulse" />}
                        description={<Locale zh="用簡潔指標追蹤最近的互動熱度與管理負載。" en="Track how engaged the server feels right now with a focused activity snapshot." />}
                    >
                        <div className="grid grid-cols-1 gap-3">
                            <InsightMetricCard
                                icon={<Activity className="h-5 w-5" />}
                                label={<Locale zh="XP 追蹤成員" en="Tracked XP users" />}
                                value={advanced?.xp?.totalTrackedUsers || 0}
                                helper={<Locale zh="目前正在參與等級系統的成員" en="Members currently participating in leveling" />}
                                tone="default"
                            />
                            <InsightMetricCard
                                icon={<ShieldAlert className="h-5 w-5" />}
                                label={<Locale zh="管理動作總數" en="Moderation load" />}
                                value={advanced?.moderation?.totalActions || 0}
                                helper={<Locale zh="近期累積的處分與管理紀錄" en="Recent moderation actions recorded by the bot" />}
                                tone="warning"
                            />
                        </div>
                    </PageSection>
                </div>
            </div>

            <PageSection
                title={<Locale zh="詳細報表" en="Detailed reports" />}
                description={<Locale zh="需要更深入時，從這裡直接切入排行榜與近期管理紀錄。" en="When you need a deeper read, use these reports to jump from summary mode into operational detail." />}
            >
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <LeaderboardTable
                        title={<Locale zh="XP 排行榜" en="XP Leaderboard" />}
                        users={leaderboard}
                        compact
                        showViewAll
                        description={<Locale zh="看看誰正帶動伺服器的互動熱度，以及排名差距是否正在縮小。" en="See who is setting the pace for engagement and how tight the leaderboard race is becoming." />}
                    />
                    <DataTable
                        name={<Locale zh="近期管理動作" en="Recent Mod Actions" />}
                        data={recentActions}
                        columns={moderationColumns}
                        description={<Locale zh="快速檢查最新的警告、禁言、踢除與其他處理紀錄。" en="Scan the latest warns, mutes, kicks, bans, and other moderation events from one cleaner table." />}
                    />
                </div>
            </PageSection>
        </PageContainer>
    );
}

function InsightMetricCard({ icon, label, value, helper, tone = "default" }) {
    return (
        <MetricCard
            icon={icon}
            label={label}
            value={value}
            detail={helper}
            tone={tone}
        />
    );
}

function HealthListItem({ title, value, tone = "neutral" }) {
    const toneBadge = {
        success: "success",
        warning: "warning",
        neutral: "secondary",
    };

    return (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-(--border-subtle) bg-(--surface-primary) px-4 py-3.5">
            <span className="text-sm font-medium text-(--text-primary)">{title}</span>
            <Badge variant={toneBadge[tone] || "secondary"}>{value}</Badge>
        </div>
    );
}

function DashboardActionHint({ to, icon, title, description }) {
    return (
        <Link to={to} className="block rounded-[22px] border border-(--border-subtle) bg-(--surface-primary) p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-(--border-default) hover:shadow-(--shadow-sm)">
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-(--surface-secondary) text-(--accent-primary)">
                    {icon}
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="font-['Space_Grotesk'] text-sm font-semibold text-(--text-primary)">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-(--text-secondary)">{description}</p>
                    <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-(--accent-primary)">
                        <Locale zh="前往檢視" en="Open section" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

function toTitleLabel(value) {
    return String(value || "")
        .replace(/[._-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function shortenDiscordId(value) {
    if (!value) return "—";
    const text = String(value);
    if (text.length <= 10) return text;
    return `${text.slice(0, 4)}…${text.slice(-4)}`;
}

function ModerationIdCell({ value, label }) {
    return (
        <div className="min-w-0 max-w-40">
            <span className="mb-1 block text-[11px] uppercase tracking-[0.12em] text-(--text-muted)">
                {label}
            </span>
            <span
                className="inline-flex items-center rounded-full bg-(--surface-secondary) px-2.5 py-1 text-sm font-semibold text-(--text-primary)"
                style={{ fontFamily: "var(--font-mono)" }}
                title={value || "—"}
            >
                {shortenDiscordId(value)}
            </span>
        </div>
    );
}
