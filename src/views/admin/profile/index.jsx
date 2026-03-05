// Custom components
import Banner from "views/admin/profile/components/Banner";
import Settings from "components/card/Settings";
import ServerPicker from "views/admin/profile/components/ServerPicker";

// Assets
import React, { useContext } from "react";
import { UserDataContext } from "contexts/UserDataContext";
import { avatarToUrl, bannerToUrl, useGuilds } from "api/discord/DiscordApi";
import { Locale } from "utils/Language";

export default function Overview() {
    const user = useContext(UserDataContext);
    const { id, banner, username, avatar } = user;

    const guildsQuery = useGuilds();

    const guilds = guildsQuery.data;

    return (
        <div className="pt-[30px] md:pt-20">
            <div className="grid grid-cols-12 gap-5">
                <div className="col-span-12 lg:col-span-7">
                    <Banner
                        banner={banner && bannerToUrl(id, banner)}
                        avatar={avatarToUrl(id, avatar)}
                        name={username}
                        joinedServers={guilds && guilds.filter((g) => g.exist).length}
                        servers={guilds && guilds.length}
                    />
                </div>
                <div className="col-span-12 lg:col-span-5">
                    <Settings />
                </div>
            </div>
            <ServerPicker query={guildsQuery} />
        </div>
    );
}
