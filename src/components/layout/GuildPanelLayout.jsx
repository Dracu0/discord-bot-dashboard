import React, { Fragment, useContext } from "react";
import { Outlet } from "react-router-dom";

import Banner from "components/card/Banner";
import { usePageInfo } from "contexts/PageInfoContext";
import { LayoutContext } from "contexts/layouts/LayoutContext";

import PageContainer from "./PageContainer";

function LayoutBanner({ banner, defaultImage, clip }) {
    if (!banner) return null;

    const image = banner.image || defaultImage;
    const buttons = Array.isArray(banner.buttons) ? banner.buttons.filter(Boolean) : [];

    return (
        <Banner {...banner} image={image} clip={clip}>
            {buttons.map((button, index) => (
                <Fragment key={index}>{button}</Fragment>
            ))}
        </Banner>
    );
}

export default function GuildPanelLayout({ pageTitle, defaultBannerImage, bannerClip }) {
    const { banner, dataList } = useContext(LayoutContext);

    usePageInfo(pageTitle);

    if (dataList) {
        return (
            <PageContainer>
                <div className="grid grid-cols-12 gap-6 pb-2">
                    <div className="col-span-12 xl:col-span-8">
                        <div className="flex flex-col gap-5">
                            <LayoutBanner banner={banner} defaultImage={defaultBannerImage} clip={bannerClip} />
                            <Outlet />
                        </div>
                    </div>
                    <div className="col-span-12 xl:col-span-4">
                        <div className="flex flex-col gap-5 xl:sticky" style={{ top: "calc(var(--page-top-offset, 96px) - 8px)" }}>
                            {dataList}
                        </div>
                    </div>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div className="flex flex-col gap-5 pb-2">
                <LayoutBanner banner={banner} defaultImage={defaultBannerImage} clip={bannerClip} />
                <Outlet />
            </div>
        </PageContainer>
    );
}