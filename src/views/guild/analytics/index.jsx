import React, { useContext, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { BarChart3 } from "lucide-react";
import { GuildContext } from "contexts/guild/GuildContext";
import { getAnalytics } from "api/internal";
import { usePageInfo } from "contexts/PageInfoContext";
import { Locale, useLocale } from "utils/Language";
import Card from "components/card/Card";
import ApexChart from "components/charts/ApexChart";
import { Badge } from "components/ui/badge";
import { Spinner } from "components/ui/spinner";
import { SegmentedControl } from "components/ui/segmented-control";

// Updated chart colors: blue/cyan theme instead of purple
const CHART_COLORS = {
    primary: '#0EA5E9',
    secondary: '#A3AED0',
    muted: '#CBD5E0',
};

const PERIOD_OPTIONS = [
    { value: "7", label: "7d" },
    { value: "14", label: "14d" },
    { value: "30", label: "30d" },
    { value: "90", label: "90d" },
];

function StatCard({ label, value, sublabel, color = "brand" }) {
    return (
        <Card className="flex flex-col p-5">
            <span className="text-xs uppercase font-bold text-[var(--text-secondary)]">
                {label}
            </span>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-1">
                {value ?? "\u2014"}
            </h2>
            {sublabel && (
                <span className="text-xs text-[var(--text-secondary)] mt-1">
                    {sublabel}
                </span>
            )}
        </Card>
    );
}

function ModerationTimeline({ data }) {
    const series = useMemo(() => [{
        name: "Actions",
        data: data.map(d => ({ x: d.date, y: d.count })),
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
                <span className="text-[var(--text-secondary)] text-sm">
                    <Locale zh="\u6b64\u6642\u6bb5\u7121\u5be9\u6838\u8a18\u9304" en="No moderation actions in this period" />
                </span>
            </div>
        );
    }

    return <ApexChart options={options} series={series} type="area" height={280} />;
}

function ActionBreakdown({ data }) {
    const series = useMemo(() => data.map(d => d.count), [data]);
    const labels = useMemo(() => data.map(d => d.action || "unknown"), [data]);
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

function LevelDistribution({ data }) {
    const series = useMemo(() => [{
        name: "Users",
        data: data.map(d => d.count),
    }], [data]);

    const categories = useMemo(() => data.map(d => d.range), [data]);

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

function SuggestionFunnel({ data }) {
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
                <span className="text-[var(--text-secondary)] text-sm">
                    <Locale zh="\u7121\u5efa\u8b70\u8cc7\u6599" en="No suggestion data" />
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            {data.map(d => (
                <div key={d.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <Badge variant={statusVariants[d.status] || "secondary"} className="text-xs">
                            {d.status}
                        </Badge>
                        <span className="text-sm text-[var(--text-primary)]">{d.count}</span>
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">
                        {((d.count / total) * 100).toFixed(1)}%
                    </span>
                </div>
            ))}
            <span className="text-xs text-[var(--text-secondary)] text-center mt-1.5">
                <Locale zh={`\u5171 ${total} \u7b46\u5efa\u8b70`} en={`${total} total suggestions`} />
            </span>
        </div>
    );
}

function formatDuration(ms) {
    if (!ms) return "\u2014";
    const hours = Math.floor(ms / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
}

export default function Analytics() {
    const locale = useLocale();
    usePageInfo(locale({ zh: "\u6578\u64da\u5206\u6790", en: "Analytics" }));
    const { id: serverId } = useContext(GuildContext);
    const [days, setDays] = useState("30");

    const query = useQuery({
        queryKey: ["analytics", serverId, days],
        queryFn: () => getAnalytics(serverId, parseInt(days)),
        staleTime: 60_000,
    });

    if (query.isLoading) {
        return (
            <div className="flex items-center justify-center h-[400px]" style={{ paddingTop: "80px" }}>
                <Spinner size="lg" />
            </div>
        );
    }

    if (query.isError) {
        return (
            <div style={{ paddingTop: "80px" }}>
                <span className="text-red-500">
                    <Locale zh="\u7121\u6cd5\u8f09\u5165\u5206\u6790\u8cc7\u6599" en="Failed to load analytics data" />
                </span>
            </div>
        );
    }

    const data = query.data;

    return (
        <div style={{ paddingTop: "80px" }}>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <BarChart3 size={28} className="text-[var(--accent-primary)]" />
                    <h2
                        className="text-2xl font-bold text-[var(--text-primary)]"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        <Locale zh="\u6578\u64da\u5206\u6790" en="Analytics" />
                    </h2>
                </div>
                <SegmentedControl
                    data={PERIOD_OPTIONS}
                    value={days}
                    onChange={setDays}
                    size="sm"
                />
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard
                    label={<Locale zh="\u5be9\u6838\u64cd\u4f5c" en="Mod Actions" />}
                    value={data.moderation.byDay.reduce((s, d) => s + d.count, 0)}
                    sublabel={<Locale zh={`\u904e\u53bb ${days} \u5929`} en={`Last ${days} days`} />}
                />
                <StatCard
                    label={<Locale zh="\u5f85\u8655\u7406\u5efa\u8b70" en="Pending Suggestions" />}
                    value={data.suggestions.byStatus.find(d => d.status === "pending")?.count ?? 0}
                />
                <StatCard
                    label={<Locale zh="\u672a\u7d50\u5ba2\u670d\u55ae" en="Open Tickets" />}
                    value={data.tickets.open}
                />
                <StatCard
                    label={<Locale zh="\u5e73\u5747\u89e3\u6c7a\u6642\u9593" en="Avg Resolution" />}
                    value={formatDuration(data.tickets.avgResolutionMs)}
                    sublabel={<Locale zh="\u5ba2\u670d\u55ae" en="Tickets" />}
                />
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                <Card className="flex flex-col p-5">
                    <span className="text-lg font-bold text-[var(--text-primary)] mb-3">
                        <Locale zh="\u5be9\u6838\u8da8\u52e2" en="Moderation Trend" />
                    </span>
                    <ModerationTimeline data={data.moderation.byDay} />
                </Card>

                <Card className="flex flex-col p-5">
                    <span className="text-lg font-bold text-[var(--text-primary)] mb-3">
                        <Locale zh="\u64cd\u4f5c\u985e\u578b\u5206\u4f48" en="Action Type Breakdown" />
                    </span>
                    <ActionBreakdown data={data.moderation.byType} />
                </Card>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                <Card className="flex flex-col p-5">
                    <span className="text-lg font-bold text-[var(--text-primary)] mb-3">
                        <Locale zh="\u7b49\u7d1a\u5206\u4f48" en="Level Distribution" />
                    </span>
                    <LevelDistribution data={data.xp.levelDistribution} />
                </Card>

                <Card className="flex flex-col p-5">
                    <span className="text-lg font-bold text-[var(--text-primary)] mb-3">
                        <Locale zh="\u5efa\u8b70\u72c0\u614b" en="Suggestion Status" />
                    </span>
                    <SuggestionFunnel data={data.suggestions.byStatus} />
                </Card>
            </div>

            {/* Audit Activity */}
            {data.audit.byCategory.length > 0 && (
                <Card className="flex flex-col p-5">
                    <span className="text-lg font-bold text-[var(--text-primary)] mb-3">
                        <Locale zh="\u5100\u8868\u677f\u64cd\u4f5c\u8a18\u9304" en="Dashboard Activity" />
                    </span>
                    <div className="flex items-center gap-4 flex-wrap">
                        {data.audit.byCategory.map(d => (
                            <div key={d.category} className="flex items-center gap-1.5">
                                <Badge variant="secondary" className="text-base">{d.category}</Badge>
                                <span className="text-lg font-bold text-[var(--text-primary)]">{d.count}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
