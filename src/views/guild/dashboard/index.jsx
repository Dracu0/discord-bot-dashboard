import React, { useContext, useMemo, useState } from "react";
import { usePageInfo } from "../../../contexts/PageInfoContext";
import { GuildDetailContext, ServerDetailProvider } from "../../../contexts/guild/GuildDetailContext";
import { useQuery } from "@tanstack/react-query";
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

export default function Dashboard() {
    const locale = useLocale()

    usePageInfo(locale({ zh: "\u5100\u8868\u677f", en: "Dashboard" }))

    return <ServerDetailProvider>
        <UserReports />
    </ServerDetailProvider>
}

export function UserReports() {
    const { detail } = useContext(GuildDetailContext)
    const { id: serverId } = useContext(GuildContext)
    const user = useContext(UserDataContext)
    const data = config.data.dashboard
    const [wizardDismissed, setWizardDismissed] = useState(false)

    const query = useQuery({
        queryKey: ["server_advanced_detail", serverId],
        queryFn: () => getServerAdvancedDetails(serverId),
        enabled: data.some(row => row.advanced)
    })

    const featuresQuery = useQuery({
        queryKey: ["features", serverId],
        queryFn: () => getFeatures(serverId),
    })

    const enabledFeatures = featuresQuery.data?.enabled || [];

    return (
        <div className="pt-20 max-w-7xl mx-auto">
            {/* Header */}
            {user && (
                <div className="mb-6 flex justify-between items-center flex-wrap gap-2">
                    <div>
                        <h2
                            className="text-(--text-primary) font-bold text-2xl"
                            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                            <Locale
                                zh={`\u6b61\u8fce\u56de\u4f86, ${user.username}`}
                                en={`Welcome back, ${user.username}`}
                            />
                        </h2>
                        <span className="text-(--text-secondary) text-sm mt-1 block">
                            <Locale zh="\u9019\u662f\u60a8\u4f3a\u670d\u5668\u7684\u6982\u89bd" en="Here's an overview of your server" />
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <ActiveUsers guildId={serverId} page="Dashboard" />
                        <BotStatusIndicator />
                    </div>
                </div>
            )}

            {/* Onboarding */}
            {!wizardDismissed && enabledFeatures.length === 0 && featuresQuery.data && (
                <OnboardingWizard
                    enabledFeatures={enabledFeatures}
                    onDismiss={() => setWizardDismissed(true)}
                />
            )}

            {/* Quick Actions */}
            <QuickActions />

            {/* Notifications — compact */}
            <div className="mb-6">
                <NotificationFeed />
            </div>

            {/* Data Grid */}
            <div className="flex flex-col gap-6">
                {data.map((row, key) => (
                    <section key={key}>
                        {row.label && <SectionLabel label={row.label} />}
                        <div className={gridClass(row.count)}>
                            {row.advanced ? (
                                <QueryHolderSkeleton query={query} height="160px" count={row.count}>
                                    {() => <Data row={row} detail={query.data} />}
                                </QueryHolderSkeleton>
                            ) : (
                                <Data row={row} detail={detail} />
                            )}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}

function gridClass(count) {
    if (count >= 4) return "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4";
    if (count === 3) return "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4";
    if (count === 2) return "grid grid-cols-1 md:grid-cols-2 gap-4";
    return "grid grid-cols-1 gap-4";
}

function SectionLabel({ label }) {
    return (
        <h3
            className="text-(--text-primary) text-base font-semibold mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
            {label}
        </h3>
    )
}

function Data({ row, detail }) {
    const state = usePageState()

    const items = useMemo(
        () => row.items(detail, state),
        [detail, state]
    )

    return <DataList items={items} />
}
