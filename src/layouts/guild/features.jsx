import React, { Fragment, useContext } from "react";
import { Outlet } from "react-router-dom";
import { LayoutContext, LayoutProvider } from "../../contexts/layouts/LayoutContext";
import Banner from "../../components/card/Banner";
import bannerImg from "assets/img/common/FeatureBanner.png";
import { useLocale } from "../../utils/Language";
import { usePageInfo } from "../../contexts/PageInfoContext";
import { FeaturesProvider } from "../../contexts/FeaturesContext";
import PageContainer from "components/layout/PageContainer";

export function FeaturesLayout() {
    return <FeaturesProvider>
        <LayoutProvider>
            <PageContainer>
                <Content />
            </PageContainer>
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
            <div className="grid grid-cols-12 gap-6 pb-2">
                <div className="col-span-12 xl:col-span-8">
                    <div className="flex flex-col gap-5">
                        <BannerWrapper banner={banner} />
                        <Outlet />
                    </div>
                </div>
                <div className="col-span-12 xl:col-span-4">
                    <div className="flex flex-col gap-5 xl:sticky xl:top-26">
                        {dataList}
                    </div>
                </div>
            </div>
        );
    } else {
        return <div className="flex flex-col gap-5 pb-2">
            <BannerWrapper banner={banner} />
            <Outlet />
        </div>
    }
}
