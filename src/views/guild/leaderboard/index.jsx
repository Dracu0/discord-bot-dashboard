import React, { useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { GuildContext } from "contexts/guild/GuildContext";
import { getLeaderboard } from "api/internal";
import { usePageInfo } from "contexts/PageInfoContext";
import { useLocale, useTranslation } from "utils/Language";
import { Spinner } from "components/ui/spinner";
import LeaderboardTable from "components/card/data/LeaderboardTable";
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink,
    PaginationPrevious, PaginationNext,
} from "components/ui/pagination";
import { PAGE_PT } from "utils/layout-tokens";

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
            <div className="flex items-center justify-center h-100" style={{ paddingTop: PAGE_PT }}>
                <Spinner size="lg" />
            </div>
        );
    }

    if (query.isError) {
        return (
            <div style={{ paddingTop: PAGE_PT }}>
                <span className="text-red-500">{t("leaderboard.loadFailed")}</span>
            </div>
        );
    }

    const data = query.data;
    if (!data) return null;
    const users = data.users || data.entries || [];

    return (
        <div style={{ paddingTop: PAGE_PT }}>
            <div className="flex items-center gap-2 mb-6">
                <Trophy size={28} className="text-(--accent-primary)" />
                <h2
                    className="text-2xl font-bold text-(--text-primary)"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                    {t("leaderboard.title")}
                </h2>
                <span className="text-(--text-secondary) text-sm">
                    ({data.total} {t("common.users")})
                </span>
            </div>

            <LeaderboardTable
                title={t("leaderboard.title")}
                users={users}
                total={data.total}
                description={t("leaderboard.description")}
            />

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
        </div>
    );
}
