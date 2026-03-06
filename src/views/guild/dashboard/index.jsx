import React, { useContext, useMemo, useState } from "react";
import {
    Activity,
    ArrowRight,
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

    const healthItems = [
        {
            id: "welcome",
            title: <Locale zh="歡迎流程" en="Welcome flow" />,
            value: detail?.welcomeEnabled ? <Locale zh="已啟用" en="Enabled" /> : <Locale zh="尚未設定" en="Needs setup" />,
            tone: detail?.welcomeEnabled ? "success" : "warning",
            helper: detail?.welcomeEnabled
                ? <Locale zh="新成員入站體驗已經就位。" en="New-member onboarding is already wired up." />
                : <Locale zh="尚未設定歡迎頻道或訊息。" en="A welcome channel or message still needs configuration." />,
        },
        {
            id: "xp",
            title: <Locale zh="XP 系統" en="XP system" />,
            value: detail?.xpEnabled ? <Locale zh="已啟用" en="Enabled" /> : <Locale zh="已停用" en="Disabled" />,
            tone: detail?.xpEnabled ? "success" : "neutral",
            helper: detail?.xpEnabled
                ? <Locale zh={`目前追蹤 ${trackedXpUsers} 位成員`} en={`Tracking ${trackedXpUsers} members right now`} />
                : <Locale zh="尚未讓等級系統開始累積互動。" en="Leveling is not contributing engagement signals yet." />,
        },
        {
            id: "suggestions",
            title: <Locale zh="建議審核" en="Suggestion review" />,
            value: pendingSuggestions > 0
                ? <Locale zh={`待處理 ${pendingSuggestions} 筆`} en={`${pendingSuggestions} pending`} />
                : <Locale zh="沒有待處理項目" en="Queue clear" />,
            tone: pendingSuggestions > 0 ? "warning" : "success",
            helper: pendingSuggestions > 0
                ? <Locale zh="建議隊列需要你近期處理。" en="The review queue currently needs attention." />
                : <Locale zh="目前沒有卡住的建議等待決策。" en="There are no blocked suggestions waiting on review." />,
        },
        {
            id: "coverage",
            title: <Locale zh="模組覆蓋率" en="System coverage" />,
            value: <Locale zh={`已啟用 ${enabledSystems}/4`} en={`${enabledSystems}/4 enabled`} />,
            tone: enabledSystems >= 3 ? "success" : "neutral",
            helper: <Locale zh="核心模組是否都已覆蓋到目前的營運需求。" en="Whether the core management modules cover the server’s current operating needs." />,
        },
    ];

    const focusItems = [
        pendingSuggestions > 0
            ? {
                id: "queue",
                to: `/guild/${serverId}/actions`,
                icon: <BellRing className="h-4.5 w-4.5" />,
                title: <Locale zh="優先清理建議佇列" en="Clear the suggestion queue" />,
                description: <Locale zh={`目前有 ${pendingSuggestions} 筆建議等待審核，這是最直接的待辦壓力來源。`} en={`${pendingSuggestions} suggestions are still waiting for review, making this the clearest immediate queue pressure.`} />,
                badge: <Locale zh="需要處理" en="Needs attention" />,
                tone: "warning",
            }
            : {
                id: "queue-clear",
                to: `/guild/${serverId}/actions`,
                icon: <CheckCircle2 className="h-4.5 w-4.5" />,
                title: <Locale zh="審核隊列維持清爽" en="Keep the queue clear" />,
                description: <Locale zh="目前沒有待審建議，可以把重心放在功能優化與伺服器設定。" en="There are no pending suggestions right now, so you can focus on tuning features and server settings." />,
                badge: <Locale zh="狀態良好" en="Healthy" />,
                tone: "success",
            },
        !detail?.welcomeEnabled
            ? {
                id: "welcome",
                to: `/guild/${serverId}/features`,
                icon: <Sparkles className="h-4.5 w-4.5" />,
                title: <Locale zh="補齊新成員體驗" en="Finish new-member onboarding" />,
                description: <Locale zh="歡迎流程尚未完整設定，這通常是最容易立即提升體驗的地方。" en="The welcome flow is still incomplete, which is usually the fastest way to improve first impressions." />,
                badge: <Locale zh="推薦" en="Recommended" />,
                tone: "warning",
            }
            : {
                id: "xp",
                to: `/guild/${serverId}/leaderboard`,
                icon: <Trophy className="h-4.5 w-4.5" />,
                title: <Locale zh="檢查社群互動動能" en="Review engagement momentum" />,
                description: trackedXpUsers > 0
                    ? <Locale zh={`目前有 ${trackedXpUsers} 位成員被 XP 系統追蹤，適合快速檢查排行榜變化。`} en={`${trackedXpUsers} members are currently tracked by XP, making the leaderboard a good pulse check.`} />
                    : <Locale zh="XP 目前沒有明顯資料，可能值得重新檢查等級系統設定。" en="XP does not have much data yet, which may be a sign to revisit leveling setup." />,
                badge: <Locale zh="互動" en="Engagement" />,
                tone: "neutral",
            },
        !detail?.modLogEnabled
            ? {
                id: "modlog",
                to: `/guild/${serverId}/features`,
                icon: <ShieldAlert className="h-4.5 w-4.5" />,
                title: <Locale zh="啟用管理紀錄" en="Turn on moderation logging" />,
                description: <Locale zh="少了 mod log 之後，很多管理事件在回頭追查時都會變得模糊。" en="Without mod logging, it becomes much harder to reconstruct moderation decisions later." />,
                badge: <Locale zh="可改善" en="Improve" />,
                tone: "warning",
            }
            : {
                id: "audit",
                to: `/guild/${serverId}/audit-log`,
                icon: <Clock3 className="h-4.5 w-4.5" />,
                title: <Locale zh="回顧近期變更" en="Audit recent changes" />,
                description: <Locale zh="前往審計與管理紀錄，快速確認最近是否有需要追蹤的動作。" en="Review the audit trail and moderation history to confirm whether any recent changes need follow-up." />,
                badge: <Locale zh="追蹤" en="Track" />,
                tone: "neutral",
            },
        {
            id: "settings",
            to: `/guild/${serverId}/settings`,
            icon: <Settings className="h-4.5 w-4.5" />,
            title: <Locale zh="同步基礎偏好設定" en="Review core preferences" />,
            description: <Locale zh="如果功能都已大致就位，接下來最值得看的通常是語言、偏好與伺服器基礎設定。" en="If the main systems are in decent shape, the next best stop is usually language, preferences, and other foundational settings." />,
            badge: <Locale zh="維護" en="Maintain" />,
            tone: "neutral",
        },
    ];

    const attentionCount = focusItems.filter((item) => item.tone === "warning").length;

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
            <PageHeader
                icon={<LayoutDashboard size={24} />}
                title={
                    user
                        ? <Locale zh={`歡迎回來，${user.username}`} en={`Welcome back, ${user.username}`} />
                        : <Locale zh="伺服器指揮中心" en="Server mission control" />
                }
                description={<Locale zh="重新整理後的儀表板把關鍵健康訊號、待處理項目、核心捷徑與報表壓縮進更有層次的工作視圖。" en="The refreshed dashboard packs health signals, queue pressure, core shortcuts, and detailed reports into a denser operational workspace." />}
                meta={<>
                    <span><Locale zh="任務導向版面" en="Task-first layout" /></span>
                    <span className="h-1 w-1 rounded-full bg-(--text-muted)" />
                    <span><Locale zh="讓重點內容在一個畫面內更容易找到" en="Designed to keep the most important content within one working view" /></span>
                </>}
                actions={<>
                    <ActiveUsers guildId={serverId} page="Dashboard" />
                    <BotStatusIndicator />
                </>}
            />

            {!wizardDismissed && enabledFeatures.length === 0 && featuresQuery?.data && (
                <OnboardingWizard
                    enabledFeatures={enabledFeatures}
                    onDismiss={() => setWizardDismissed(true)}
                />
            )}

            <div className="grid grid-cols-1 items-start gap-6 2xl:grid-cols-[minmax(0,1.7fr)_minmax(340px,0.95fr)]">
                <div className="min-w-0 space-y-6">
                    <Card variant="panel" className="overflow-hidden">
                        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.95fr)] xl:items-start">
                            <div className="space-y-6">
                                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                    <div className="min-w-0 space-y-3">
                                        <Badge variant="secondary" className="w-fit rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.14em]">
                                            <Locale zh="任務總覽" en="Operations overview" />
                                        </Badge>
                                        <div className="space-y-2">
                                            <h2 className="font-['Space_Grotesk'] text-2xl font-bold tracking-tight text-(--text-primary) md:text-[32px]">
                                                <Locale zh="把重要內容收進同一個工作畫面" en="Keep the important work in one view" />
                                            </h2>
                                            <p className="max-w-3xl text-sm leading-6 text-(--text-secondary) md:text-[15px]">
                                                <Locale zh="這個區塊把社群規模、在線狀態、核心模組完整度與建議佇列壓力放到最前面，讓你更快判斷下一步。" en="This surface puts community size, live presence, core-system readiness, and suggestion pressure up front so the next move is easier to spot." />
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

                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
                                    <InsightMetricCard
                                        icon={<Users className="h-5 w-5" />}
                                        label={<Locale zh="成員規模" en="Member footprint" />}
                                        value={totalMembers}
                                        helper={<Locale zh={`${onlineMembers} 位在線`} en={`${onlineMembers} currently online`} />}
                                        tone="default"
                                    />
                                    <InsightMetricCard
                                        icon={<Wifi className="h-5 w-5" />}
                                        label={<Locale zh="在線比例" en="Presence rate" />}
                                        value={`${onlineRatio}%`}
                                        helper={<Locale zh="以目前在線成員計算" en="Calculated from active members right now" />}
                                        tone="accent"
                                    />
                                    <InsightMetricCard
                                        icon={<Sparkles className="h-5 w-5" />}
                                        label={<Locale zh="核心模組就緒" en="Core system readiness" />}
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
                            </div>

                            <div className="space-y-4">
                                <Card className="rounded-[26px] border-(--border-subtle) bg-(--surface-primary) p-4.5 shadow-(--shadow-xs)">
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-(--text-muted)">
                                                <Locale zh="即時訊號" en="Live signals" />
                                            </p>
                                            <p className="mt-1 text-sm leading-6 text-(--text-secondary)">
                                                <Locale zh="用三個核心刻度快速感受目前的運作壓力。" en="Use three quick gauges to feel the current operating pressure." />
                                            </p>
                                        </div>
                                        <Gauge className="mt-0.5 h-5 w-5 text-(--accent-primary)" />
                                    </div>

                                    <div className="space-y-3.5">
                                        <MissionSignal
                                            label={<Locale zh="在線覆蓋" en="Presence coverage" />}
                                            value={`${onlineRatio}%`}
                                            helper={<Locale zh="成員目前的在線比例" en="How much of the server is currently active" />}
                                            progress={onlineRatio}
                                            tone="accent"
                                        />
                                        <MissionSignal
                                            label={<Locale zh="設置完整度" en="Setup completion" />}
                                            value={`${setupCompletion}%`}
                                            helper={<Locale zh="核心模組完成情況" en="How complete the core setup currently feels" />}
                                            progress={setupCompletion}
                                            tone="success"
                                        />
                                        <MissionSignal
                                            label={<Locale zh="隊列壓力" en="Queue pressure" />}
                                            value={totalSuggestions > 0 ? `${queuePressure}%` : <Locale zh="清爽" en="Clear" />}
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
                                                <Locale zh="這些是最直接影響伺服器日常體驗的四個關鍵區塊。" en="These four areas have the clearest impact on day-to-day server operations." />
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

                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
                        <QuickActions />

                        <Card variant="panel" className="h-full">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="font-['Space_Grotesk'] text-lg font-semibold text-(--text-primary)">
                                        <Locale zh="社群脈動" en="Community pulse" />
                                    </h2>
                                    <p className="mt-1 text-sm leading-6 text-(--text-secondary)">
                                        <Locale zh="把目前最能反映互動與管理負載的三個數字放在同一張卡裡。" en="Keep the three clearest signals of engagement and moderation load inside one compact card." />
                                    </p>
                                </div>
                                <Badge variant="secondary">{enabledFeatures.length} <Locale zh="個已啟用功能" en="live features" /></Badge>
                            </div>

                            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                                <InsightMetricCard
                                    icon={<Activity className="h-5 w-5" />}
                                    label={<Locale zh="XP 追蹤成員" en="Tracked XP users" />}
                                    value={trackedXpUsers}
                                    helper={<Locale zh="目前參與等級系統的成員數" en="Members currently participating in leveling" />}
                                    tone="default"
                                />
                                <InsightMetricCard
                                    icon={<ShieldAlert className="h-5 w-5" />}
                                    label={<Locale zh="管理動作總數" en="Moderation load" />}
                                    value={totalModerationActions}
                                    helper={<Locale zh="已記錄的管理動作總量" en="Total moderation actions currently recorded" />}
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
                                            <Locale zh="目前已上線的功能" en="Currently live features" />
                                        </p>
                                        <p className="mt-1 text-sm leading-6 text-(--text-secondary)">
                                            <Locale zh="用這裡快速確認現在真正處於啟用狀態的功能組合。" en="Use this to quickly confirm which parts of the bot are actually active right now." />
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
                                            <Locale zh="目前尚未啟用任何功能，啟用第一個模組後這裡就會開始出現狀態。" en="No features are enabled yet. Once the first module goes live, it will appear here." />
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.03fr)_minmax(0,0.97fr)]">
                        <LeaderboardTable
                            title={<Locale zh="XP 排行榜" en="XP Leaderboard" />}
                            users={leaderboard}
                            compact
                            showViewAll
                            description={<Locale zh="互動熱度與 XP 成長節奏放在這裡，能更快看出誰正在帶動整個社群。" en="Keep engagement leaders and XP momentum visible here so it is easier to spot who is driving community activity." />}
                        />
                        <DataTable
                            name={<Locale zh="近期管理動作" en="Recent Mod Actions" />}
                            data={recentActions}
                            columns={moderationColumns}
                            description={<Locale zh="最近的警告、禁言、踢除與其他管理動作可以直接在這裡快速掃過。" en="Warns, timeouts, kicks, bans, and the rest of your recent moderation trail stay visible here for quick scanning." />}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <Card variant="panel">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h2 className="font-['Space_Grotesk'] text-lg font-semibold text-(--text-primary)">
                                    <Locale zh="焦點看板" en="Focus board" />
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-(--text-secondary)">
                                    <Locale zh="這一欄把最值得你現在處理的入口與原因直接排好，不用自己再重新判斷順序。" en="This rail lines up the most relevant next stops and explains why they deserve attention right now." />
                                </p>
                            </div>
                            <Badge variant={attentionCount > 0 ? "warning" : "success"}>
                                {attentionCount > 0 ? attentionCount : <Locale zh="良好" en="Healthy" />}
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

