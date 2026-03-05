import { cn } from "lib/utils";
import Feature from "components/card/Feature";
import { useContext } from "react";

import { FeaturesContext } from "contexts/FeaturesContext";
import { GuildContext } from "contexts/guild/GuildContext";
import { useEnableFeatureMutation } from "api/utils";
import { config } from "../../../../config/config";
import { Locale } from "../../../../utils/Language";

export default function FeatureGrid() {
    return (
        <div className="flex flex-col gap-5">
            <span
                className="text-[var(--text-primary)] text-2xl font-bold ms-6 mt-11"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
                <Locale zh="功能列表" en="Features List" />
            </span>
            <div className="flex flex-col gap-3">
                <Features />
            </div>
        </div>
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

    return Object.entries(config.features).map(([id, feature], index) => (
        <div
            key={id}
            className={cn(
                "transition-all duration-300 ease-out",
                "animate-in slide-in-from-bottom-2 fade-in"
            )}
            style={{ animationDelay: `${index * 60}ms`, animationFillMode: "backwards" }}
        >
            <FeatureWithToggle id={id} feature={feature} enabled={enabled.includes(id)} />
        </div>
    ));
}
