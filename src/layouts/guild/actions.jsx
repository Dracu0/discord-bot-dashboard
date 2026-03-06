import React, { Fragment, useContext } from "react";
import { usePageInfo } from "../../contexts/PageInfoContext";
import { useLocale } from "../../utils/Language";
import { LayoutContext, LayoutProvider } from "../../contexts/layouts/LayoutContext";
import bannerImg from "../../assets/img/common/ActionBanner.png";
import Banner from "../../components/card/Banner";
import { Outlet } from "react-router-dom";
import PageContainer from "components/layout/PageContainer";

export function ActionsLayout() {
    const locale = useLocale()

    usePageInfo(
        locale({zh: "動作面板", en: "Actions"})
    );

    return <LayoutProvider>
        <PageContainer>
            <Content />
        </PageContainer>
    </LayoutProvider>
}

function BannerWrapper({banner}) {
    if (banner == null) return <></>
    return (
        <Banner
            image={banner.image || bannerImg}
            title={banner.title}
            description={banner.description}
            clip={false}
        >
            {banner.buttons.map((b, i) =>
                <Fragment key={i}>{b}</Fragment>)
            }
        </Banner>
    );
}

function Content() {
    const {banner, dataList} = useContext(LayoutContext)

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
