import React, { useContext, useMemo, useState } from "react";
import { LayoutDashboard } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { usePageInfo } from "../../../contexts/PageInfoContext";
import { GuildDetailContext, ServerDetailProvider } from "../../../contexts/guild/GuildDetailContext";
import { getServerAdvancedDetails, getFeatures } from "api/internal";
import { QueryHolderSkeleton } from "contexts/components/AsyncContext";
import { GuildContext } from "contexts/guild/GuildContext";
import { DataList } from "components/card/data/DataCard";
import { config } from "config/config";
import { usePageState } from "utils/State";
import { useLocale, Locale } from "utils/Language";
import NotificationFeed from "components/card/NotificationFeed";
import { UserDataContext } from "contexts/UserDataContext";
import BotStatusIndicator from "components/card/BotStatusIndicator";
import QuickActions from "components/card/QuickActions";
import OnboardingWizard from "components/card/OnboardingWizard";
import ActiveUsers from "components/card/ActiveUsers";
import PageContainer from "components/layout/PageContainer";
import PageHeader from "components/layout/PageHeader";
import PageSection from "components/layout/PageSection";
import { getResponsiveGridClass } from "utils/layout-tokens";

export default function Dashboard() {
    const locale = useLocale();

    usePageInfo(locale({ zh: "儀表板", en: "Dashboard" }));

    return <ServerDetailProvider>
        <UserReports />
    </ServerDetailProvider>;
}

export function UserReports() {
    const { detail } = useContext(GuildDetailContext);
    const { id: serverId } = useContext(GuildContext);
    const user = useContext(UserDataContext);
    const data = config.data.dashboard;
    const [wizardDismissed, setWizardDismissed] = useState(false);

    const query = useQuery({
        queryKey: ["server_advanced_detail", serverId],
        queryFn: () => getServerAdvancedDetails(serverId),
        enabled: data.some((row) => row.advanced),
    });

    const featuresQuery = useQuery({
        queryKey: ["features", serverId],
        queryFn: () => getFeatures(serverId),
    });

    const enabledFeatures = featuresQuery.data?.enabled || [];

    return (
        <PageContainer>
            {user && (
                <PageHeader
                    icon={<LayoutDashboard size={24} />}
                    title={<Locale zh={`歡迎回來，${user.username}`} en={`Welcome back, ${user.username}`} />}
                    description={<Locale zh="集中查看伺服器狀態、近期活動與常用操作，讓日常管理更俐落。" en="Keep tabs on server health, recent activity, and the controls you use most in one polished overview." />}
                    meta={<>
                        <span><Locale zh="即時總覽" en="Live overview" /></span>
                        <span className="h-1 w-1 rounded-full bg-(--text-muted)" />
                        <span><Locale zh="可直接前往常用設定" en="Jump straight into common settings" /></span>
                    </>}
                    actions={<>
                        <ActiveUsers guildId={serverId} page="Dashboard" />
                        <BotStatusIndicator />
                    </>}
                />
            )}

            {!wizardDismissed && enabledFeatures.length === 0 && featuresQuery.data && (
                <OnboardingWizard
                    enabledFeatures={enabledFeatures}
                    onDismiss={() => setWizardDismissed(true)}
                />
            )}

            <PageSection
                title={<Locale zh="常用控制" en="Command Center" />}
                description={<Locale zh="快速處理功能、動作與通知，不必來回切換頁面。" en="Handle features, actions, and notifications without bouncing around the interface." />}
                contentClassName="space-y-0"
            >
                <QuickActions />
                <NotificationFeed />
            </PageSection>

            <div className="space-y-8">
                {data.map((row, key) => (
                    <PageSection
                        key={key}
                        title={row.label ? <SectionLabel label={row.label} /> : null}
                    >
                        <div className={getResponsiveGridClass(row.count)}>
                            {row.advanced ? (
                                <QueryHolderSkeleton query={query} height="160px" count={row.count}>
                                    {() => <Data row={row} detail={query.data} />}
                                </QueryHolderSkeleton>
                            ) : (
                                <Data row={row} detail={detail} />
                            )}
                        </div>
                    </PageSection>
                ))}
            </div>
        </PageContainer>
    );
}

function SectionLabel({ label }) {
    return (
        <span
            className="text-(--text-primary) text-base font-semibold"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
            {label}
        </span>
    );
}

function Data({ row, detail }) {
    const state = usePageState();

    const items = useMemo(
        () => row.items(detail, state),
        [detail, row, state]
    );

    return <DataList items={items} />;
}
