import React, { useContext, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import { GuildContext } from "contexts/guild/GuildContext";
import { getAnalytics } from "api/internal";
import { usePageInfo } from "contexts/PageInfoContext";
import { Locale, useLocale } from "utils/Language";
import Card from "components/card/Card";
import ApexChart from "components/charts/ApexChart";
import StatCard from "components/card/data/StatCard";
import { Badge } from "components/ui/badge";
import { Spinner } from "components/ui/spinner";
import { SegmentedControl } from "components/ui/segmented-control";
import PageContainer from "components/layout/PageContainer";
import PageHeader from "components/layout/PageHeader";
import PageSection from "components/layout/PageSection";

const CHART_COLORS = {
    primary: "#0EA5E9",
    secondary: "#A3AED0",
    muted: "#CBD5E0",
};

const PERIOD_OPTIONS = [
    { value: "7", label: "7d" },
    { value: "14", label: "14d" },
    { value: "30", label: "30d" },
    { value: "90", label: "90d" },
];

function ModerationTimeline({ data = [] }) {
    const series = useMemo(() => [{
        name: "Actions",
        data: data.map((d) => ({ x: d.date, y: d.count })),
    }], [data]);

    const options = useMemo(() => ({
        chart: { toolbar: { show: false }, sparkline: { enabled: false } },
        xaxis: {
            type: "datetime",
            labels: { style: { colors: CHART_COLORS.secondary, fontSize: "12px" } },
        },
        yaxis: {
            labels: { style: { colors: CHART_COLORS.muted, fontSize: "12px" } },
            min: 0,
        },
        stroke: { curve: "smooth", width: 3 },
        colors: ["var(--accent-primary)"],
        fill: {
            type: "gradient",
            gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05, stops: [50, 100] },
        },
        grid: { strokeDashArray: 4, borderColor: "var(--border-color)" },
        tooltip: { theme: "dark", x: { format: "MMM dd" } },
        dataLabels: { enabled: false },
    }), []);

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center py-10">
                <span className="text-(--text-secondary) text-sm">
                    <Locale zh="此時段無審核記錄" en="No moderation actions in this period" />
                </span>
            </div>
        );
    }

    return <ApexChart options={options} series={series} type="area" height={280} />;
}

function ActionBreakdown({ data = [] }) {
    const series = useMemo(() => data.map((d) => d.count), [data]);
    const labels = useMemo(() => data.map((d) => d.action || "unknown"), [data]);
    const colors = [CHART_COLORS.primary, "#339AF0", "#20C997", "#FF6B6B", "#FCC419", "#FF922B"];

    const options = useMemo(() => ({
        labels,
        colors: colors.slice(0, labels.length),
        legend: { position: "bottom", labels: { colors: CHART_COLORS.secondary } },
        stroke: { width: 0 },
        tooltip: { theme: "dark" },
        dataLabels: { enabled: false },
    }), [labels]);

    if (data.length === 0) return null;

    return <ApexChart options={options} series={series} type="donut" height={260} />;
}

function LevelDistribution({ data = [] }) {
    const series = useMemo(() => [{
        name: "Users",
        data: data.map((d) => d.count),
    }], [data]);

    const categories = useMemo(() => data.map((d) => d.range), [data]);

    const options = useMemo(() => ({
        chart: { toolbar: { show: false } },
        xaxis: {
            categories,
            labels: { style: { colors: CHART_COLORS.secondary, fontSize: "12px" } },
        },
        yaxis: {
            labels: { style: { colors: CHART_COLORS.muted, fontSize: "12px" } },
        },
        colors: [CHART_COLORS.primary],
        fill: {
            type: "gradient",
            gradient: { type: "vertical", shadeIntensity: 1, opacityFrom: 0.7, opacityTo: 0.3 },
        },
        grid: { strokeDashArray: 4, borderColor: "var(--border-color)" },
        plotOptions: { bar: { borderRadius: 6, columnWidth: "45%" } },
        tooltip: { theme: "dark" },
        dataLabels: { enabled: false },
    }), [categories]);

    if (data.length === 0) return null;

    return <ApexChart options={options} series={series} type="bar" height={260} />;
}