function HealthListItem({ title, value, tone = "neutral", helper }) {
    const toneBadge = {
        success: "success",
        warning: "warning",
        neutral: "secondary",
    };

    return (
        <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-card) px-4 py-3.5">
            <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-(--text-primary)">{title}</span>
                <Badge variant={toneBadge[tone] || "secondary"}>{value}</Badge>
            </div>
            {helper ? <p className="mt-2 text-sm leading-6 text-(--text-secondary)">{helper}</p> : null}
        </div>
    );
}

function MissionSignal({ label, value, helper, progress = 0, tone = "default" }) {
    const barTone = {
        default: "bg-[linear-gradient(90deg,var(--accent-primary),color-mix(in_srgb,var(--accent-primary)_65%,white))]",
        accent: "bg-[linear-gradient(90deg,#38bdf8,#818cf8)]",
        success: "bg-[linear-gradient(90deg,#34d399,#10b981)]",
        warning: "bg-[linear-gradient(90deg,#fb923c,#f97316)]",
    };

    return (
        <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-card) px-4 py-3.5 shadow-(--shadow-xs)">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-(--text-primary)">{label}</p>
                <span className="font-['Space_Grotesk'] text-base font-semibold text-(--text-primary)">{value}</span>
            </div>
            {helper ? <p className="mt-1.5 text-sm leading-6 text-(--text-secondary)">{helper}</p> : null}
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-(--surface-secondary)">
                <div
                    className={`h-full rounded-full ${barTone[tone] || barTone.default}`}
                    style={{ width: `${clampPercentage(progress)}%` }}
                />
            </div>
        </div>
    );
}

function DashboardActionHint({ to, icon, title, description, badge, tone = "neutral" }) {
    const iconTone = {
        neutral: "text-(--accent-primary)",
        warning: "text-orange-400",
        success: "text-emerald-400",
    };

    const badgeTone = {
        neutral: "secondary",
        warning: "warning",
        success: "success",
    };

    return (
        <Link to={to} className="block rounded-3xl border border-(--border-subtle) bg-(--surface-primary) p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-(--border-default) hover:shadow-(--shadow-sm)">
            <div className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-(--surface-secondary) ${iconTone[tone] || iconTone.neutral}`}>
                    {icon}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="font-['Space_Grotesk'] text-sm font-semibold text-(--text-primary)">{title}</h3>
                        {badge ? <Badge variant={badgeTone[tone] || "secondary"}>{badge}</Badge> : null}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-(--text-secondary)">{description}</p>
                    <div className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-(--accent-primary)">
                        <Locale zh="打開區塊" en="Open section" />
                        <ArrowRight className="h-4 w-4" />
                    </div>
                </div>
            </div>
        </Link>
    );
}

function clampPercentage(value) {
    if (!Number.isFinite(value)) return 0;
    return Math.max(0, Math.min(100, Math.round(value)));
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
