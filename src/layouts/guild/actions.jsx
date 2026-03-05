import React, { Fragment, useContext } from "react";
import { usePageInfo } from "../../contexts/PageInfoContext";
import { useLocale } from "../../utils/Language";
import { LayoutContext, LayoutProvider } from "../../contexts/layouts/LayoutContext";
import bannerImg from "../../assets/img/common/ActionBanner.png";
import Banner from "../../components/card/Banner";
import { Outlet } from "react-router-dom";
import { PAGE_PT } from "../../utils/layout-tokens";

export function ActionsLayout() {
    const locale = useLocale()

    usePageInfo(
        locale({zh: "動作面板", en: "Actions"})
    );

    return <LayoutProvider>
        <div style={{ paddingTop: PAGE_PT }}>
            <Content />
        </div>
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
        return <div className="flex flex-col mb-[30px]">
            <BannerWrapper banner={banner} />
            <Outlet />
        </div>
    }
}
