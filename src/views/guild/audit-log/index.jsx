import React, { useContext, useState, useMemo } from "react";
import {
    Box, Badge, Button, Code, Group, Loader, Pagination,
    Select, Stack, Table, Text, Title, Tooltip, Collapse,
    ActionIcon, Paper,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { IconChevronDown, IconChevronUp, IconFilter, IconHistory } from "@tabler/icons-react";
import { GuildContext } from "contexts/guild/GuildContext";
import { getAuditLog } from "api/internal";
import { usePageInfo } from "contexts/PageInfoContext";
import { useLocale, Locale } from "utils/Language";
import { PAGE_PT } from "utils/layout-tokens";

const ACTION_COLORS = {
    update: "blue",
    enable: "green",
    disable: "red",
    create: "teal",
    delete: "red",
};

const SOURCE_COLORS = {
    dashboard: "violet",
    bot: "orange",
};

function DiffView({ before, after }) {
    if (before == null && after == null) return null;

    return (
        <Group gap="xs" mt={4}>
            {before != null && (
                <Code color="red" fz="xs" style={{ maxWidth: "45%", wordBreak: "break-all" }}>
                    - {typeof before === "object" ? JSON.stringify(before) : String(before)}
                </Code>
            )}
            {after != null && (
                <Code color="green" fz="xs" style={{ maxWidth: "45%", wordBreak: "break-all" }}>
                    + {typeof after === "object" ? JSON.stringify(after) : String(after)}
                </Code>
            )}
        </Group>
    );
}

function AuditLogRow({ entry }) {
    const [expanded, setExpanded] = useState(false);
    const hasDiff = entry.before != null || entry.after != null;

    return (
        <>
            <Table.Tr
                style={{ cursor: hasDiff ? "pointer" : "default" }}
                onClick={() => hasDiff && setExpanded(p => !p)}
            >
                <Table.Td>
                    <Text fz="xs" c="var(--text-secondary)">
                        {new Date(entry.createdAt).toLocaleString()}
                    </Text>
                </Table.Td>
                <Table.Td>
                    <Tooltip label={entry.actorId}>
                        <Text fz="sm" c="var(--text-primary)" fw={500}>
                            {entry.actorTag || entry.actorId}
                        </Text>
                    </Tooltip>
                </Table.Td>
                <Table.Td>
                    <Badge color={SOURCE_COLORS[entry.source] || "gray"} size="sm" variant="light">
                        {entry.source}
                    </Badge>
                </Table.Td>
                <Table.Td>
                    <Text fz="sm" c="var(--text-primary)">{entry.category}</Text>
                </Table.Td>
                <Table.Td>
                    <Badge color={ACTION_COLORS[entry.action] || "gray"} size="sm">
                        {entry.action}
                    </Badge>
                </Table.Td>
                <Table.Td>
                    <Text fz="sm" c="var(--text-secondary)" lineClamp={1}>
                        {entry.target || "—"}
                    </Text>
                </Table.Td>
                <Table.Td>
                    {hasDiff && (
                        <ActionIcon variant="subtle" size="sm" color="gray">
                            {expanded ? <IconChevronUp size={14} /> : <IconChevronDown size={14} />}
                        </ActionIcon>
                    )}
                </Table.Td>
            </Table.Tr>
            {hasDiff && (
                <Table.Tr>
                    <Table.Td colSpan={7} p={0} style={{ border: "none" }}>
                        <Collapse in={expanded}>
                            <Box p="sm" style={{ background: "var(--surface-secondary)", borderRadius: "var(--radius-sm)" }}>
                                <Text fz="xs" fw={600} c="var(--text-secondary)" mb={4}>
                                    <Locale zh="變更詳情" en="Change Details" />
                                </Text>
                                <DiffView before={entry.before} after={entry.after} />
                            </Box>
                        </Collapse>
                    </Table.Td>
                </Table.Tr>
            )}
        </>
    );
}

export default function AuditLogPage() {
    const locale = useLocale();
    usePageInfo(locale({ zh: "審計日誌", en: "Audit Log" }));

    const { id: serverId } = useContext(GuildContext);
    const [page, setPage] = useState(1);
    const [category, setCategory] = useState(null);
    const [action, setAction] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const query = useQuery({
        queryKey: ["audit_log", serverId, page, category, action],
        queryFn: () => getAuditLog(serverId, { page, category, action }),
        keepPreviousData: true,
    });

    const { entries = [], total = 0, totalPages = 0 } = query.data || {};

    const categoryOptions = useMemo(() => [
        { value: "", label: locale({ zh: "全部分類", en: "All Categories" }) },
        { value: "config.welcome", label: "Welcome" },
        { value: "config.xp", label: "XP" },
        { value: "config.automod", label: "AutoMod" },
        { value: "config.modlog", label: "Mod Log" },
        { value: "config.suggestions", label: "Suggestions" },
        { value: "config.starboard", label: "Starboard" },
        { value: "config.tickets", label: "Tickets" },
        { value: "config.minecraft", label: "Minecraft" },
        { value: "feature.toggle", label: locale({ zh: "功能切換", en: "Feature Toggle" }) },
        { value: "settings", label: locale({ zh: "設置", en: "Settings" }) },
    ], [locale]);

    const actionOptions = useMemo(() => [
        { value: "", label: locale({ zh: "全部操作", en: "All Actions" }) },
        { value: "update", label: "Update" },
        { value: "enable", label: "Enable" },
        { value: "disable", label: "Disable" },
        { value: "create", label: "Create" },
        { value: "delete", label: "Delete" },
    ], [locale]);

    return (
        <Box pt={PAGE_PT}>
            <Group justify="space-between" align="center" mb="lg">
                <Group gap="sm">
                    <IconHistory size={24} color="var(--accent-primary)" />
                    <Title order={3} c="var(--text-primary)" ff="'Space Grotesk', sans-serif">
                        <Locale zh="審計日誌" en="Audit Log" />
                    </Title>
                    {total > 0 && (
                        <Badge size="sm" color="gray" variant="light">
                            {total}
                        </Badge>
                    )}
                </Group>
                <Button
                    variant="subtle"
                    size="compact-sm"
                    leftSection={<IconFilter size={14} />}
                    onClick={() => setShowFilters(p => !p)}
                >
                    <Locale zh="篩選" en="Filters" />
                </Button>
            </Group>

            <Collapse in={showFilters}>
                <Paper p="md" mb="md" radius="md" style={{ background: "var(--surface-card)" }}>
                    <Group gap="md">
                        <Select
                            size="sm"
                            placeholder={locale({ zh: "分類", en: "Category" })}
                            data={categoryOptions}
                            value={category || ""}
                            onChange={(val) => { setCategory(val || null); setPage(1); }}
                            clearable
                            w={200}
                        />
                        <Select
                            size="sm"
                            placeholder={locale({ zh: "操作", en: "Action" })}
                            data={actionOptions}
                            value={action || ""}
                            onChange={(val) => { setAction(val || null); setPage(1); }}
                            clearable
                            w={160}
                        />
                    </Group>
                </Paper>
            </Collapse>

            {query.isLoading && (
                <Stack align="center" py="xl">
                    <Loader size="md" />
                </Stack>
            )}

            {!query.isLoading && entries.length === 0 && (
                <Stack align="center" py="xl">
                    <IconHistory size={48} color="var(--text-secondary)" opacity={0.4} />
                    <Text c="var(--text-secondary)" fz="sm">
                        <Locale zh="暫無審計日誌" en="No audit log entries found" />
                    </Text>
                </Stack>
            )}

            {entries.length > 0 && (
                <>
                    <Table.ScrollContainer minWidth={700}>
                        <Table
                            striped
                            highlightOnHover
                            withTableBorder
                            style={{ borderRadius: "var(--radius-md)", overflow: "hidden" }}
                        >
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th><Locale zh="時間" en="Time" /></Table.Th>
                                    <Table.Th><Locale zh="操作者" en="Actor" /></Table.Th>
                                    <Table.Th><Locale zh="來源" en="Source" /></Table.Th>
                                    <Table.Th><Locale zh="分類" en="Category" /></Table.Th>
                                    <Table.Th><Locale zh="操作" en="Action" /></Table.Th>
                                    <Table.Th><Locale zh="目標" en="Target" /></Table.Th>
                                    <Table.Th w={40} />
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {entries.map(entry => (
                                    <AuditLogRow key={entry.id} entry={entry} />
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>

                    {totalPages > 1 && (
                        <Group justify="center" mt="md">
                            <Pagination
                                value={page}
                                onChange={setPage}
                                total={totalPages}
                                size="sm"
                            />
                        </Group>
                    )}
                </>
            )}
        </Box>
    );
}
