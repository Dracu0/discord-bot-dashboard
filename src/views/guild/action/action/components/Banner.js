import React, {useContext} from "react";

import {GuildContext} from "contexts/guild/GuildContext";
import CreateButton from "./CreateButton";
import {useActionBanner} from "../../components/ActionBanner";
import BackNavButton from "components/navigation/BackNavButton";

export function useBanner() {
    const { id: serverId } = useContext(GuildContext);

    useActionBanner([
        <BackNavButton to={`/guild/${serverId}/actions`} zh="返回動作" en="Back to Actions" ariaLabel="Back to Actions" />,
        <CreateButton />,
    ])
}