import React, { useContext, useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Filter, History } from "lucide-react";
import { GuildContext } from "contexts/guild/GuildContext";
import { getAuditLog } from "api/internal";
import { usePageInfo } from "contexts/PageInfoContext";
import { useLocale, Locale } from "utils/Language";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Spinner } from "components/ui/spinner";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "components/ui/table";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "components/ui/tooltip";
import { Collapsible, CollapsibleContent } from "components/ui/collapsible";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "components/ui/select";
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink,
    PaginationPrevious, PaginationNext,
} from "components/ui/pagination";
import PageContainer from "components/layout/PageContainer";
import PageHeader from "components/layout/PageHeader";
import PageSection from "components/layout/PageSection";
import Card from "components/card/Card";

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

function toTitleCase(value) {
    return String(value || "")
        .replace(/[._-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatSourceLabel(source) {
    if (!source) return "Dashboard";
    return toTitleCase(source);
}

function formatCategoryLabel(category) {
    if (!category) return "General";
    return toTitleCase(category);
}

function formatActionLabel(action) {
    if (!action) return "Update";
    return toTitleCase(action);
}

function DiffView({ before, after }) {
    if (before == null && after == null) return null;

    return (
        <div className="mt-1 flex items-center gap-1.5">
            {before != null && (
                <code className="max-w-[45%] break-all rounded bg-red-500/10 px-1.5 py-0.5 font-mono text-xs text-red-400">
                    - {typeof before === "object" ? JSON.stringify(before) : String(before)}
                </code>
            )}
            {after != null && (
                <code className="max-w-[45%] break-all rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-xs text-emerald-400">
                    + {typeof after === "object" ? JSON.stringify(after) : String(after)}
                </code>
            )}
        </div>
    );
}

function AuditLogRow({ entry }) {
    const [expanded, setExpanded] = useState(false);
    const hasDiff = entry.before != null || entry.after != null;
    const createdAt = entry.createdAt ? new Date(entry.createdAt) : null;
    const source = entry.source || "dashboard";
    const action = entry.action || "update";
    const category = entry.category || "general";
    const target = entry.target || entry.details || "—";

    return (
        <>
            <TableRow
                className={hasDiff ? "cursor-pointer" : "cursor-default"}
                style={{ cursor: hasDiff ? "pointer" : "default" }}
                onClick={() => hasDiff && setExpanded((p) => !p)}
            >
                <TableCell>
                    <div className="min-w-34">
                        <span className="block text-sm font-semibold text-(--text-primary)">
                            {createdAt ? createdAt.toLocaleDateString() : "—"}
                        </span>
                        <span className="block text-xs text-(--text-muted)">
                            {createdAt ? createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                        </span>
                    </div>
                </TableCell>
                <TableCell>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="min-w-0 max-w-40">
                                    <span className="block truncate text-sm font-semibold text-(--text-primary)">
                                        {entry.actorTag || entry.actorId}
                                    </span>
                                    <span className="block truncate text-xs text-(--text-muted)">
                                        {entry.actorId}
                                    </span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>{entry.actorId}</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </TableCell>
                <TableCell>
                    <Badge variant={SOURCE_COLORS[source] || "secondary"}>
                        {formatSourceLabel(source)}
                    </Badge>
                </TableCell>
                <TableCell>
                    <span className="text-sm font-medium text-(--text-primary)">{formatCategoryLabel(category)}</span>
                </TableCell>
                <TableCell>
                    <Badge variant={ACTION_COLORS[action] || "secondary"}>
                        {formatActionLabel(action)}
                    </Badge>
                </TableCell>
                <TableCell>
                    <span className="block max-w-48 line-clamp-2 text-sm text-(--text-secondary)">
                        {target}
                    </span>
                </TableCell>
                <TableCell>
                    {hasDiff && (
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </Button>
                    )}
                </TableCell>
            </TableRow>
            {hasDiff && expanded && (
                <TableRow>
                    <TableCell colSpan={7} className="border-none p-0">
                        <div className="m-3 rounded-xl border border-(--border-subtle) bg-(--surface-secondary) p-4">
                            <span className="mb-1 block text-xs font-semibold text-(--text-secondary)">
                                <Locale zh="變更詳情" en="Change Details" />
                            </span>
                            <DiffView before={entry.before} after={entry.after} />
                        </div>
                    </TableCell>
                </TableRow>
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
        placeholderData: (prev) => prev,
    });

    const { entries = [], total = 0, totalPages = 0 } = query.data || {};

    const categoryOptions = useMemo(() => [
        { value: "__all__", label: locale({ zh: "全部分類", en: "All Categories" }) },
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
        { value: "__all__", label: locale({ zh: "全部操作", en: "All Actions" }) },
        { value: "update", label: "Update" },
        { value: "enable", label: "Enable" },
        { value: "disable", label: "Disable" },
        { value: "create", label: "Create" },
        { value: "delete", label: "Delete" },
    ], [locale]);

    return (
        <PageContainer>
            <PageHeader
                icon={<History size={24} />}
                title={<Locale zh="審計日誌" en="Audit Log" />}
                description={<Locale zh="追蹤設定變更與差異。" en="Track configuration changes and diffs." />}
                meta={total > 0 ? <Badge variant="secondary">{total}</Badge> : null}
                actions={<Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters((p) => !p)}
                >
                    <Filter size={14} className="mr-1" />
                    <Locale zh="篩選" en="Filters" />
                </Button>}
            />

            <Collapsible open={showFilters}>
                <CollapsibleContent>
                    <Card variant="panel" className="mb-2 bg-(--surface-card)">
                        <div className="flex flex-wrap items-center gap-3">
                            <Select
                                value={category || "__all__"}
                                onValueChange={(val) => { setCategory(val === "__all__" ? null : val); setPage(1); }}
                            >
                                <SelectTrigger className="w-50">
                                    <SelectValue placeholder={locale({ zh: "分類", en: "Category" })} />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={action || "__all__"}
                                onValueChange={(val) => { setAction(val === "__all__" ? null : val); setPage(1); }}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder={locale({ zh: "操作", en: "Action" })} />
                                </SelectTrigger>
                                <SelectContent>
                                    {actionOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </Card>
                </CollapsibleContent>
            </Collapsible>

            {query.isLoading && (
                <div className="flex flex-col items-center py-10">
                    <Spinner size="md" />
                </div>
            )}

            {!query.isLoading && entries.length === 0 && (
                <PageSection>
                    <div className="flex flex-col items-center rounded-[28px] border border-dashed border-(--border-subtle) bg-(--surface-card) py-12">
                        <History size={48} className="text-(--text-secondary) opacity-40" />
                        <span className="mt-2 text-sm text-(--text-secondary)">
                            <Locale zh="暫無審計日誌" en="No audit log entries found" />
                        </span>
                    </div>
                </PageSection>
            )}

            {entries.length > 0 && (
                <PageSection
                    title={<Locale zh="活動紀錄" en="Activity Feed" />}
                    description={<Locale zh="展開列可查看完整差異。" en="Expand rows to view detailed diffs." />}
                >
                    <div className="overflow-x-auto rounded-xl border border-(--border-subtle) bg-(--surface-card) shadow-(--shadow-sm)">
                        <Table className="min-w-175 overflow-hidden rounded-md">
                            <TableHeader className="bg-(--surface-secondary)">
                                <TableRow>
                                    <TableHead className="text-[11px] font-bold uppercase tracking-[0.12em]"><Locale zh="時間" en="Time" /></TableHead>
                                    <TableHead className="text-[11px] font-bold uppercase tracking-[0.12em]"><Locale zh="操作者" en="Actor" /></TableHead>
                                    <TableHead className="text-[11px] font-bold uppercase tracking-[0.12em]"><Locale zh="來源" en="Source" /></TableHead>
                                    <TableHead className="text-[11px] font-bold uppercase tracking-[0.12em]"><Locale zh="分類" en="Category" /></TableHead>
                                    <TableHead className="text-[11px] font-bold uppercase tracking-[0.12em]"><Locale zh="操作" en="Action" /></TableHead>
                                    <TableHead className="text-[11px] font-bold uppercase tracking-[0.12em]"><Locale zh="目標" en="Target" /></TableHead>
                                    <TableHead className="w-10" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entries.map((entry) => (
                                    <AuditLogRow key={entry.id} entry={entry} />
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {totalPages > 1 && (
                        <div className="mt-4 flex justify-center">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={page <= 1}
                                        />
                                    </PaginationItem>
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        const pageNum = i + 1;
                                        return (
                                            <PaginationItem key={pageNum}>
                                                <PaginationLink
                                                    isActive={page === pageNum}
                                                    onClick={() => setPage(pageNum)}
                                                >
                                                    {pageNum}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}
                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                            disabled={page >= totalPages}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </PageSection>
            )}
        </PageContainer>
    );
}
