import React, { useContext, useState, useMemo } from "react";
import {
    Box, Group, Loader, Paper, SegmentedControl, SimpleGrid,
    Stack, Text, Title, RingProgress, Badge, Center,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { IconChartBar, IconTrendingUp, IconTrendingDown } from "@tabler/icons-react";
import { GuildContext } from "contexts/guild/GuildContext";
import { getAnalytics } from "api/internal";
import { usePageInfo } from "contexts/PageInfoContext";
import { Locale } from "utils/Language";
import { PAGE_PT } from "utils/layout-tokens";
import Card from "components/card/Card";
import ApexChart from "components/charts/ApexChart";

const PERIOD_OPTIONS = [
    { value: "7", label: "7d" },
    { value: "14", label: "14d" },
    { value: "30", label: "30d" },
    { value: "90", label: "90d" },
];

function StatCard({ label, value, sublabel, color = "brand" }) {
    return (
        <Card p="lg" style={{ flexDirection: "column" }}>
            <Text fz="xs" tt="uppercase" fw={700} c="var(--text-secondary)">
                {label}
            </Text>
            <Title order={2} c="var(--text-primary)" mt={4}>
                {value ?? "—"}
            </Title>
            {sublabel && (
                <Text fz="xs" c="var(--text-secondary)" mt={4}>
                    {sublabel}
                </Text>
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
            labels: { style: { colors: "#A3AED0", fontSize: "12px" } },
        },
        yaxis: {
            labels: { style: { colors: "#CBD5E0", fontSize: "12px" } },
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
            <Center py={40}>
                <Text c="var(--text-secondary)" fz="sm">
                    <Locale zh="此時段無審核記錄" en="No moderation actions in this period" />
                </Text>
            </Center>
        );
    }

    return <ApexChart options={options} series={series} type="area" height={280} />;
}

function ActionBreakdown({ data }) {
    const series = useMemo(() => data.map(d => d.count), [data]);
    const labels = useMemo(() => data.map(d => d.action || "unknown"), [data]);
    const colors = ["#845EF7", "#339AF0", "#20C997", "#FF6B6B", "#FCC419", "#FF922B"];

    const options = useMemo(() => ({
        labels,
        colors: colors.slice(0, labels.length),
        legend: { position: "bottom", labels: { colors: "#A3AED0" } },
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
            labels: { style: { colors: "#A3AED0", fontSize: "12px" } },
        },
        yaxis: {
            labels: { style: { colors: "#CBD5E0", fontSize: "12px" } },
        },
        colors: ["#845EF7"],
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
    const statusColors = {
        pending: "yellow",
        approved: "green",
        rejected: "red",
        "in-progress": "blue",
    };
    const total = data.reduce((s, d) => s + d.count, 0);

    if (total === 0) {
        return (
            <Center py={40}>
                <Text c="var(--text-secondary)" fz="sm">
                    <Locale zh="無建議資料" en="No suggestion data" />
                </Text>
            </Center>
        );
    }

    return (
        <Stack gap="sm">
            {data.map(d => (
                <Group key={d.status} justify="space-between">
                    <Group gap="xs">
                        <Badge color={statusColors[d.status] || "gray"} variant="light" size="sm">
                            {d.status}
                        </Badge>
                        <Text fz="sm" c="var(--text-primary)">{d.count}</Text>
                    </Group>
                    <Text fz="xs" c="var(--text-secondary)">
                        {((d.count / total) * 100).toFixed(1)}%
                    </Text>
                </Group>
            ))}
            <Text fz="xs" c="var(--text-secondary)" ta="center" mt="xs">
                <Locale zh={`共 ${total} 筆建議`} en={`${total} total suggestions`} />
            </Text>
        </Stack>
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
    usePageInfo({ zh: "數據分析", en: "Analytics" });
    const { id: serverId } = useContext(GuildContext);
    const [days, setDays] = useState("30");

    const query = useQuery({
        queryKey: ["analytics", serverId, days],
        queryFn: () => getAnalytics(serverId, parseInt(days)),
        staleTime: 60_000,
    });

    if (query.isLoading) {
        return (
            <Center pt={PAGE_PT} h={400}>
                <Loader size="lg" />
            </Center>
        );
    }

    if (query.isError) {
        return (
            <Box pt={PAGE_PT}>
                <Text c="red">
                    <Locale zh="無法載入分析資料" en="Failed to load analytics data" />
                </Text>
            </Box>
        );
    }

    const data = query.data;

    return (
        <Box pt={PAGE_PT}>
            <Group justify="space-between" mb={24} wrap="wrap" gap="sm">
                <Group gap="sm">
                    <IconChartBar size={28} color="var(--accent-primary)" />
                    <Title order={2} c="var(--text-primary)" ff="'Space Grotesk', sans-serif" fw={700}>
                        <Locale zh="數據分析" en="Analytics" />
                    </Title>
                </Group>
                <SegmentedControl
                    data={PERIOD_OPTIONS}
                    value={days}
                    onChange={setDays}
                    size="sm"
                />
            </Group>

            {/* Summary Stats */}
            <SimpleGrid cols={{ base: 2, md: 4 }} spacing={16} mb={24}>
                <StatCard
                    label={<Locale zh="審核操作" en="Mod Actions" />}
                    value={data.moderation.byDay.reduce((s, d) => s + d.count, 0)}
                    sublabel={<Locale zh={`過去 ${days} 天`} en={`Last ${days} days`} />}
                />
                <StatCard
                    label={<Locale zh="待處理建議" en="Pending Suggestions" />}
                    value={data.suggestions.byStatus.find(d => d.status === "pending")?.count ?? 0}
                />
                <StatCard
                    label={<Locale zh="未結客服單" en="Open Tickets" />}
                    value={data.tickets.open}
                />
                <StatCard
                    label={<Locale zh="平均解決時間" en="Avg Resolution" />}
                    value={formatDuration(data.tickets.avgResolutionMs)}
                    sublabel={<Locale zh="客服單" en="Tickets" />}
                />
            </SimpleGrid>

            {/* Charts Row 1 */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={20} mb={20}>
                <Card p="lg" style={{ flexDirection: "column" }}>
                    <Text fz="lg" fw={700} c="var(--text-primary)" mb="md">
                        <Locale zh="審核趨勢" en="Moderation Trend" />
                    </Text>
                    <ModerationTimeline data={data.moderation.byDay} />
                </Card>

                <Card p="lg" style={{ flexDirection: "column" }}>
                    <Text fz="lg" fw={700} c="var(--text-primary)" mb="md">
                        <Locale zh="操作類型分佈" en="Action Type Breakdown" />
                    </Text>
                    <ActionBreakdown data={data.moderation.byType} />
                </Card>
            </SimpleGrid>

            {/* Charts Row 2 */}
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={20} mb={20}>
                <Card p="lg" style={{ flexDirection: "column" }}>
                    <Text fz="lg" fw={700} c="var(--text-primary)" mb="md">
                        <Locale zh="等級分佈" en="Level Distribution" />
                    </Text>
                    <LevelDistribution data={data.xp.levelDistribution} />
                </Card>

                <Card p="lg" style={{ flexDirection: "column" }}>
                    <Text fz="lg" fw={700} c="var(--text-primary)" mb="md">
                        <Locale zh="建議狀態" en="Suggestion Status" />
                    </Text>
                    <SuggestionFunnel data={data.suggestions.byStatus} />
                </Card>
            </SimpleGrid>

            {/* Audit Activity */}
            {data.audit.byCategory.length > 0 && (
                <Card p="lg" style={{ flexDirection: "column" }}>
                    <Text fz="lg" fw={700} c="var(--text-primary)" mb="md">
                        <Locale zh="儀表板操作記錄" en="Dashboard Activity" />
                    </Text>
                    <Group gap="lg" wrap="wrap">
                        {data.audit.byCategory.map(d => (
                            <Group key={d.category} gap="xs">
                                <Badge variant="light" size="lg">{d.category}</Badge>
                                <Text fz="lg" fw={700} c="var(--text-primary)">{d.count}</Text>
                            </Group>
                        ))}
                    </Group>
                </Card>
            )}
        </Box>
    );
}
