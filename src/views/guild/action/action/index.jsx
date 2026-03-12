import React, { useContext, useState } from "react";

import { usePageInfo } from "contexts/PageInfoContext";
import { ActionDetailContext, ActionDetailProvider, useActionInfo } from "contexts/actions/ActionDetailContext";
import { useBanner } from "./components/Banner";
import NotFound from "../../../info/Not_Found";
import SearchInput from "components/fields/impl/SearchInput";

import { Locale, useLocale } from "../../../../utils/Language";
import { Task } from "../components/Task";
import { useTextFilter } from "hooks/useTextFilter";
import { Inbox } from "lucide-react";
import PageSection from "components/layout/PageSection";

import { useParams } from "react-router-dom";
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink,
    PaginationPrevious, PaginationNext,
} from "components/ui/pagination";
import { SelectField } from "components/fields/SelectField";
import { Button } from "components/ui/button";

export default function ActionTasks() {
    const info = useActionInfo()
    const {action} = useParams()

    if (info == null) {
        return <NotFound />
    }

    return <TasksPanel key={action} />
}

function TasksPanel() {
    useBanner()
    const {query: filter, setQuery: setFilter, includes} = useTextFilter("")
    const info = useActionInfo()
    const locale = useLocale()
    const [actionFilter, setActionFilter] = useState("")

    usePageInfo([
        {zh: "\u52d5\u4f5c", en: "Action"},
        info.name
    ].map(locale))

    const filters = {}
    if (actionFilter) filters.action = actionFilter

    return <PageSection
        title={<Locale zh="\u904b\u884c\u4e2d" en={info.readOnly ? "Entries" : "Tasks"} />}
        description={<Locale
            zh="\u641c\u5c0b\u3001\u6aa2\u8996\u4e26\u7ba1\u7406\u6b64\u52d5\u4f5c\u76ee\u524d\u7684\u4efb\u52d9\u9805\u76ee\u3002"
            en={info.readOnly
                ? "Browse action entries."
                : "Search and manage action tasks."
            }
        />}
        actions={
            <div className="flex items-center gap-2 flex-wrap">
                {info.filterOptions && (
                    <div className="flex items-center gap-1.5">
                        <div className="w-40">
                            <SelectField
                                options={info.filterOptions.map(o => ({ label: o.label, value: o.value }))}
                                value={actionFilter}
                                onChange={setActionFilter}
                                placeholder="All types"
                            />
                        </div>
                        {actionFilter && (
                            <Button variant="ghost" size="sm" onClick={() => setActionFilter("")}>
                                <Locale zh="清除" en="Clear" />
                            </Button>
                        )}
                    </div>
                )}
                <SearchInput value={filter} onChange={setFilter} bg="var(--surface-secondary)" groupStyle={{ maw: "20rem" }} />
            </div>
        }
        className="rounded-[28px] border border-(--border-subtle) bg-(--surface-card) p-5 shadow-(--shadow-sm) md:p-6"
    >
        <ActionDetailProvider filters={filters}>
            <TasksContent includes={includes} />
        </ActionDetailProvider>
    </PageSection>
}

function TasksContent({includes}) {
    const {tasks, page, totalPages, setPage} = useContext(ActionDetailContext)
    const info = useActionInfo()
    const isReadOnly = info?.readOnly === true

    return tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div
                className="flex items-center justify-center h-16 w-16 rounded-full"
                style={{ background: "var(--surface-secondary)" }}
            >
                <Inbox className="h-8 w-8 text-(--text-muted)" />
            </div>
            <div className="text-center">
                <span className="block text-lg font-semibold text-(--text-primary) font-['Space_Grotesk']">
                    <Locale zh="沒有任務正在運行" en={isReadOnly ? "No entries found" : "No entries yet"} />
                </span>
                <span className="block text-sm text-(--text-secondary) mt-1 max-w-xs mx-auto">
                    <Locale
                        zh="可透過 Discord 指令或面板建立項目。"
                        en={isReadOnly
                            ? "Bot moderation entries appear here automatically."
                            : "Create entries here or from Discord commands."
                        }
                    />
                </span>
            </div>
        </div>
    ) : (
        <div className="animate-in slide-in-from-bottom duration-300">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {tasks
                    .filter((task) => includes(task.name))
                    .map((task) => (
                        <Task key={task.id} task={task} />
                    ))}
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
        </div>
    );
}
