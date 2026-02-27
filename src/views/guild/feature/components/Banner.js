import React, {useContext} from "react";

import {useFeatureInfo} from "contexts/FeatureDetailContext";

// Assets
import {GuildContext} from "contexts/guild/GuildContext";
import {useLayoutUpdate} from "contexts/layouts/LayoutContext";
import BackNavButton from "components/navigation/BackNavButton";

export default function useBanner(localeName) {
    const { id: serverId } = useContext(GuildContext)
    const {description} = useFeatureInfo()

    useLayoutUpdate({
        banner: {
            title: localeName,
            description,
            buttons: [
                <BackNavButton
                    to={`/guild/${serverId}/features`}
                    zh="返回功能"
                    en="Back to Features"
                    ariaLabel="Back to Features"
                />,
            ]
        }
    })
}
