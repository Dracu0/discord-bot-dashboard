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
import { Separator } from "components/ui/separator";

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
        <div style={{ paddingTop: "80px" }}>
            {user && (
                <div className="mb-6">
                    <div className="flex justify-between items-start flex-wrap gap-2">
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
                </div>
            )}
            {!wizardDismissed && enabledFeatures.length === 0 && featuresQuery.data && (
                <OnboardingWizard
                    enabledFeatures={enabledFeatures}
                    onDismiss={() => setWizardDismissed(true)}
                />
            )}
            <QuickActions />
            <NotificationFeed />
            <div className="flex flex-col gap-8">
                {data.map((row, key) => {
                    const count = row.count

                    return (
                        <div key={key}>
                            {row.label && <SectionHeader label={row.label} />}
                            <div
                                className="grid gap-5"
                                style={{
                                    gridTemplateColumns: `repeat(1, minmax(0, 1fr))`,
                                }}
                                data-count={count}
                            >
                                <style>{`
                                    @media (min-width: 768px) {
                                        [data-count="${count}"] {
                                            grid-template-columns: repeat(${Math.min(2, count)}, minmax(0, 1fr));
                                        }
                                    }
                                    @media (min-width: 1536px) {
                                        [data-count="${count}"] {
                                            grid-template-columns: repeat(${count}, minmax(0, 1fr));
                                        }
                                    }
                                `}</style>
                                {row.advanced ? (
                                    <QueryHolderSkeleton query={query} height="400px" count={row.count}>
                                        {() => <Data row={row} detail={query.data} />}
                                    </QueryHolderSkeleton>
                                ) : (
                                    <Data row={row} detail={detail} />
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

function SectionHeader({ label }) {
    return (
        <div className="mb-4">
            <h3
                className="text-(--text-primary) mb-2"
                style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: "-0.01em",
                }}
            >
                {label}
            </h3>
            <Separator className="opacity-40 bg-(--border-subtle)" />
        </div>
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
