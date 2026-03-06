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
        zh: "\u5be9\u6838\u5efa\u8b70\u3001\u67e5\u770b\u5be9\u6838\u6b77\u53f2\u4e26\u7ba1\u7406\u4f3a\u670d\u5668\u4efb\u52d9",
        en: "Review suggestions, view moderation history, and manage server tasks"
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
