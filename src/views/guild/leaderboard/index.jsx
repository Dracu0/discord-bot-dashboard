import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { GuildContext } from "contexts/guild/GuildContext";
import { getLeaderboard } from "api/internal";
import { usePageInfo } from "contexts/PageInfoContext";
import { useLocale, useTranslation } from "utils/Language";
import Card from "components/card/Card";
import { Spinner } from "components/ui/spinner";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "components/ui/table";
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink,
    PaginationPrevious, PaginationNext,
} from "components/ui/pagination";

export default function Leaderboard() {
    const locale = useLocale();
    usePageInfo(locale({ zh: "\u6392\u884c\u699c", en: "Leaderboard" }));
    const { id: serverId } = useContext(GuildContext);
    const [page, setPage] = useState(1);
    const { t } = useTranslation();

    const query = useQuery({
        queryKey: ["leaderboard", serverId, page],
        queryFn: () => getLeaderboard(serverId, page),
        placeholderData: (prev) => prev,
    });

    if (query.isLoading && !query.data) {
        return (
            <div className="flex items-center justify-center h-[400px]" style={{ paddingTop: "80px" }}>
                <Spinner size="lg" />
            </div>
        );
    }

    if (query.isError) {
        return (
            <div style={{ paddingTop: "80px" }}>
                <span className="text-red-500">{t("leaderboard.loadFailed")}</span>
            </div>
        );
    }

    const data = query.data;
    if (!data) return null;
    const users = data.users || [];

    return (
        <div style={{ paddingTop: "80px" }}>
            <div className="flex items-center gap-2 mb-6">
                <Trophy size={28} className="text-[var(--accent-primary)]" />
                <h2
                    className="text-2xl font-bold text-[var(--text-primary)]"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    {t("leaderboard.title")}
                </h2>
                <span className="text-[var(--text-secondary)] text-sm">
                    ({data.total} {t("common.users")})
                </span>
            </div>

            <Card className="px-0 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="bg-[var(--surface-secondary)] border-[var(--border-subtle)]">
                                <span className="text-xs text-gray-400 font-bold">Rank</span>
                            </TableHead>
                            <TableHead className="bg-[var(--surface-secondary)] border-[var(--border-subtle)]">
                                <span className="text-xs text-gray-400 font-bold">User</span>
                            </TableHead>
                            <TableHead className="bg-[var(--surface-secondary)] border-[var(--border-subtle)]">
                                <span className="text-xs text-gray-400 font-bold">Level</span>
                            </TableHead>
                            <TableHead className="bg-[var(--surface-secondary)] border-[var(--border-subtle)]">
                                <span className="text-xs text-gray-400 font-bold">XP</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="border-none">
                                    <div className="flex items-center justify-center py-8">
                                        <span className="text-[var(--text-muted)]">{t("leaderboard.noData")}</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user, i) => (
                                <TableRow
                                    key={user.userId}
                                    className={i % 2 === 1 ? "bg-[var(--surface-secondary)]" : "bg-transparent"}
                                >
                                    <TableCell className="border-none">
                                        <span className={`text-base font-bold ${user.rank <= 3 ? "text-[var(--accent-primary)]" : "text-[var(--text-primary)]"}`}>
                                            #{user.rank}
                                        </span>
                                    </TableCell>
                                    <TableCell className="border-none">
                                        <span className="text-base font-bold text-[var(--text-primary)]">{user.userName}</span>
                                    </TableCell>
                                    <TableCell className="border-none">
                                        <span className="text-base font-bold text-[var(--text-primary)]">{user.level}</span>
                                    </TableCell>
                                    <TableCell className="border-none">
                                        <span className="text-base text-[var(--text-primary)]">{user.xp.toLocaleString()}</span>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                {data.totalPages > 1 && (
                    <div className="flex justify-center py-4">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page <= 1}
                                    />
                                </PaginationItem>
                                {Array.from({ length: Math.min(data.totalPages, 5) }, (_, i) => {
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
                                        onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                                        disabled={page >= data.totalPages}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </Card>
        </div>
    );
}
