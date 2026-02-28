import { Box, Divider, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import React, { useContext, useMemo } from "react";
import { usePageInfo } from "../../../contexts/PageInfoContext";
import { GuildDetailContext, ServerDetailProvider } from "../../../contexts/guild/GuildDetailContext";
import { useQuery } from "@tanstack/react-query";
import { getServerAdvancedDetails } from "api/internal";
import { QueryHolderSkeleton } from "contexts/components/AsyncContext";
import { GuildContext } from "contexts/guild/GuildContext";
import { DataList } from "components/card/data/DataCard";
import { config } from "config/config";
import { usePageState } from "utils/State";
import { useLocale, Locale } from "utils/Language";
import { PAGE_PT } from "utils/layout-tokens";
import NotificationFeed from "components/card/NotificationFeed";
import { UserDataContext } from "contexts/UserDataContext";

export default function Dashboard() {
    const locale = useLocale()

    usePageInfo(locale({ zh: "儀表板", en: "Dashboard" }))

    return <ServerDetailProvider>
        <UserReports />
    </ServerDetailProvider>
}

export function UserReports() {
    const { detail } = useContext(GuildDetailContext)
    const { id: serverId } = useContext(GuildContext)
    const user = useContext(UserDataContext)
    const data = config.data.dashboard

    const query = useQuery({
        queryKey: ["server_advanced_detail"],
        queryFn: () => getServerAdvancedDetails(serverId),
        enabled: data.some(row => row.advanced)
    })

    return (
        <Box pt={PAGE_PT}>
            {user && (
                <Box mb={24}>
                    <Title order={2} c="var(--text-primary)" ff="'Space Grotesk', sans-serif" fw={700}>
                        <Locale
                            zh={`歡迎回來, ${user.username}`}
                            en={`Welcome back, ${user.username}`}
                        />
                    </Title>
                    <Text c="var(--text-secondary)" fz="sm" mt={4}>
                        <Locale zh="這是您伺服器的概覽" en="Here's an overview of your server" />
                    </Text>
                </Box>
            )}
            <NotificationFeed />
            <Stack gap={32} align="stretch">
                {data.map((row, key) => {
                    const count = row.count

                    return (
                        <Box key={key}>
                            {row.label && <SectionHeader label={row.label} />}
                            <SimpleGrid
                                cols={{ base: 1, md: Math.min(2, count), "2xl": count }}
                                spacing={20}
                            >
                                {row.advanced ? (
                                    <QueryHolderSkeleton query={query} height="400px" count={row.count}>
                                        {() => <Data row={row} detail={query.data} />}
                                    </QueryHolderSkeleton>
                                ) : (
                                    <Data row={row} detail={detail} />
                                )}
                            </SimpleGrid>
                        </Box>
                    )
                })}
            </Stack>
        </Box>
    );
}

function SectionHeader({ label }) {
    return (
        <Box mb={16}>
            <Title
                order={3}
                c="var(--text-primary)"
                mb={8}
                ff="'Space Grotesk', sans-serif"
                lts="-0.01em"
            >
                {label}
            </Title>
            <Divider color="var(--border-subtle)" opacity={0.4} />
        </Box>
    )
}

function Data({ row, detail }) {
    const state = usePageState()

    const items = useMemo(
        () => row.items(detail, state),
        [detail, ...Object.values(state)]
    )

    return <DataList items={items} />
}