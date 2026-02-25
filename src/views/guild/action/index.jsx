import React, {useContext} from "react";

// Custom components
import ActionsList from "./components/ActionsList";
import {usePageInfo} from "contexts/PageInfoContext";
import {ActionsDataContext, ActionsDataProvider} from "../../../contexts/actions/ActionsDataContext";
import {DataList} from "components/card/data/DataCard";
import {config} from "config/config";
import {Locale, useLocale} from "utils/Language";
import {useLayoutUpdate} from "contexts/layouts/LayoutContext";
import {BannerButton} from "components/card/Banner";

import {BiPlay} from "react-icons/bi";

export default function ActionsBoard() {
    const locale = useLocale()

    useLayoutUpdate({
        banner: {
            title: locale({
                zh: "伺服器動作",
                en: "Server Actions"
            }),
            description: locale({
                zh: "審核建議、查看審核歷史並管理伺服器任務",
                en: "Review suggestions, view moderation history, and manage server tasks"
            }),
            buttons: [config.tutorialUrl && <TutorialButton />]
        },
        dataList: config.data.actions && <ActionsDataProvider>
            <ActionsData />
        </ActionsDataProvider>
    })

    usePageInfo(
        locale({zh: "動作面板", en: "Actions"})
    );

    return <ActionsList />
}

function TutorialButton() {
    return <BannerButton
        leftIcon={<BiPlay size={20} />}
        url={config.tutorialUrl}
    >
        <Locale zh="觀看教程" en="Watch Tutorial" />
    </BannerButton>
}

function ActionsData() {
    const data = useContext(ActionsDataContext)

    return <DataList items={config.data.actions(data)}/>
}