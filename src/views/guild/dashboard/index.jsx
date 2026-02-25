// Chakra imports
import { Box, Divider, Heading, SimpleGrid, VStack } from "@chakra-ui/react";
// Custom components
import React, { useContext, useMemo } from "react";
import { usePageInfo } from "../../../contexts/PageInfoContext";
import { GuildDetailContext, ServerDetailProvider } from "../../../contexts/guild/GuildDetailContext";
import { useQuery } from "react-query";
import { getServerAdvancedDetails } from "api/internal";
import { QueryHolderSkeleton } from "contexts/components/AsyncContext";
import { GuildContext } from "contexts/guild/GuildContext";
import { DataList } from "components/card/data/DataCard";
import { config } from "config/config";
import { usePageState } from "utils/State";
import { useLocale } from "utils/Language";
import { useDetailColor, useTextColor } from "utils/colors";

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
    const data = config.data.dashboard

    const query = useQuery(
        "server_advanced_detail",
        () => getServerAdvancedDetails(serverId),
        {
            enabled: data.some(row => row.advanced)
        }
    )

    return (
        <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
            <VStack spacing="32px" align="stretch">
                {data.map((row, key) => {
                    const count = row.count

                    return (
                        <Box key={key}>
                            {row.label && <SectionHeader label={row.label} />}
                            <SimpleGrid
                                columns={{ base: 1, md: Math.min(2, count), "2xl": count }}
                                gap="20px"
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
            </VStack>
        </Box>
    );
}

function SectionHeader({ label }) {
    const textColor = useTextColor()
    const borderColor = useDetailColor()

    return (
        <Box mb="16px">
            <Heading size="md" color={textColor} mb="8px">
                {label}
            </Heading>
            <Divider borderColor={borderColor} opacity={0.4} />
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