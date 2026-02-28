import { Box, Flex, Grid } from "@mantine/core";
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
        <Box pt={PAGE_PT}>
            <Content />
        </Box>
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
        return <Flex direction="column" mb={30}>
            <BannerWrapper banner={banner} />
            <Outlet />
        </Flex>
    }
}