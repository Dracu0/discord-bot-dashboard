import React, {useContext, useMemo} from "react";

// Custom components
import ActionsList from "./components/ActionsList";
import {ActionsDataContext} from "../../../contexts/actions/ActionsDataContext";
import {DataList} from "components/card/data/DataCard";
import {config} from "config/config";
import {Locale, useLocale} from "utils/Language";
import {useLayoutUpdate} from "contexts/layouts/LayoutContext";
import {BannerButton} from "components/card/Banner";
import {QueryHolderSkeleton} from "contexts/components/AsyncContext";

import {Play} from "lucide-react";

export default function ActionsBoard() {
    const locale = useLocale()
    const bannerTitle = locale({
        zh: "\u4f3a\u670d\u5668\u52d5\u4f5c",
        en: "Server Actions"
    })
    const bannerDescription = locale({
        zh: "管理建議、審核紀錄與伺服器任務",
        en: "Manage suggestions, moderation history, and server tasks"
    })
    const dataList = useMemo(
        () => (config.data.actions ? <ActionsData /> : null),
        []
    )
    const layoutProps = useMemo(() => ({
        banner: {
            title: bannerTitle,
            description: bannerDescription,
            buttons: [config.tutorialUrl && <TutorialButton key="tutorial" />].filter(Boolean)
        },
        dataList
    }), [bannerDescription, bannerTitle, dataList])

    useLayoutUpdate(layoutProps)

    return <ActionsList />
}

function TutorialButton() {
    return <BannerButton
        leftIcon={<Play size={20} />}
        url={config.tutorialUrl}
    >
        <Locale zh="\u89c0\u770b\u6559\u7a0b" en="Watch Tutorial" />
    </BannerButton>
}

function ActionsData() {
    const { data, query } = useContext(ActionsDataContext)

    return <QueryHolderSkeleton query={query} height={200} count={2}>
        <DataList items={config.data.actions(data)}/>
    </QueryHolderSkeleton>
}
