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
import PageSection from "components/layout/PageSection";

export default function Overview() {
    const user = useContext(UserDataContext);
    const { id, banner, username, avatar } = user;

    const guildsQuery = useGuilds();
    const guilds = guildsQuery.data;

    const joinedCount = guilds ? guilds.filter((g) => g.exist).length : undefined;
    const totalCount = guilds ? guilds.length : undefined;

    return (
        <PageContainer withTopPadding={false}>
            <PageHeader
                icon={<LayoutPanelTop size={24} />}
                title={<Locale zh="儀表板首頁" en="Dashboard Home" />}
                description={<Locale zh="管理您的個人資料、檢視伺服器清單，並快速進入任何已連線的社群。" en="Review your profile, browse connected servers, and jump into the communities you manage." />}
                meta={
                    totalCount != null ? (
                        <>
                            <span>{joinedCount} <Locale zh="已加入" en="joined" /></span>
                            <span className="h-1 w-1 rounded-full bg-(--text-muted)" />
                            <span>{totalCount} <Locale zh="伺服器可見" en="servers visible" /></span>
                        </>
                    ) : null
                }
            />

            <PageSection
                title={<Locale zh="個人資料" en="Your Profile" />}
                description={<Locale zh="帳號資訊與個人化偏好設定。" en="Account overview and personalization preferences." />}
            >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <Banner
                        banner={banner && bannerToUrl(id, banner)}
                        avatar={avatarToUrl(id, avatar)}
                        name={username}
                        joinedServers={joinedCount}
                        servers={totalCount}
                    />
                    <Settings />
                </div>
            </PageSection>

            <ServerPicker query={guildsQuery} />
        </PageContainer>
    );
}
