import React, { useContext } from "react";
import { Button, Box } from "@mantine/core";

import { useFeatureInfo } from "contexts/FeatureDetailContext";
import { FeaturesContext } from "contexts/FeaturesContext";

import { GuildContext } from "contexts/guild/GuildContext";
import { useLayoutUpdate } from "contexts/layouts/LayoutContext";
import BackNavButton from "components/navigation/BackNavButton";
import { useEnableFeatureMutation } from "api/utils";
import { Locale, useLocale } from "utils/Language";

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
            loading={mutation.isPending}
            size="sm"
            miw={0}
            h={40}
            fz="sm"
            radius={70}
            px={24}
            color={enabled ? "green" : "gray"}
            variant={enabled ? "filled" : "light"}
            styles={{ label: { color: "white" } }}
        >
            <Box
                component="span"
                w={8}
                h={8}
                style={{ borderRadius: "50%", backgroundColor: enabled ? "white" : "var(--mantine-color-red-3)" }}
                mr={8}
            />
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
