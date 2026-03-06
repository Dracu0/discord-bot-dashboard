import Banner from "views/admin/profile/components/Banner";
import Settings from "components/card/Settings";
import ServerPicker from "views/admin/profile/components/ServerPicker";
import React, { useContext } from "react";
import { LayoutPanelTop } from "lucide-react";
import { UserDataContext } from "contexts/UserDataContext";
import { avatarToUrl, bannerToUrl, useGuilds } from "api/discord/DiscordApi";
import { Locale } from "utils/Language";
import PageContainer from "components/layout/PageContainer";
import PageHeader from "components/layout/PageHeader";

export default function Overview() {
    const user = useContext(UserDataContext);
    const { id, banner, username, avatar } = user;

    const guildsQuery = useGuilds();

    const guilds = guildsQuery.data;

    return (
        <PageContainer withTopPadding={false} className="py-8 md:py-10">
            <PageHeader
                icon={<LayoutPanelTop size={24} />}
                title={<Locale zh="儀表板首頁" en="Dashboard Home" />}
                description={<Locale zh="管理您的個人資料、檢視伺服器清單，並快速進入任何已連線的社群。" en="Review your profile, browse connected servers, and jump into the communities you manage." />}
            />
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
        </PageContainer>
    );
}
