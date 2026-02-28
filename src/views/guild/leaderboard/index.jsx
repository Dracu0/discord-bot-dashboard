import React, { useContext, useState } from "react";
import {
    Box, Center, Group, Loader, Pagination, Table, Text, Title,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { IconTrophy } from "@tabler/icons-react";
import { GuildContext } from "contexts/guild/GuildContext";
import { getLeaderboard } from "api/internal";
import { usePageInfo } from "contexts/PageInfoContext";
import { useTranslation } from "utils/Language";
import { PAGE_PT } from "utils/layout-tokens";
import Card from "components/card/Card";

export default function Leaderboard() {
    usePageInfo({ zh: "排行榜", en: "Leaderboard" });
    const { id: serverId } = useContext(GuildContext);
    const [page, setPage] = useState(1);
    const { t } = useTranslation();

    const query = useQuery({
        queryKey: ["leaderboard", serverId, page],
        queryFn: () => getLeaderboard(serverId, page),
        placeholderData: (prev) => prev,
    });

    if (query.isLoading && !query.data) {
        return (
            <Center pt={PAGE_PT} h={400}>
                <Loader size="lg" />
            </Center>
        );
    }

    if (query.isError) {
        return (
            <Box pt={PAGE_PT}>
                <Text c="red">{t("leaderboard.loadFailed")}</Text>
            </Box>
        );
    }

    const data = query.data;

    return (
        <Box pt={PAGE_PT}>
            <Group gap="sm" mb={24}>
                <IconTrophy size={28} color="var(--accent-primary)" />
                <Title order={2} c="var(--text-primary)" ff="'Space Grotesk', sans-serif" fw={700}>
                    {t("leaderboard.title")}
                </Title>
                <Text c="var(--text-secondary)" fz="sm">
                    ({data.total} {t("common.users")})
                </Text>
            </Group>

            <Card px={0} style={{ overflowX: "auto" }}>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th style={{ background: "var(--surface-secondary)", borderColor: "var(--border-subtle)" }}>
                                <Text fz="xs" c="gray.4" fw={700}>Rank</Text>
                            </Table.Th>
                            <Table.Th style={{ background: "var(--surface-secondary)", borderColor: "var(--border-subtle)" }}>
                                <Text fz="xs" c="gray.4" fw={700}>User</Text>
                            </Table.Th>
                            <Table.Th style={{ background: "var(--surface-secondary)", borderColor: "var(--border-subtle)" }}>
                                <Text fz="xs" c="gray.4" fw={700}>Level</Text>
                            </Table.Th>
                            <Table.Th style={{ background: "var(--surface-secondary)", borderColor: "var(--border-subtle)" }}>
                                <Text fz="xs" c="gray.4" fw={700}>XP</Text>
                            </Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {data.users.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={4} style={{ border: "none" }}>
                                    <Center py={32}>
                                        <Text c="dimmed">{t("leaderboard.noData")}</Text>
                                    </Center>
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            data.users.map((user, i) => (
                                <Table.Tr
                                    key={user.userId}
                                    style={{ background: i % 2 === 1 ? "var(--surface-secondary)" : "transparent" }}
                                >
                                    <Table.Td style={{ border: "none" }}>
                                        <Text fz="md" fw={700} c={user.rank <= 3 ? "var(--accent-primary)" : "var(--text-primary)"}>
                                            #{user.rank}
                                        </Text>
                                    </Table.Td>
                                    <Table.Td style={{ border: "none" }}>
                                        <Text fz="md" fw={700} c="var(--text-primary)">{user.userName}</Text>
                                    </Table.Td>
                                    <Table.Td style={{ border: "none" }}>
                                        <Text fz="md" fw={700} c="var(--text-primary)">{user.level}</Text>
                                    </Table.Td>
                                    <Table.Td style={{ border: "none" }}>
                                        <Text fz="md" c="var(--text-primary)">{user.xp.toLocaleString()}</Text>
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        )}
                    </Table.Tbody>
                </Table>

                {data.totalPages > 1 && (
                    <Center py={16}>
                        <Pagination total={data.totalPages} value={page} onChange={setPage} />
                    </Center>
                )}
            </Card>
        </Box>
    );
}
