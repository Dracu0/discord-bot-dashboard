import Banner from "views/admin/profile/components/Banner";
import ServerPicker from "views/admin/profile/components/ServerPicker";
import React, { useContext } from "react";
import { LayoutPanelTop } from "lucide-react";
import { UserDataContext } from "contexts/UserDataContext";
import { avatarToUrl, bannerToUrl, useGuilds } from "api/discord/DiscordApi";
import { Locale, useLocale } from "utils/Language";
import PageContainer from "components/layout/PageContainer";
import PageHeader from "components/layout/PageHeader";
import PageSection from "components/layout/PageSection";
import Card from "components/card/Card";
import { Button } from "components/ui/button";
import { Link } from "react-router-dom";
import { usePageInfo } from "contexts/PageInfoContext";

export default function Overview() {
    const user = useContext(UserDataContext);
    const locale = useLocale();
    const { id, banner, username, avatar } = user;

    const guildsQuery = useGuilds();
    const guilds = guildsQuery.data;

    const joinedCount = guilds ? guilds.filter((g) => g.exist).length : undefined;
    const totalCount = guilds ? guilds.length : undefined;
    const managedGuild = guilds?.find((g) => g.exist);

    const pageTitle = locale({ zh: "管理主頁", en: "Admin Home" });
    usePageInfo({
        section: locale({ zh: "控制中心", en: "Control Center" }),
        title: pageTitle,
        trail: [pageTitle],
    });

    return (
        <PageContainer>
            <PageHeader
                icon={<LayoutPanelTop size={24} />}
                title={<Locale zh="管理主頁" en="Admin" />}
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
                title={<Locale zh="帳號" en="Account" />}
            >
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <Banner
                        banner={banner && bannerToUrl(id, banner)}
                        avatar={avatarToUrl(id, avatar)}
                        name={username}
                        joinedServers={joinedCount}
                        servers={totalCount}
                    />
                    <BrandControlCard managedGuildId={managedGuild?.id} />
                </div>
            </PageSection>

            <ServerPicker query={guildsQuery} />
        </PageContainer>
    );
}

function BrandControlCard({ managedGuildId }) {
    return (
        <Card variant="panel" className="h-full">
            <div className="flex h-full flex-col gap-4">
                <div>
                    <p className="font-['Space_Grotesk'] text-xl font-bold text-(--text-primary)">
                        <Locale zh="快速操作" en="Quick Actions" />
                    </p>
                </div>

                <div className="mt-auto flex flex-wrap gap-2">
                    {managedGuildId ? (
                        <Button asChild size="sm">
                            <Link to={`/guild/${managedGuildId}/dashboard`}>
                                <Locale zh="開啟儀表板" en="Open Dashboard" />
                            </Link>
                        </Button>
                    ) : null}
                    <Button asChild variant="outline" size="sm">
                        <Link to="/invite" target="_blank">
                            <Locale zh="邀請機器人" en="Invite Bot" />
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    );
}
