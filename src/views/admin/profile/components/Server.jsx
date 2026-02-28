import { Avatar, Badge, Button, Flex, Stack, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import Card from "components/card/Card";
import React from "react";
import { iconToUrl } from "api/discord/DiscordApi";
import { Locale } from "utils/Language";

export default function Server({ server, ...rest }) {
    const { name, id, icon } = server;

    return (
        <Card p={16} {...rest}>
            <Flex align="center" direction={{ base: "column", md: "row" }} gap={16}>
                <Avatar
                    size={80}
                    src={icon && iconToUrl(id, icon)}
                    name={name}
                    radius="md"
                    style={{ flexShrink: 0 }}
                />
                <Stack gap={8} align={{ base: "center", md: "flex-start" }} style={{ flex: 1, minWidth: 0 }}>
                    <Flex align="center" gap={8} wrap="wrap" justify={{ base: "center", md: "flex-start" }}>
                        <Text
                            c="var(--text-primary)"
                            fw={600}
                            fz="lg"
                            ff="'Space Grotesk', sans-serif"
                            truncate
                        >
                            {name}
                        </Text>
                        {server.exist && (
                            <Badge variant="light" color="green" size="sm">
                                <Locale zh="已加入" en="Joined" />
                            </Badge>
                        )}
                    </Flex>
                    {server.exist ? <ConfigButton server={server} /> : <InviteButton />}
                </Stack>
            </Flex>
        </Card>
    );
}

function InviteButton() {
    return (
        <Button component={Link} to="/invite" target="_blank" fw={500} variant="outline" fz="sm" radius="md" size="sm">
            <Locale zh="邀請到服務器" en="Invite to Server" />
        </Button>
    );
}

function ConfigButton({ server }) {
    return (
        <Button component={Link} to={`/guild/${server.id}`} fw={500} variant="filled" color="brand" fz="sm" radius="md" size="sm">
            <Locale zh="配置服務器" en="Customize" />
        </Button>
    );
}