function SuggestionFunnel({ data = [] }) {
    const statusVariants = {
        pending: "yellow",
        approved: "green",
        rejected: "red",
        "in-progress": "blue",
    };
    const total = data.reduce((s, d) => s + d.count, 0);

    if (total === 0) {
        return (
            <div className="flex items-center justify-center py-10">
                <span className="text-(--text-secondary) text-sm">
                    <Locale zh="無建議資料" en="No suggestion data" />
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {data.map((d) => (
                <div key={d.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <Badge variant={statusVariants[d.status] || "secondary"} className="text-xs">
                            {d.status}
                        </Badge>
                        <span className="text-sm text-(--text-primary)">{d.count}</span>
                    </div>
                    <span className="text-xs text-(--text-secondary)">
                        {((d.count / total) * 100).toFixed(1)}%
                    </span>
                </div>
            ))}
            <span className="mt-1.5 text-center text-xs text-(--text-secondary)">
                <Locale zh={`共 ${total} 筆建議`} en={`${total} total suggestions`} />
            </span>
        </div>
    );
}

function formatDuration(ms) {
    if (!ms) return "—";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
}

export default function Analytics() {
    const locale = useLocale();
    usePageInfo(locale({ zh: "數據分析", en: "Analytics" }));
    const { id: serverId } = useContext(GuildContext);
    const [days, setDays] = useState("30");

    const query = useQuery({
        queryKey: ["analytics", serverId, days],
        queryFn: () => getAnalytics(serverId, parseInt(days)),
        staleTime: 60_000,
    });

    if (query.isLoading) {
        return (
            <PageContainer className="flex min-h-100 items-center justify-center">
                <Spinner size="lg" />
            </PageContainer>
        );
    }

    if (query.isError) {
        return (
            <PageContainer>
                <span className="text-red-500">
                    <Locale zh="無法載入分析資料" en="Failed to load analytics data" />
                </span>
            </PageContainer>
        );
    }

    const data = query.data;
    if (!data) return null;

    return (
        <PageContainer>
            <PageHeader
                icon={<BarChart3 size={24} />}
                title={<Locale zh="數據分析" en="Analytics" />}
                description={<Locale zh="查看審核、建議、XP 與工單指標。" en="View moderation, suggestions, XP, and ticket metrics." />}
                meta={<>
                    <span><Locale zh={`最近 ${days} 天`} en={`Last ${days} days`} /></span>
                    <span className="h-1 w-1 rounded-full bg-(--text-muted)" />
                    <span><Locale zh="資料會自動刷新" en="Data refreshes automatically" /></span>
                </>}
                actions={<SegmentedControl data={PERIOD_OPTIONS} value={days} onChange={setDays} size="sm" />}
            />

            <PageSection
                title={<Locale zh="關鍵指標" en="Key Metrics" />}
                description={<Locale zh="主要統計摘要。" en="Top-line operational metrics." />}
            >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                    <StatCard
                        label={<Locale zh="審核操作" en="Mod Actions" />}
                        value={(data.moderation?.byDay || []).reduce((s, d) => s + d.count, 0)}
                        sublabel={<Locale zh={`過去 ${days} 天`} en={`Last ${days} days`} />}
                    />
                    <StatCard
                        label={<Locale zh="待處理建議" en="Pending Suggestions" />}
                        value={(data.suggestions?.byStatus || []).find((d) => d.status === "pending")?.count ?? 0}
                    />
                    <StatCard
                        label={<Locale zh="未結客服單" en="Open Tickets" />}
                        value={data.tickets?.open}
                    />
                    <StatCard
                        label={<Locale zh="平均解決時間" en="Avg Resolution" />}
                        value={formatDuration(data.tickets?.avgResolutionMs)}
                        sublabel={<Locale zh="客服單" en="Tickets" />}
                    />
                </div>
            </PageSection>

            <PageSection
                title={<Locale zh="活動與審核" en="Activity & Moderation" />}
                description={<Locale zh="審核趨勢與操作分佈。" en="Moderation trend and action distribution." />}
            >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <Card variant="panel" className="flex flex-col">
                        <span className="mb-3 text-lg font-bold text-(--text-primary)">
                            <Locale zh="審核趨勢" en="Moderation Trend" />
                        </span>
                        <ModerationTimeline data={data.moderation?.byDay || []} />
                    </Card>

                    <Card variant="panel" className="flex flex-col">
                        <span className="mb-3 text-lg font-bold text-(--text-primary)">
                            <Locale zh="操作類型分佈" en="Action Type Breakdown" />
                        </span>
                        <ActionBreakdown data={data.moderation?.byType || []} />
                    </Card>
                </div>
            </PageSection>

            <PageSection
                title={<Locale zh="成長與流程" en="Growth & Workflow" />}
                description={<Locale zh="查看等級與建議流程狀態。" en="Review leveling and suggestion pipeline status." />}
            >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <Card variant="panel" className="flex flex-col">
                        <span className="mb-3 text-lg font-bold text-(--text-primary)">
                            <Locale zh="等級分佈" en="Level Distribution" />
                        </span>
                        <LevelDistribution data={data.xp?.levelDistribution || []} />
                    </Card>

                    <Card variant="panel" className="flex flex-col">
                        <span className="mb-3 text-lg font-bold text-(--text-primary)">
                            <Locale zh="建議狀態" en="Suggestion Status" />
                        </span>
                        <SuggestionFunnel data={data.suggestions?.byStatus || []} />
                    </Card>
                </div>
            </PageSection>

            {(data.audit?.byCategory || []).length > 0 && (
                <PageSection
                    title={<Locale zh="儀表板活動" en="Dashboard Activity" />}
                    description={<Locale zh="各分類操作次數。" en="Activity count by category." />}
                >
                    <Card variant="panel" className="flex flex-col">
                        <span className="mb-3 text-lg font-bold text-(--text-primary)">
                            <Locale zh="儀表板操作記錄" en="Dashboard Activity" />
                        </span>
                        <div className="flex flex-wrap items-center gap-4">
                            {(data.audit?.byCategory || []).map((d) => (
                                <div key={d.category} className="flex items-center gap-1.5">
                                    <Badge variant="secondary" className="text-base">{d.category}</Badge>
                                    <span className="text-lg font-bold text-(--text-primary)">{d.count}</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </PageSection>
            )}
        </PageContainer>
    );
}
