import React from "react";
import { LayoutProvider } from "../../contexts/layouts/LayoutContext";
import bannerImg from "assets/img/common/FeatureBanner.png";
import { useLocale } from "../../utils/Language";
import { FeaturesGate } from "../../contexts/FeaturesContext";
import GuildPanelLayout from "components/layout/GuildPanelLayout";

export function FeaturesLayout() {
    const locale = useLocale()

    return <FeaturesGate>
        <LayoutProvider>
            <GuildPanelLayout
                pageTitle={locale({ zh: "功能面板", en: "Features" })}
                defaultBannerImage={bannerImg}
            />
        </LayoutProvider>
    </FeaturesGate>
}
