import React from "react";
import { Avatar, Tooltip, Group, Text } from "@mantine/core";
import { usePresence } from "hooks/useWebSocket";
import { useLocale } from "utils/Language";

export default function ActiveUsers({ guildId, page }) {
    const users = usePresence(guildId, page);
    const locale = useLocale();

    if (!users || users.length === 0) return null;

    return (
        <Group gap={4} align="center">
            <Text fz="xs" c="dimmed" mr={4}>
                {locale({ zh: "線上", en: "Online" })}
            </Text>
            <Avatar.Group spacing="sm">
                {users.slice(0, 5).map((u) => (
                    <Tooltip
                        key={u.userId}
                        label={`${u.username} — ${u.page || "?"}`}
                        withArrow
                    >
                        <Avatar
                            src={
                                u.avatar
                                    ? `https://cdn.discordapp.com/avatars/${u.userId}/${u.avatar}.webp?size=64`
                                    : null
                            }
                            alt={u.username}
                            size={28}
                            radius="xl"
                            color="blue"
                        >
                            {u.username?.[0]?.toUpperCase()}
                        </Avatar>
                    </Tooltip>
                ))}
                {users.length > 5 && (
                    <Tooltip
                        label={users
                            .slice(5)
                            .map((u) => u.username)
                            .join(", ")}
                        withArrow
                    >
                        <Avatar size={28} radius="xl" color="gray">
                            +{users.length - 5}
                        </Avatar>
                    </Tooltip>
                )}
            </Avatar.Group>
        </Group>
    );
}
