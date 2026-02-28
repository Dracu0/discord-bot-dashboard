import { Flex, Menu, Text, UnstyledButton } from "@mantine/core";
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
        enabled: opened,
    });

    return (
        <Menu opened={opened} onClose={close} position="bottom-end" width={400} withinPortal>
            <Menu.Target>
                <UnstyledButton onClick={open} p={0}>
                    <IconBell size={20} color="var(--text-secondary)" />
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
                </Text>
                <Flex direction="column" gap={12}>
                    <QueryHolderSkeleton query={query} height="100px" count={2}>
                        {() =>
                            query.data.map((item, key) => (
                                <Menu.Item key={key} style={{ borderRadius: 8, padding: 0 }}>
                                    <NotificationItem {...item} />
                                </Menu.Item>
                            ))
                        }
                    </QueryHolderSkeleton>
                </Flex>
            </Menu.Dropdown>
        </Menu>
    );
}