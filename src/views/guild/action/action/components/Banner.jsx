import React, {useContext} from "react";

import {GuildContext} from "contexts/guild/GuildContext";
import CreateButton from "./CreateButton";
import {useActionBanner} from "../../components/ActionBanner";
import BackNavButton from "components/navigation/BackNavButton";
import {useActionInfo} from "contexts/actions/ActionDetailContext";

export function useBanner() {
    const { id: serverId } = useContext(GuildContext);
    const info = useActionInfo();

    const items = [
        <BackNavButton to={`/guild/${serverId}/actions`} zh="返回動作" en="Back to Actions" ariaLabel="Back to Actions" />,
    ];

    if (!info?.readOnly) {
        items.push(<CreateButton />);
    }

    useActionBanner(items)
}