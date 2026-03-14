import { cn } from "lib/utils";
import { useMemo, useState } from "react";

import { Action } from "components/card/Action";
import { config } from "config/config";
import { Locale, useLocale } from "utils/Language";
import PageSection from "components/layout/PageSection";
import SearchInput from "components/fields/impl/SearchInput";
import { Badge } from "components/ui/badge";
import { Inbox } from "lucide-react";

export default function ActionsList() {
    const locale = useLocale();
    const [query, setQuery] = useState("");

    const allActions = useMemo(() => Object.entries(config.actions), []);
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return allActions;

        return allActions.filter(([id, action]) => {
            const name = locale(action.name)?.toLowerCase?.() || "";
            const description = String(action.description || "").toLowerCase();
            return id.toLowerCase().includes(q) || name.includes(q) || description.includes(q);
        });
    }, [allActions, locale, query]);

    return (
        <PageSection
            title={<Locale zh="動作列表" en="Action Library" />}
            description={<Locale zh="管理審核、建議與任務工作流。" en="Manage moderation, suggestions, and operational workflows." />}
            actions={
                <div className="flex items-center gap-2 rounded-xl border border-(--border-subtle) bg-(--surface-primary) p-1.5 shadow-(--shadow-xs)">
                    <Badge variant="secondary" className="rounded-full px-3 py-1">{filtered.length}</Badge>
                    <SearchInput
                        value={query}
                        onChange={setQuery}
                        groupStyle={{ width: "min(20rem, 70vw)" }}
                    />
                </div>
            }
        >
            <div className="flex flex-col gap-4">
                <Actions actions={filtered} />
                {filtered.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-(--border-subtle) bg-(--surface-secondary)/70 px-4 py-10">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--surface-primary)">
                            <Inbox className="h-6 w-6 text-(--text-muted)" />
                        </div>
                        <p className="text-sm font-medium text-(--text-primary)">
                            <Locale zh="找不到符合條件的動作" en="No actions match your search" />
                        </p>
                    </div>
                )}
            </div>
        </PageSection>
    );
}

function Actions({ actions }) {
    return actions.map(([id, action], index) => (
        <div
            key={id}
            className={cn(
                "transition-all duration-300 ease-out",
                "animate-in zoom-in-95 fade-in"
            )}
            style={{ animationDelay: `${index * 60}ms`, animationFillMode: "backwards" }}
        >
            <Action id={id} action={action} />
        </div>
    ));
}
