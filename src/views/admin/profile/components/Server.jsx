import { Avatar, Button, Flex, Stack, Text } from "@mantine/core";
import { Link } from "react-router-dom";
import Card from "components/card/Card";
import React from "react";
import { iconToUrl } from "api/discord/DiscordApi";
import { Locale } from "utils/Language";
import { useCardBg, useTextColor } from "../../../../utils/colors";

export default function Server({ server, ...rest }) {
    const { name, id, icon } = server;

    const textColorPrimary = useTextColor();
    const bg = useCardBg();

    return (
        <Card
            style={{ backgroundColor: bg, cursor: "pointer", transition: "all 0.25s ease" }}
            {...rest}
            p={14}
        >
            <Flex align="center" direction={{ base: "column", md: "row" }}>
                <Avatar
                    size={140}
                    src={icon && iconToUrl(id, icon)}
                    name={name}
                    style={{ borderRadius: 16 }}
                    me={20}
                />
                <Stack mt={{ base: 10, md: 0 }} align={{ base: "center", md: "flex-start" }}>
                    <Text c={textColorPrimary} fw={600} fz="2xl" mb={4} ff="'Space Grotesk', sans-serif">
                        {name}
                    </Text>
                    {server.exist ? <ConfigButton server={server} /> : <InviteButton />}
                </Stack>
            </Flex>
        </Card>
    );
}

function InviteButton() {
    return (
        <Button component={Link} to="/invite" target="_blank" fw={500} variant="outline" fz="md">
            <Locale zh="邀請到服務器" en="Invite to Server" />
        </Button>
    );
}

function ConfigButton({ server }) {
    return (
        <Button component={Link} to={`/guild/${server.id}`} fw={500} variant="filled" color="brand" fz="md">
            <Locale zh="配置服務器" en="Customize" />
        </Button>
    );
}
      <Locale zh="配置服務器" en="Customize" />

