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
import { Card } from "components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "components/ui/select";
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink,
    PaginationPrevious, PaginationNext,
} from "components/ui/pagination";
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
        <div className="flex items-center gap-1.5 mt-1">
            {before != null && (
                <code className="rounded bg-red-500/10 text-red-400 px-1.5 py-0.5 text-xs font-mono max-w-[45%] break-all">
                    - {typeof before === "object" ? JSON.stringify(before) : String(before)}
                </code>
            )}
            {after != null && (
                <code className="rounded bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 text-xs font-mono max-w-[45%] break-all">
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
                onClick={() => hasDiff && setExpanded(p => !p)}
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
                                    <span className="block text-sm text-(--text-primary) font-semibold truncate">
                                        {entry.actorTag || entry.actorId}
                                    </span>
                                    <span className="block text-xs text-(--text-muted) truncate">
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
                    <span className="text-sm text-(--text-primary) font-medium">{formatCategoryLabel(category)}</span>
                </TableCell>
                <TableCell>
                    <Badge variant={ACTION_COLORS[action] || "secondary"}>
                        {formatActionLabel(action)}
                    </Badge>
                </TableCell>
                <TableCell>
                    <span className="text-sm text-(--text-secondary) line-clamp-2 block max-w-48">
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
                    <TableCell colSpan={7} className="p-0 border-none">
                        <div className="m-3 rounded-xl border border-(--border-subtle) bg-(--surface-secondary) p-4">
                            <span className="text-xs font-semibold text-(--text-secondary) mb-1 block">
                                <Locale zh="\u8b8a\u66f4\u8a73\u60c5" en="Change Details" />
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
    usePageInfo(locale({ zh: "\u5be9\u8a08\u65e5\u8a8c", en: "Audit Log" }));

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
        { value: "__all__", label: locale({ zh: "\u5168\u90e8\u5206\u985e", en: "All Categories" }) },
        { value: "config.welcome", label: "Welcome" },
        { value: "config.xp", label: "XP" },
        { value: "config.automod", label: "AutoMod" },
        { value: "config.modlog", label: "Mod Log" },
        { value: "config.suggestions", label: "Suggestions" },
        { value: "config.starboard", label: "Starboard" },
        { value: "config.tickets", label: "Tickets" },
        { value: "config.minecraft", label: "Minecraft" },
        { value: "feature.toggle", label: locale({ zh: "\u529f\u80fd\u5207\u63db", en: "Feature Toggle" }) },
        { value: "settings", label: locale({ zh: "\u8a2d\u7f6e", en: "Settings" }) },
    ], [locale]);

    const actionOptions = useMemo(() => [
        { value: "__all__", label: locale({ zh: "\u5168\u90e8\u64cd\u4f5c", en: "All Actions" }) },
        { value: "update", label: "Update" },
        { value: "enable", label: "Enable" },
        { value: "disable", label: "Disable" },
        { value: "create", label: "Create" },
        { value: "delete", label: "Delete" },
    ], [locale]);

    return (
        <div style={{ paddingTop: PAGE_PT }}>
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <History size={24} className="text-(--accent-primary)" />
                    <h3
                        className="text-(--text-primary) font-semibold text-xl"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                        <Locale zh="\u5be9\u8a08\u65e5\u8a8c" en="Audit Log" />
                    </h3>
                    {total > 0 && (
                        <Badge variant="secondary">{total}</Badge>
                    )}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(p => !p)}
                >
                    <Filter size={14} className="mr-1" />
                    <Locale zh="\u7be9\u9078" en="Filters" />
                </Button>
            </div>

            <Collapsible open={showFilters}>
                <CollapsibleContent>
                    <Card className="p-4 mb-4 bg-(--surface-card)">
                        <div className="flex items-center gap-3 flex-wrap">
                            <Select
                                value={category || "__all__"}
                                onValueChange={(val) => { setCategory(val === "__all__" ? null : val); setPage(1); }}
                            >
                                <SelectTrigger className="w-50">
                                    <SelectValue placeholder={locale({ zh: "\u5206\u985e", en: "Category" })} />
                                </SelectTrigger>
                                <SelectContent>
                                    {categoryOptions.map(opt => (
                                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={action || "__all__"}
                                onValueChange={(val) => { setAction(val === "__all__" ? null : val); setPage(1); }}
                            >
                                <SelectTrigger className="w-40">
                                    <SelectValue placeholder={locale({ zh: "\u64cd\u4f5c", en: "Action" })} />
                                </SelectTrigger>
                                <SelectContent>
                                    {actionOptions.map(opt => (
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
                <div className="flex flex-col items-center py-10">
                    <History size={48} className="text-(--text-secondary) opacity-40" />
                    <span className="text-(--text-secondary) text-sm mt-2">
                        <Locale zh="\u66ab\u7121\u5be9\u8a08\u65e5\u8a8c" en="No audit log entries found" />
                    </span>
                </div>
            )}

            {entries.length > 0 && (
                <>
                    <div className="overflow-x-auto rounded-xl border border-(--border-subtle) bg-(--surface-card) shadow-(--shadow-sm)">
                        <Table
                            className="min-w-175 rounded-md overflow-hidden"
                        >
                            <TableHeader className="bg-(--surface-secondary)">
                                <TableRow>
                                    <TableHead className="text-[11px] uppercase tracking-[0.12em] font-bold"><Locale zh="\u6642\u9593" en="Time" /></TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-[0.12em] font-bold"><Locale zh="\u64cd\u4f5c\u8005" en="Actor" /></TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-[0.12em] font-bold"><Locale zh="\u4f86\u6e90" en="Source" /></TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-[0.12em] font-bold"><Locale zh="\u5206\u985e" en="Category" /></TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-[0.12em] font-bold"><Locale zh="\u64cd\u4f5c" en="Action" /></TableHead>
                                    <TableHead className="text-[11px] uppercase tracking-[0.12em] font-bold"><Locale zh="\u76ee\u6a19" en="Target" /></TableHead>
                                    <TableHead className="w-10" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {entries.map(entry => (
                                    <AuditLogRow key={entry.id} entry={entry} />
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-4">
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setPage(p => Math.max(1, p - 1))}
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
                                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                            disabled={page >= totalPages}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
