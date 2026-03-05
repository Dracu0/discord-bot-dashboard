import React, { useContext } from "react";
import { Button } from "components/ui/button";
import { Spinner } from "components/ui/spinner";

import { useFeatureInfo } from "contexts/FeatureDetailContext";
import { FeaturesContext } from "contexts/FeaturesContext";

import { GuildContext } from "contexts/guild/GuildContext";
import { useLayoutUpdate } from "contexts/layouts/LayoutContext";
import BackNavButton from "components/navigation/BackNavButton";
import { useEnableFeatureMutation } from "api/utils";
import { Locale, useLocale } from "utils/Language";
import ActiveUsers from "components/card/ActiveUsers";

function EnableToggle() {
    const { id: serverId } = useContext(GuildContext);
    const { id: featureId, name } = useFeatureInfo();
    const locale = useLocale();
    const featuresData = useContext(FeaturesContext);
    const enabled = featuresData?.enabled?.includes(featureId);
    const mutation = useEnableFeatureMutation(serverId, featureId);
    const featureName = locale(name);

    return (
        <Button
            onClick={() => mutation.mutate(!enabled)}
            disabled={mutation.isPending}
            size="sm"
            className="h-10 text-sm rounded-full px-6 min-w-0"
            variant={enabled ? "success" : "ghost"}
        >
            {mutation.isPending ? (
                <Spinner size="sm" />
            ) : (
                <span
                    className="w-2 h-2 rounded-full mr-2 inline-block"
                    style={{ backgroundColor: enabled ? "white" : "var(--status-error)" }}
                />
            )}
            {enabled
                ? <Locale zh={`${featureName} 已啟用`} en={`${featureName} Enabled`} />
                : <Locale zh={`${featureName} 已停用`} en={`${featureName} Disabled`} />
            }
        </Button>
    );
}

export default function useBanner(localeName) {
    const { id: serverId } = useContext(GuildContext);
    const { description, canToggle } = useFeatureInfo();

    useLayoutUpdate({
        banner: {
            title: localeName,
            description,
            buttons: [
                <ActiveUsers key="presence" guildId={serverId} page={localeName} />,
                ...(canToggle ? [<EnableToggle key="toggle" />] : []),
                <BackNavButton
                    key="back"
                    to={`/guild/${serverId}/features`}
                    zh="返回功能"
                    en="Back to Features"
                    ariaLabel="Back to Features"
                />,
            ],
        },
    });
}
