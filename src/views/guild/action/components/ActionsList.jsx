import { cn } from "lib/utils";

import { Action } from "components/card/Action";
import { config } from "config/config";
import { Locale } from "utils/Language";
import PageSection from "components/layout/PageSection";

export default function ActionsList() {
    return (
        <PageSection
            title={<Locale zh="動作列表" en="Action Library" />}
            description={<Locale zh="集中管理審核、建議與伺服器工作流程。" en="Open the tools that drive moderation, suggestions, and other server workflows in one place." />}
            className="rounded-[28px] border border-(--border-subtle) bg-(--surface-card) p-5 shadow-(--shadow-sm) md:p-6"
        >
            <div className="flex flex-col gap-4">
                <Actions />
            </div>
        </PageSection>
    );
}

function Actions() {
    return Object.entries(config.actions).map(([id, action], index) => (
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
