import React from "react";
import { useLocale } from "../../utils/Language";
import { LayoutProvider } from "../../contexts/layouts/LayoutContext";
import bannerImg from "../../assets/img/common/ActionBanner.png";
import { ActionsDataProvider } from "../../contexts/actions/ActionsDataContext";
import GuildPanelLayout from "components/layout/GuildPanelLayout";

export function ActionsLayout() {
    const locale = useLocale()

    return <ActionsDataProvider>
        <LayoutProvider>
            <GuildPanelLayout
                pageTitle={locale({zh: "動作面板", en: "Actions"})}
                defaultBannerImage={bannerImg}
                bannerClip={false}
            />
        </LayoutProvider>
    </ActionsDataProvider>
}
