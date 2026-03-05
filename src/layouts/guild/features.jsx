import React, { Fragment, useContext } from "react";
import { Outlet } from "react-router-dom";
import { LayoutContext, LayoutProvider } from "../../contexts/layouts/LayoutContext";
import Banner from "../../components/card/Banner";
import bannerImg from "assets/img/common/FeatureBanner.png";
import { useLocale } from "../../utils/Language";
import { usePageInfo } from "../../contexts/PageInfoContext";
import { FeaturesProvider } from "../../contexts/FeaturesContext";
import { PAGE_PT } from "../../utils/layout-tokens";

export function FeaturesLayout() {
    return <FeaturesProvider>
        <LayoutProvider>
            <div style={{ paddingTop: PAGE_PT }}>
                <Content />
            </div>
        </LayoutProvider>
    </FeaturesProvider>
}

function BannerWrapper({ banner }) {
    if (banner == null) return <></>

    return (
        <Banner image={bannerImg} {...banner}>
            {banner.buttons.map((b, i) =>
                <Fragment key={i}>{b}</Fragment>)
            }
        </Banner>
    )
}

function Content() {
    const { banner, dataList } = useContext(LayoutContext)
    const locale = useLocale()

    usePageInfo(
        locale({ zh: "功能面板", en: "Features" })
    )

    if (dataList) {
        return (
            <div className="grid grid-cols-12 gap-5 mb-5">
                <div className="col-span-12 xl:col-span-8">
                    <div className="flex flex-col mb-2.5">
                        <BannerWrapper banner={banner} />
                        <Outlet />
                    </div>
                </div>
                <div className="col-span-12 xl:col-span-4">
                    <div className="flex flex-col">
                        {dataList}
                    </div>
                </div>
            </div>
        );
    } else {
        return <div className="flex flex-col mb-2.5">
            <BannerWrapper banner={banner} />
            <Outlet />
        </div>
    }
}
