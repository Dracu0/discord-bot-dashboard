import React from "react";
import { Avatar, Tooltip, Group, Text, Badge } from "@mantine/core";

// ── Presentational wrappers for Storybook (no hooks) ──

function ActiveUsersPresentation({ users }) {
    if (!users || users.length === 0) return null;
    return (
        <Group gap={4} align="center">
            <Text fz="xs" c="dimmed" mr={4}>Online</Text>
            <Avatar.Group spacing="sm">
                {users.slice(0, 5).map((u) => (
                    <Tooltip key={u.userId} label={`${u.username} — ${u.page || "?"}`} withArrow>
                        <Avatar src={null} alt={u.username} size={28} radius="xl" color="blue">
                            {u.username?.[0]?.toUpperCase()}
                        </Avatar>
                    </Tooltip>
                ))}
                {users.length > 5 && (
                    <Tooltip label={users.slice(5).map((u) => u.username).join(", ")} withArrow>
                        <Avatar size={28} radius="xl" color="gray">+{users.length - 5}</Avatar>
                    </Tooltip>
                )}
            </Avatar.Group>
        </Group>
    );
}

function BotStatusPresentation({ status, ping }) {
    const STATUS_MAP = {
        online: { color: "green", label: "Online" },
        idle: { color: "yellow", label: "Idle" },
        dnd: { color: "red", label: "Busy" },
        offline: { color: "gray", label: "Offline" },
    };
    const cfg = STATUS_MAP[status] || STATUS_MAP.offline;
    return (
        <Group gap={8} align="center">
            <Tooltip label={ping != null ? `Ping: ${ping}ms` : "No data yet"} position="bottom">
                <Badge color={cfg.color} variant="dot" size="lg" radius="md" styles={{ root: { cursor: "default", textTransform: "none" } }}>
                    <Text component="span" fz="xs" fw={600}>{cfg.label}</Text>
                </Badge>
            </Tooltip>
        </Group>
    );
}

// ── Stories ──

export default {
    title: "Dashboard/StatusIndicators",
};

export const BotOnline = () => <BotStatusPresentation status="online" ping={42} />;
export const BotIdle = () => <BotStatusPresentation status="idle" ping={120} />;
export const BotBusy = () => <BotStatusPresentation status="dnd" ping={300} />;
export const BotOffline = () => <BotStatusPresentation status="offline" />;

const sampleUsers = [
    { userId: "1", username: "Alice", avatar: null, page: "Dashboard" },
    { userId: "2", username: "Bob", avatar: null, page: "Welcome Config" },
    { userId: "3", username: "Charlie", avatar: null, page: "Mod Logs" },
];

const manyUsers = [
    ...sampleUsers,
    { userId: "4", username: "Diana", avatar: null, page: "Dashboard" },
    { userId: "5", username: "Eve", avatar: null, page: "Settings" },
    { userId: "6", username: "Frank", avatar: null, page: "Leaderboard" },
    { userId: "7", username: "Grace", avatar: null, page: "Analytics" },
];

export const ActiveUsersThree = () => <ActiveUsersPresentation users={sampleUsers} />;
export const ActiveUsersOverflow = () => <ActiveUsersPresentation users={manyUsers} />;
export const ActiveUsersEmpty = () => <ActiveUsersPresentation users={[]} />;
