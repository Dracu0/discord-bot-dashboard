import React, { useContext, useMemo, useState } from "react";
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
    PaginationPrevious, PaginationNext, PaginationEllipsis,
} from "components/ui/pagination";
import PageContainer from "components/layout/PageContainer";
import PageHeader from "components/layout/PageHeader";
import PageSection from "components/layout/PageSection";

export default function Leaderboard() {
    const locale = useLocale();
    usePageInfo(locale({ zh: "排行榜", en: "Leaderboard" }));
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
            <PageContainer className="flex h-100 items-center justify-center">
                <Spinner size="lg" />
            </PageContainer>
        );
    }

    if (query.isError) {
        return (
            <PageContainer>
                <span className="text-red-500">{t("leaderboard.loadFailed")}</span>
            </PageContainer>
        );
    }

    const data = query.data;
    if (!data) return null;
    const users = data.users || data.entries || [];

    const pageWindow = useMemo(() => {
        if (data.totalPages <= 7) {
            return Array.from({ length: data.totalPages }, (_, i) => i + 1);
        }
        const pages = new Set([1, data.totalPages, page - 1, page, page + 1]);
        return Array.from(pages)
            .filter((n) => n >= 1 && n <= data.totalPages)
            .sort((a, b) => a - b);
    }, [data.totalPages, page]);

    return (
        <PageContainer>
            <PageHeader
                icon={<Trophy size={24} />}
                title={t("leaderboard.title")}
                description={t("leaderboard.description")}
                meta={<>
                    <span>{data.total} {t("common.users")}</span>
                    <span className="h-1 w-1 rounded-full bg-(--text-muted)" />
                    <span>{data.totalPages} {data.totalPages === 1 ? "page" : "pages"}</span>
                </>}
            />

            <PageSection
                title={t("leaderboard.title")}
                description={t("leaderboard.description")}
            >
                <LeaderboardTable
                    title={t("leaderboard.title")}
                    users={users}
                    total={data.total}
                    description={t("leaderboard.description")}
                />

                {data.totalPages > 1 && (
                    <div className="flex justify-center py-2">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={page <= 1}
                                    />
                                </PaginationItem>
                                {pageWindow.map((pageNum, idx) => {
                                    const prev = pageWindow[idx - 1];
                                    return (
                                        <React.Fragment key={pageNum}>
                                            {idx > 0 && prev != null && pageNum - prev > 1 && (
                                                <PaginationItem>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            )}
                                            <PaginationItem>
                                                <PaginationLink
                                                    isActive={page === pageNum}
                                                    onClick={() => setPage(pageNum)}
                                                >
                                                    {pageNum}
                                                </PaginationLink>
                                            </PaginationItem>
                                        </React.Fragment>
                                    );
                                })}
                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                                        disabled={page >= data.totalPages}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </PageSection>
        </PageContainer>
    );
}
