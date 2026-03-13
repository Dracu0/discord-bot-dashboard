import { useContext, useMemo, useState } from "react";
import {
    Activity,
    BellRing,
    CheckCircle2,
    Clock3,
    Gauge,
    LayoutDashboard,
    MessageSquareWarning,
    Settings,
    ShieldAlert,
    Sparkles,
    Trophy,
    Users,
    Wifi,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { usePageInfo } from "../../../contexts/PageInfoContext";
import { GuildDetailContext, ServerDetailProvider } from "../../../contexts/guild/GuildDetailContext";
import { getServerAdvancedDetails } from "api/internal";
import { GuildContext } from "contexts/guild/GuildContext";
import { FeaturesContext } from "contexts/FeaturesContext";
import { useLocale, Locale } from "utils/Language";
import { UserDataContext } from "contexts/UserDataContext";
import NotificationFeed from "components/card/NotificationFeed";
import BotStatusIndicator from "components/card/BotStatusIndicator";
import QuickActions from "components/card/QuickActions";
import OnboardingWizard from "components/card/OnboardingWizard";
import ActiveUsers from "components/card/ActiveUsers";
import PageContainer from "components/layout/PageContainer";
import PageHeader from "components/layout/PageHeader";
import Card from "components/card/Card";
import LeaderboardTable from "components/card/data/LeaderboardTable";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { toTitleLabel } from "./utils";
import InsightMetricCard from "./components/InsightMetricCard";
import HealthListItem from "./components/HealthListItem";
import MissionSignal from "./components/MissionSignal";
import DashboardActionHint from "./components/DashboardActionHint";
import RecentModActionsPanel from "./components/RecentModActionsPanel";

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

    const onlineMembers = detail?.online || 0;
    const totalMembers = detail?.members || 0;
    const onlineRatio = totalMembers ? Math.round((onlineMembers / totalMembers) * 100) : 0;
    const enabledSystems = [detail?.welcomeEnabled, detail?.xpEnabled, detail?.suggestionsEnabled, detail?.modLogEnabled].filter(Boolean).length;
    const setupCompletion = Math.round((enabledSystems / 4) * 100);
    const pendingSuggestions = advanced?.suggestions?.pending || 0;
    const totalSuggestions = advanced?.suggestions?.total || 0;
    const recentActions = advanced?.moderation?.recentActions || [];
    const leaderboard = advanced?.xp?.leaderboard || [];
    const trackedXpUsers = advanced?.xp?.totalTrackedUsers || 0;
    const totalModerationActions = advanced?.moderation?.totalActions || 0;
    const queuePressure = totalSuggestions > 0 ? Math.round((pendingSuggestions / totalSuggestions) * 100) : 0;
    const enabledFeatureLabels = useMemo(
        () => enabledFeatures.slice(0, 6).map(toTitleLabel),
        [enabledFeatures],
    );
    const hiddenFeatureCount = Math.max(enabledFeatures.length - enabledFeatureLabels.length, 0);
    const activeModerators = useMemo(
        () => new Set(recentActions.map((action) => action?.moderatorId).filter(Boolean)).size,
        [recentActions],
    );
    const latestModerationAt = useMemo(() => {
        const timestamps = recentActions
            .map((action) => new Date(action?.createdAt || 0).getTime())
            .filter(Number.isFinite)
            .filter((value) => value > 0);

        return timestamps.length > 0 ? Math.max(...timestamps) : null;
    }, [recentActions]);
    const latestEventLabel = useMemo(() => {
        if (!latestModerationAt) return "No recent event";
        return new Date(latestModerationAt).toLocaleString();
    }, [latestModerationAt]);
    const queueState = pendingSuggestions > 0 ? "Backlog" : "Stable";
    const queueStateTone = pendingSuggestions > 0 ? "warning" : "success";

    const healthItems = [
        {
            id: "welcome",
            title: <Locale zh="歡迎流程" en="Welcome flow" />,
            value: detail?.welcomeEnabled ? <Locale zh="已啟用" en="Enabled" /> : <Locale zh="尚未設定" en="Needs setup" />,
            tone: detail?.welcomeEnabled ? "success" : "warning",
            helper: detail?.welcomeEnabled
                ? <Locale zh="歡迎流程已啟用。" en="Welcome flow is active." />
                : <Locale zh="請設定歡迎頻道與訊息。" en="Set a welcome channel and message." />,
        },
        {
            id: "xp",
            title: <Locale zh="XP 系統" en="XP system" />,
            value: detail?.xpEnabled ? <Locale zh="已啟用" en="Enabled" /> : <Locale zh="已停用" en="Disabled" />,
            tone: detail?.xpEnabled ? "success" : "neutral",
            helper: detail?.xpEnabled
                ? <Locale zh={`目前追蹤 ${trackedXpUsers} 位成員`} en={`Tracking ${trackedXpUsers} members`} />
                : <Locale zh="XP 尚未開始累積資料。" en="XP is not collecting data yet." />,
        },
        {
            id: "suggestions",
            title: <Locale zh="建議審核" en="Suggestion review" />,
            value: pendingSuggestions > 0
                ? <Locale zh={`待處理 ${pendingSuggestions} 筆`} en={`${pendingSuggestions} pending`} />
                : <Locale zh="沒有待處理項目" en="Queue clear" />,
            tone: pendingSuggestions > 0 ? "warning" : "success",
            helper: pendingSuggestions > 0
                ? <Locale zh="有待審項目。" en="Pending items require review." />
                : <Locale zh="目前沒有待審建議。" en="No pending suggestions." />,
        },
        {
            id: "coverage",
            title: <Locale zh="模組覆蓋率" en="System coverage" />,
            value: <Locale zh={`已啟用 ${enabledSystems}/4`} en={`${enabledSystems}/4 enabled`} />,
            tone: enabledSystems >= 3 ? "success" : "neutral",
            helper: <Locale zh="核心模組啟用狀態。" en="Core module coverage." />,
        },
    ];

    const focusItems = [
        pendingSuggestions > 0
            ? {
                id: "queue",
                to: `/guild/${serverId}/actions`,
                icon: <BellRing className="h-4.5 w-4.5" />,
                title: <Locale zh="優先清理建議佇列" en="Clear the suggestion queue" />,
                description: <Locale zh={`目前有 ${pendingSuggestions} 筆待審建議。`} en={`${pendingSuggestions} suggestions are pending review.`} />,
                badge: <Locale zh="待處理" en="Pending" />,
                tone: "warning",
            }
            : {
                id: "queue-clear",
                to: `/guild/${serverId}/actions`,
                icon: <CheckCircle2 className="h-4.5 w-4.5" />,
                title: <Locale zh="審核隊列正常" en="Suggestion queue normal" />,
                description: <Locale zh="目前沒有待審建議。" en="No pending suggestions." />,
                badge: <Locale zh="正常" en="Normal" />,
                tone: "success",
            },
        !detail?.welcomeEnabled
            ? {
                id: "welcome",
                to: `/guild/${serverId}/features`,
                icon: <Sparkles className="h-4.5 w-4.5" />,
                title: <Locale zh="補齊新成員體驗" en="Finish new-member onboarding" />,
                description: <Locale zh="歡迎流程尚未完成。" en="Welcome flow is incomplete." />,
                badge: <Locale zh="待設定" en="Config" />,
                tone: "warning",
            }
            : {
                id: "xp",
                to: `/guild/${serverId}/leaderboard`,
                icon: <Trophy className="h-4.5 w-4.5" />,
                title: <Locale zh="檢查 XP 活動" en="Review XP activity" />,
                description: trackedXpUsers > 0
                    ? <Locale zh={`目前追蹤 ${trackedXpUsers} 位 XP 成員。`} en={`${trackedXpUsers} members are tracked by XP.`} />
                    : <Locale zh="XP 資料不足。" en="XP data is limited." />,
                badge: <Locale zh="XP" en="XP" />,
                tone: "neutral",
            },
        !detail?.modLogEnabled
            ? {
                id: "modlog",
                to: `/guild/${serverId}/features`,
                icon: <ShieldAlert className="h-4.5 w-4.5" />,
                title: <Locale zh="啟用管理紀錄" en="Turn on moderation logging" />,
                description: <Locale zh="管理紀錄目前未啟用。" en="Moderation logging is disabled." />,
                badge: <Locale zh="可選" en="Optional" />,
                tone: "warning",
            }
            : {
                id: "audit",
                to: `/guild/${serverId}/audit-log`,
                icon: <Clock3 className="h-4.5 w-4.5" />,
                title: <Locale zh="回顧近期變更" en="Audit recent changes" />,
                description: <Locale zh="檢查最近的審計與管理紀錄。" en="Review recent audit and moderation events." />,
                badge: <Locale zh="審計" en="Audit" />,
                tone: "neutral",
            },
        {
            id: "settings",
            to: `/guild/${serverId}/settings`,
            icon: <Settings className="h-4.5 w-4.5" />,
            title: <Locale zh="同步基礎偏好設定" en="Review core preferences" />,
            description: <Locale zh="檢查語言與介面偏好。" en="Review language and interface preferences." />,
            badge: <Locale zh="設定" en="Config" />,
            tone: "neutral",
        },
    ];

    const attentionCount = focusItems.filter((item) => item.tone === "warning").length;

    return (
        <PageContainer size="full" className="max-w-screen-2xl">
            <PageHeader
                icon={<LayoutDashboard size={24} />}
                title={
                    user
                        ? <Locale zh={`使用者：${user.username}`} en={`User: ${user.username}`} />
                        : <Locale zh="伺服器儀表板" en="Server Dashboard" />
                }
                description={<Locale zh="查看系統健康、待處理項目、捷徑與近期活動。" en="Monitor system health, pending work, shortcuts, and recent activity." />}
                meta={<>
                    <span><Locale zh="營運版面" en="Operational layout" /></span>
                    <span className="h-1 w-1 rounded-full bg-(--text-muted)" />
                    <span><Locale zh="關鍵指標" en="Key metrics" /></span>
                </>}
                actions={<>
                    <ActiveUsers guildId={serverId} page="Dashboard" />
                    <BotStatusIndicator />
                </>}
            />

            <Card variant="panel" className="mb-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="font-['Space_Grotesk'] text-lg font-semibold text-(--text-primary)">
                            <Locale zh="即時狀態" en="Live status" />
                        </h2>
                        <p className="mt-1 text-sm leading-6 text-(--text-secondary)">
                            <Locale zh="顯示目前營運狀態與最近事件時間。" en="Current operational state and latest event timing." />
                        </p>
                    </div>
                    <Badge variant={queueStateTone}>{queueState}</Badge>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-primary) p-3.5">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--text-muted)">
                            <Activity className="h-4 w-4" />
                            <Locale zh="管理事件總數" en="Total mod events" />
                        </div>
                        <p className="mt-2 font-['Space_Grotesk'] text-2xl font-semibold text-(--text-primary)">{totalModerationActions}</p>
                    </div>

                    <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-primary) p-3.5">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--text-muted)">
                            <BellRing className="h-4 w-4" />
                            <Locale zh="待審建議" en="Pending queue" />
                        </div>
                        <p className="mt-2 font-['Space_Grotesk'] text-2xl font-semibold text-(--text-primary)">{pendingSuggestions}</p>
                    </div>

                    <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-primary) p-3.5">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--text-muted)">
                            <Users className="h-4 w-4" />
                            <Locale zh="活躍管理員" en="Active moderators" />
                        </div>
                        <p className="mt-2 font-['Space_Grotesk'] text-2xl font-semibold text-(--text-primary)">{activeModerators}</p>
                    </div>

                    <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-primary) p-3.5">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-(--text-muted)">
                            <Clock3 className="h-4 w-4" />
                            <Locale zh="最近事件" en="Latest event" />
                        </div>
                        <p className="mt-2 text-sm font-semibold text-(--text-primary)">{latestEventLabel}</p>
                    </div>
                </div>
            </Card>

            {!wizardDismissed && enabledFeatures.length === 0 && featuresQuery?.data && (
                <OnboardingWizard
                    enabledFeatures={enabledFeatures}
                    onDismiss={() => setWizardDismissed(true)}
                />
            )}

            <Card variant="panel" className="overflow-hidden">
                <div className="space-y-6">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0 space-y-3">
                            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
                                <Locale zh="任務總覽" en="Operations overview" />
                            </Badge>
                            <div className="space-y-2">
                                <h2 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-(--text-primary) md:text-[32px]">
                                    <Locale zh="營運摘要" en="Operations summary" />
                                </h2>
                                <p className="max-w-4xl text-sm leading-6 text-(--text-secondary) md:text-[15px]">
                                    <Locale zh="顯示成員數、在線率、核心模組狀態與建議佇列比例。" en="View member count, online rate, core module status, and suggestion queue ratio." />
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 flex-wrap gap-2">
                            <Button asChild size="sm">
                                <Link to={`/guild/${serverId}/features`}>
                                    <Locale zh="管理功能" en="Manage features" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link to={`/guild/${serverId}/actions`}>
                                    <Locale zh="查看隊列" en="Open queue" />
                                </Link>
                            </Button>
                            <Button asChild variant="ghost" size="sm">
                                <Link to={`/guild/${serverId}/settings`}>
                                    <Locale zh="伺服器設定" en="Server settings" />
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <InsightMetricCard
                            icon={<Users className="h-5 w-5" />}
                            label={<Locale zh="成員總數" en="Total members" />}
                            value={totalMembers}
                            helper={<Locale zh={`${onlineMembers} 位在線`} en={`${onlineMembers} online`} />}
                            tone="default"
                        />
                        <InsightMetricCard
                            icon={<Wifi className="h-5 w-5" />}
                            label={<Locale zh="在線比例" en="Presence rate" />}
                            value={`${onlineRatio}%`}
                            helper={<Locale zh="由在線成員數計算" en="Calculated from active member count" />}
                            tone="accent"
                        />
                        <InsightMetricCard
                            icon={<Sparkles className="h-5 w-5" />}
                            label={<Locale zh="核心模組啟用" en="Core systems enabled" />}
                            value={`${enabledSystems}/4`}
                            helper={<Locale zh="歡迎、XP、建議與管理紀錄" en="Welcome, XP, suggestions, and moderation log" />}
                            tone="success"
                        />
                        <InsightMetricCard
                            icon={<MessageSquareWarning className="h-5 w-5" />}
                            label={<Locale zh="待處理建議" en="Pending suggestions" />}
                            value={pendingSuggestions}
                            helper={<Locale zh="需要審核的建議數量" en="Suggestions waiting for review" />}
                            tone={pendingSuggestions > 0 ? "warning" : "default"}
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                        <Card className="rounded-[26px] border-(--border-subtle) bg-(--surface-primary) p-4.5 shadow-(--shadow-xs)">
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--text-muted)">
                                        <Locale zh="即時訊號" en="Live signals" />
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-(--text-secondary)">
                                        <Locale zh="三個即時系統指標。" en="Three real-time system metrics." />
                                    </p>
                                </div>
                                <Gauge className="mt-0.5 h-5 w-5 text-(--accent-primary)" />
                            </div>

                            <div className="space-y-3.5">
                                <MissionSignal
                                    label={<Locale zh="在線覆蓋" en="Presence coverage" />}
                                    value={`${onlineRatio}%`}
                                    helper={<Locale zh="目前在線成員占比" en="Share of members currently online" />}
                                    progress={onlineRatio}
                                    tone="accent"
                                />
                                <MissionSignal
                                    label={<Locale zh="設置完整度" en="Setup completion" />}
                                    value={`${setupCompletion}%`}
                                    helper={<Locale zh="核心模組啟用比例" en="Core module enablement rate" />}
                                    progress={setupCompletion}
                                    tone="success"
                                />
                                <MissionSignal
                                    label={<Locale zh="隊列壓力" en="Queue pressure" />}
                                    value={totalSuggestions > 0 ? `${queuePressure}%` : "0%"}
                                    helper={<Locale zh="待審建議占全部建議的比例" en="Pending suggestions as a share of the full suggestion volume" />}
                                    progress={queuePressure}
                                    tone={pendingSuggestions > 0 ? "warning" : "default"}
                                />
                            </div>
                        </Card>

                        <Card className="rounded-[26px] border-(--border-subtle) bg-(--surface-primary) p-4.5 shadow-(--shadow-xs)">
                            <div className="mb-4 flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--text-muted)">
                                        <Locale zh="核心系統" en="Core systems" />
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-(--text-secondary)">
                                        <Locale zh="四個核心模組狀態。" en="Status of four core systems." />
                                    </p>
                                </div>
                                <Badge variant={enabledSystems >= 3 ? "success" : "secondary"}>
                                    {enabledSystems}/4
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {healthItems.map((item) => (
                                    <HealthListItem key={item.id} {...item} />
                                ))}
                            </div>
                        </Card>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,1.28fr)_minmax(280px,0.9fr)]">
                <div className="min-w-0 space-y-6">
                    <QuickActions />

                    <LeaderboardTable
                        title={<Locale zh="XP 排行榜" en="XP Leaderboard" />}
                        users={leaderboard}
                        compact
                        showViewAll
                        description={<Locale zh="顯示 XP 前段成員。" en="Displays top members by XP." />}
                    />

                    <RecentModActionsPanel
                        actions={recentActions}
                        totalActions={totalModerationActions}
                        activeModerators={activeModerators}
                        latestActionAt={latestModerationAt}
                        serverId={serverId}
                    />
                </div>

                <div className="space-y-6">
                    <Card variant="panel">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="font-['Space_Grotesk'] text-lg font-semibold text-(--text-primary)">
                                    <Locale zh="社群指標" en="Community metrics" />
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-(--text-secondary)">
                                    <Locale zh="XP 與管理負載摘要。" en="XP and moderation summary." />
                                </p>
                            </div>
                            <Badge variant="secondary">{enabledFeatures.length} <Locale zh="個已啟用功能" en="enabled features" /></Badge>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
                            <InsightMetricCard
                                icon={<Activity className="h-5 w-5" />}
                                label={<Locale zh="XP 追蹤成員" en="Tracked XP users" />}
                                value={trackedXpUsers}
                                helper={<Locale zh="由 XP 系統追蹤的成員數" en="Members tracked by the XP system" />}
                                tone="default"
                            />
                            <InsightMetricCard
                                icon={<ShieldAlert className="h-5 w-5" />}
                                label={<Locale zh="管理動作總數" en="Moderation load" />}
                                value={totalModerationActions}
                                helper={<Locale zh="已記錄的管理動作總數" en="Total recorded moderation actions" />}
                                tone="warning"
                            />
                            <InsightMetricCard
                                icon={<BellRing className="h-5 w-5" />}
                                label={<Locale zh="全部建議" en="Total suggestions" />}
                                value={totalSuggestions}
                                helper={<Locale zh="包含待審與已處理建議" en="Includes reviewed and pending submissions" />}
                                tone="accent"
                            />
                        </div>

                        <div className="mt-5 rounded-3xl border border-(--border-subtle) bg-(--surface-primary) p-4.5">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--text-muted)">
                                        <Locale zh="已啟用功能" en="Enabled features" />
                                    </p>
                                    <p className="mt-1 text-sm leading-6 text-(--text-secondary)">
                                        <Locale zh="此伺服器已啟用的功能。" en="Features enabled on this server." />
                                    </p>
                                </div>
                                <Button asChild variant="ghost" size="sm">
                                    <Link to={`/guild/${serverId}/features`}>
                                        <Locale zh="查看全部" en="View all" />
                                    </Link>
                                </Button>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {enabledFeatureLabels.length > 0 ? (
                                    <>
                                        {enabledFeatureLabels.map((label) => (
                                            <Badge key={label} variant="secondary" className="rounded-full px-3 py-1">
                                                {label}
                                            </Badge>
                                        ))}
                                        {hiddenFeatureCount > 0 && (
                                            <Badge variant="outline" className="rounded-full px-3 py-1">
                                                +{hiddenFeatureCount}
                                            </Badge>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-sm leading-6 text-(--text-secondary)">
                                        <Locale zh="尚未啟用任何功能。啟用後會顯示在此。" en="No features enabled. Enabled modules will appear here." />
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>

                    <Card variant="panel">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="font-['Space_Grotesk'] text-lg font-semibold text-(--text-primary)">
                                    <Locale zh="優先任務" en="Priority tasks" />
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-(--text-secondary)">
                                    <Locale zh="優先處理項目與入口。" en="Prioritized next actions." />
                                </p>
                            </div>
                            <Badge variant={attentionCount > 0 ? "warning" : "success"}>
                                {attentionCount > 0 ? attentionCount : 0}
                            </Badge>
                        </div>

                        <div className="mt-5 space-y-3">
                            {focusItems.map((item) => (
                                <DashboardActionHint key={item.id} {...item} />
                            ))}
                        </div>
                    </Card>

                    <NotificationFeed />
                </div>
            </div>
        </PageContainer>
    );
}
