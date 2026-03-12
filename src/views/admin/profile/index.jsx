import Banner from "views/admin/profile/components/Banner";
import ServerPicker from "views/admin/profile/components/ServerPicker";
import React, { useContext } from "react";
import { LayoutPanelTop, Sparkles, Bot, ShieldCheck, ExternalLink } from "lucide-react";
import { UserDataContext } from "contexts/UserDataContext";
import { avatarToUrl, bannerToUrl, useGuilds } from "api/discord/DiscordApi";
import { Locale, useLocale } from "utils/Language";
import PageContainer from "components/layout/PageContainer";
import PageHeader from "components/layout/PageHeader";
import PageSection from "components/layout/PageSection";
import Card from "components/card/Card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { Link } from "react-router-dom";
import { config } from "config/config";
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
                title={<Locale zh="Cinnetron 控制中心" en="Cinnetron Control Center" />}
                description={<Locale zh="您的品牌化管理入口：檢視身份、快速啟動伺服器管理，並集中操作 Cinnetron。" en="Your branded command hub: review identity, launch server management quickly, and run everything from one Cinnetron home." />}
                meta={
                    totalCount != null ? (
                        <>
                            <Badge variant="green" className="gap-1.5">
                                <Sparkles size={13} />
                                {config.name}
                            </Badge>
                            <span>{joinedCount} <Locale zh="已加入" en="joined" /></span>
                            <span className="h-1 w-1 rounded-full bg-(--text-muted)" />
                            <span>{totalCount} <Locale zh="伺服器可見" en="servers visible" /></span>
                        </>
                    ) : null
                }
            />

            <PageSection
                title={<Locale zh="品牌與身份" en="Brand & Identity" />}
                description={<Locale zh="以 Cinnetron 為核心查看帳號與品牌狀態。" en="Keep your account and brand state centered around Cinnetron." />}
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
            <div className="flex h-full flex-col gap-5">
                <div className="space-y-2">
                    <p className="font-['Space_Grotesk'] text-xl font-bold text-(--text-primary)">
                        <Locale zh="Cinnetron 品牌控制" en="Cinnetron Brand Controls" />
                    </p>
                    <p className="text-sm text-(--text-secondary)">
                        <Locale
                            zh="快速前往最常用功能：進入伺服器儀表板、邀請機器人、擴充管理範圍。"
                            en="Jump into what matters most: open a server dashboard, invite the bot, and expand your management footprint."
                        />
                    </p>
                </div>

                <div className="grid gap-3">
                    <FeatureRow
                        icon={<Bot size={16} />}
                        title={<Locale zh="品牌一致性" en="Brand Consistency" />}
                        text={<Locale zh="所有入口與文案已對齊 Cinnetron 品牌命名。" en="All key entry points now align with Cinnetron naming." />}
                    />
                    <FeatureRow
                        icon={<ShieldCheck size={16} />}
                        title={<Locale zh="安全預設" en="Secure Defaults" />}
                        text={<Locale zh="儀表板維持安全標頭與穩健連線行為。" en="Dashboard defaults include hardened headers and resilient connectivity." />}
                    />
                </div>

                <div className="mt-auto flex flex-wrap gap-2">
                    {managedGuildId ? (
                        <Button asChild size="sm">
                            <Link to={`/guild/${managedGuildId}/dashboard`}>
                                <Locale zh="打開伺服器儀表板" en="Open Server Dashboard" />
                            </Link>
                        </Button>
                    ) : null}
                    <Button asChild variant="outline" size="sm">
                        <Link to="/invite" target="_blank">
                            <Locale zh="邀請 Cinnetron" en="Invite Cinnetron" />
                            <ExternalLink size={14} className="ml-1" />
                        </Link>
                    </Button>
                </div>
            </div>
        </Card>
    );
}

function FeatureRow({ icon, title, text }) {
    return (
        <div className="flex items-start gap-3 rounded-2xl border border-(--border-subtle) bg-(--surface-card) p-3.5">
            <div className="mt-0.5 rounded-xl bg-(--surface-primary) p-2 text-(--accent-primary)">{icon}</div>
            <div className="min-w-0">
                <p className="font-semibold text-(--text-primary)">{title}</p>
                <p className="mt-1 text-sm text-(--text-secondary)">{text}</p>
            </div>
        </div>
    );
}
