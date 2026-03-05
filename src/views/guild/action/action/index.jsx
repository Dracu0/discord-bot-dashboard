import React, { useContext } from "react";

import { usePageInfo } from "contexts/PageInfoContext";
import { ActionDetailContext, ActionDetailProvider, useActionInfo } from "contexts/actions/ActionDetailContext";
import { useBanner } from "./components/Banner";
import NotFound from "../../../info/Not_Found";
import SearchInput from "components/fields/impl/SearchInput";

import not_found from "assets/img/info/not_found.svg";
import CreateButton from "./components/CreateButton";
import { Locale, useLocale } from "../../../../utils/Language";
import { Task } from "../components/Task";
import { useTextFilter } from "hooks/useTextFilter";

import { useParams } from "react-router-dom";
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink,
    PaginationPrevious, PaginationNext,
} from "components/ui/pagination";

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
    const {name} = useActionInfo()
    const locale = useLocale()

    usePageInfo([
        {zh: "\u52d5\u4f5c", en: "Action"},
        name
    ].map(locale))

    return <div className="flex flex-col gap-1.5 pt-2.5 px-1 md:px-3 lg:px-2.5">
        <div className="flex flex-col items-center gap-5 mb-1.5">
            <span className="text-2xl font-bold">
                <Locale zh="\u904b\u884c\u4e2d" en="Tasks" />
            </span>

            <SearchInput value={filter} onChange={setFilter} bg="var(--surface-secondary)" groupStyle={{ maw: "20rem" }} />
        </div>
        <ActionDetailProvider>
            <TasksContent includes={includes} />
        </ActionDetailProvider>
    </div>
}

function TasksContent({includes}) {
    const {tasks, page, totalPages, setPage} = useContext(ActionDetailContext)

    return tasks.length === 0 ? (
        <div className="h-[50vh] bg-cover" style={{ backgroundImage: `url(${not_found})` }}>
            <div className="flex flex-col w-full h-full backdrop-blur-[50px]">
                <span className="text-center text-[22px] font-bold mt-2.5">
                    <Locale zh="\u6c92\u6709\u4efb\u52d9\u6b63\u5728\u904b\u884c" en="No Tasks running" />
                </span>
                <CreateButton />
            </div>
        </div>
    ) : (
        <div className="animate-in slide-in-from-bottom duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5">
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
