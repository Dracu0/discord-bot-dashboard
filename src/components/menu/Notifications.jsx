import { Badge, Flex, Indicator, Menu, Text, UnstyledButton } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useContext } from "react";
import { GuildContext } from "../../contexts/guild/GuildContext";
import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../../api/internal";
import { IconBell } from "@tabler/icons-react";
import { Locale } from "../../utils/Language";
import { QueryHolderSkeleton } from "../../contexts/components/AsyncContext";
import { NotificationItem } from "./NotificationItem";

export function Notifications() {
    const [opened, { open, close }] = useDisclosure();

    const { id: serverId } = useContext(GuildContext);

    const query = useQuery({
        queryKey: ["notifications", serverId],
        queryFn: () => getNotifications(serverId),
        staleTime: 60_000,
        refetchInterval: 60_000,
    });

    const count = query.data?.length ?? 0;

    return (
        <Menu opened={opened} onClose={close} position="bottom-end" width={400} withinPortal>
            <Menu.Target>
                <UnstyledButton onClick={open} p={0} aria-label="Notifications">
                    <Indicator
                        size={16}
                        label={count > 0 ? count : undefined}
                        disabled={count === 0}
                        color="red"
                        offset={2}
                    >
                        <IconBell size={20} color="var(--text-secondary)" />
                    </Indicator>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown
                p={20}
                style={{
                    borderRadius: "var(--radius-lg)",
                    backgroundColor: "var(--surface-primary)",
                    zIndex: 1500,
                }}
            >
                <Text w="100%" mb={20} fz="md" fw={600} c="var(--text-primary)">
                    <Locale zh="通知" en="Notifications" />
                    {count > 0 && (
                        <Badge ml="xs" size="sm" color="blue" variant="light" radius="xl">
                            {count}
                        </Badge>
                    )}
                </Text>
                <Flex direction="column" gap={12}>
                    <QueryHolderSkeleton query={query} height="100px" count={2}>
                        {() =>
                            query.data && query.data.length > 0
                                ? query.data.map((item, key) => (
                                    <Menu.Item key={key} style={{ borderRadius: 8, padding: 0 }}>
                                        <NotificationItem {...item} />
                                    </Menu.Item>
                                ))
                                : <Text fz="sm" c="var(--text-secondary)" ta="center" py="md">
                                    <Locale zh="暫無通知" en="No notifications" />
                                </Text>
                        }
                    </QueryHolderSkeleton>
                </Flex>
            </Menu.Dropdown>
        </Menu>
    );
}