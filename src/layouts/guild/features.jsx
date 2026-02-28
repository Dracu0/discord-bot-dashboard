import { Box, Flex, Grid, Transition } from "@mantine/core";
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
            <Box pt={PAGE_PT}>
                <Content />
            </Box>
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
            <Grid mb={20} gutter={20}>
                <Grid.Col span={{ base: 12, xl: 8 }}>
                    <Flex direction="column" mb={10}>
                        <BannerWrapper banner={banner} />
                        <Outlet />
                    </Flex>
                </Grid.Col>
                <Grid.Col span={{ base: 12, xl: 4 }}>
                    <Flex direction="column">
                        {dataList}
                    </Flex>
                </Grid.Col>
            </Grid>
        );
    } else {
        return <Flex direction="column" mb={10}>
            <BannerWrapper banner={banner} />
            <Outlet />
        </Flex>
    }
}