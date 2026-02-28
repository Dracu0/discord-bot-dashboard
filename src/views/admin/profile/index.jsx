import { Box, Grid } from "@mantine/core";

// Custom components
import Banner from "views/admin/profile/components/Banner";
import Settings from "components/card/Settings";
import ServerPicker from "views/admin/profile/components/ServerPicker";

// Assets
import React, { useContext } from "react";
import { UserDataContext } from "contexts/UserDataContext";
import { avatarToUrl, bannerToUrl, useGuilds } from "api/discord/DiscordApi";

export default function Overview() {
    const user = useContext(UserDataContext);
    const { id, banner, username, avatar } = user;

    const guildsQuery = useGuilds();

    const guilds = guildsQuery.data;

    return (
        <Box pt={{ base: 30, md: 80 }}>
            <Grid>
                <Grid.Col span={{ base: 12, lg: 7 }}>
                    <Banner
                        banner={banner && bannerToUrl(id, banner)}
                        avatar={avatarToUrl(id, avatar)}
                        name={username}
                        joinedServers={guilds && guilds.filter((g) => g.exist).length}
                        servers={guilds && guilds.length}
                    />
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 5 }}>
                    <Settings />
                </Grid.Col>
            </Grid>
            <ServerPicker query={guildsQuery} />
        </Box>
    );
}