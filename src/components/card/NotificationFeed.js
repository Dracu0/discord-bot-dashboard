import React, { useContext } from "react";
import {
    Box,
    HStack,
    Icon,
    Text,
    VStack,
    Badge,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import { getNotifications } from "api/internal";
import { GuildContext } from "contexts/guild/GuildContext";
import { useNeuSubtle, useTextColor, useDetailColor } from "utils/colors";
import { IoAlertCircle, IoShield, IoCheckmarkCircle } from "react-icons/io5";

const TYPE_CONFIG = {
    info: { icon: IoAlertCircle, color: "blue", label: "Info" },
    moderation: { icon: IoShield, color: "orange", label: "Mod" },
    success: { icon: IoCheckmarkCircle, color: "green", label: "OK" },
};

function NotificationItem({ notification }) {
    const cardBg = useNeuSubtle();
    const textColor = useTextColor();
    const detailColor = useDetailColor();
    const cfg = TYPE_CONFIG[notification.type] || TYPE_CONFIG.info;

    return (
        <HStack
            p="12px 16px"
            bg={cardBg}
            borderRadius="12px"
            spacing="12px"
            align="center"
        >
            <Icon as={cfg.icon} boxSize="18px" color={`${cfg.color}.400`} />
            <Text fontSize="sm" color={textColor} flex="1" noOfLines={1}>
                {notification.message}
            </Text>
            {notification.time && (
                <Text fontSize="xs" color={detailColor} whiteSpace="nowrap">
                    {new Date(notification.time).toLocaleDateString()}
                </Text>
            )}
            <Badge
                colorScheme={cfg.color}
                fontSize="10px"
                borderRadius="6px"
                px="6px"
            >
                {cfg.label}
            </Badge>
        </HStack>
    );
}

export default function NotificationFeed() {
    const { id: serverId } = useContext(GuildContext);
    const textColor = useTextColor();

    const { data: notifications } = useQuery(
        ["notifications", serverId],
        () => getNotifications(serverId),
        { staleTime: 60_000, refetchInterval: 60_000 }
    );

    if (!notifications || notifications.length === 0) return null;

    return (
        <Box mb="24px">
            <Text
                fontSize="sm"
                fontWeight="600"
                color={textColor}
                mb="10px"
                fontFamily="'Space Grotesk', sans-serif"
                letterSpacing="-0.01em"
            >
                Notifications
            </Text>
            <VStack spacing="8px" align="stretch">
                {notifications.map((n, i) => (
                    <NotificationItem key={i} notification={n} />
                ))}
            </VStack>
        </Box>
    );
}
