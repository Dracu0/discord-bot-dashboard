import { cn } from "lib/utils";
import Feature from "components/card/Feature";
import { useContext } from "react";

import { FeaturesContext } from "contexts/FeaturesContext";
import { GuildContext } from "contexts/guild/GuildContext";
import { useEnableFeatureMutation } from "api/utils";
import { config } from "../../../../config/config";
import { Locale } from "../../../../utils/Language";
import PageSection from "components/layout/PageSection";

export default function FeatureGrid() {
    return (
        <PageSection
            title={<Locale zh="功能列表" en="Feature Library" />}
            description={<Locale zh="快速檢視、啟用並配置每個伺服器功能。" en="Browse each server feature, review what it does, and jump straight into configuration." />}
            className="rounded-[28px] border border-(--border-subtle) bg-(--surface-card) p-5 shadow-(--shadow-sm) md:p-6"
        >
            <div className="flex flex-col gap-4">
                <Features />
            </div>
        </PageSection>
    );
}

function FeatureWithToggle({ id, feature, enabled }) {
    const { id: serverId } = useContext(GuildContext);
    const mutation = useEnableFeatureMutation(serverId, id);

    return (
        <Feature
            {...feature}
            id={id}
            enabled={enabled}
            onToggle={(val) => mutation.mutate(val)}
            isToggling={mutation.isPending}
        />
    );
}

function Features() {
    const { enabled } = useContext(FeaturesContext);
    const safeEnabled = enabled || [];

    return Object.entries(config.features).map(([id, feature], index) => (
        <div
            key={id}
            className={cn(
                "transition-all duration-300 ease-out",
                "animate-in slide-in-from-bottom-2 fade-in"
            )}
            style={{ animationDelay: `${index * 60}ms`, animationFillMode: "backwards" }}
        >
            <FeatureWithToggle id={id} feature={feature} enabled={safeEnabled.includes(id)} />
        </div>
    ));
}
