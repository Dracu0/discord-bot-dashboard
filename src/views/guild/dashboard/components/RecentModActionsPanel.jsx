import React from "react";
import { Link } from "react-router-dom";
import { Locale } from "utils/Language";
import Card from "components/card/Card";
import { Badge } from "components/ui/badge";
import { Button } from "components/ui/button";
import { toTitleLabel, shortenDiscordId, getModerationTone, formatRecentActionTime, formatActionDate, formatActionClock } from "../utils";

export default function RecentModActionsPanel({ actions, totalActions, activeModerators, latestActionAt, serverId }) {
    const visibleActions = actions.slice(0, 5);

    return (
        <Card variant="panel" className="overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-(--border-subtle) pb-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="font-['Space_Grotesk'] text-lg font-semibold text-(--text-primary)">
                            <Locale zh="近期管理動作" en="Recent Mod Actions" />
                        </h2>
                        <Badge variant="secondary">
                            <Locale zh={`顯示 ${visibleActions.length} 筆`} en={`${visibleActions.length} visible`} />
                        </Badge>
                    </div>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-(--text-secondary)">
                        <Locale zh="顯示近期管理事件，包含執行者、對象、原因與時間。" en="Shows recent moderation events with actor, target, reason, and timestamp." />
                    </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                    <Button asChild variant="outline" size="sm">
                        <Link to={`/guild/${serverId}/audit-log`}>
                            <Locale zh="開啟審計紀錄" en="Open audit log" />
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                        <Link to={`/guild/${serverId}/features`}>
                            <Locale zh="管理紀錄設定" en="Review logging setup" />
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
                <ModerationSnapshot
                    label={<Locale zh="已顯示動作" en="Visible actions" />}
                    value={visibleActions.length}
                    helper={<Locale zh={`總共已記錄 ${totalActions} 筆管理事件`} en={`${totalActions} moderation events recorded overall`} />}
                />
                <ModerationSnapshot
                    label={<Locale zh="活躍管理員" en="Active moderators" />}
                    value={activeModerators}
                    helper={<Locale zh="此時間範圍內的不同管理員數" en="Distinct moderators in this window" />}
                />
                <ModerationSnapshot
                    label={<Locale zh="最近一次動作" en="Latest action" />}
                    value={formatRecentActionTime(latestActionAt)}
                    helper={<Locale zh="最近一筆管理事件的時間" en="Most recent moderation event time" />}
                />
            </div>

            {visibleActions.length > 0 ? (
                <div className="mt-5 grid grid-cols-1 gap-3 2xl:grid-cols-2">
                    {visibleActions.map((action, index) => (
                        <ModerationActivityCard key={`${action?.createdAt || "unknown"}-${action?.targetId || index}`} action={action} />
                    ))}
                </div>
            ) : (
                <div className="mt-5 rounded-3xl border border-dashed border-(--border-subtle) bg-(--surface-primary) px-5 py-8 text-center">
                    <p className="font-medium text-(--text-primary)">
                        <Locale zh="目前還沒有近期管理事件" en="No recent moderation activity yet" />
                    </p>
                    <p className="mt-2 text-sm leading-6 text-(--text-secondary)">
                        <Locale zh="記錄到警告、禁言、踢除、封鎖等管理動作後，事件會顯示在此。" en="Events appear here after warns, timeouts, kicks, bans, or other moderation actions are recorded." />
                    </p>
                </div>
            )}
        </Card>
    );
}

function ModerationSnapshot({ label, value, helper }) {
    return (
        <div className="rounded-2xl border border-(--border-subtle) bg-(--surface-primary) px-4 py-3.5 shadow-(--shadow-xs)">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-(--text-muted)">{label}</p>
            <p className="mt-2 font-['Space_Grotesk'] text-2xl font-semibold text-(--text-primary)">{value}</p>
            <p className="mt-1.5 text-sm leading-6 text-(--text-secondary)">{helper}</p>
        </div>
    );
}

function ModerationActivityCard({ action }) {
    const tone = getModerationTone(action?.action);

    return (
        <div className="rounded-3xl border border-(--border-subtle) bg-(--surface-primary) p-4 shadow-(--shadow-xs) transition-all duration-200 hover:border-(--border-default) hover:shadow-(--shadow-sm)">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={tone.badge}>{toTitleLabel(action?.action) || "Action"}</Badge>
                        <span className={`inline-flex h-2.5 w-2.5 rounded-full ${tone.dot}`} />
                        <span className="text-xs font-medium uppercase tracking-[0.12em] text-(--text-muted)">
                            <Locale zh="管理事件" en="Moderation event" />
                        </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-(--text-primary)">
                        {action?.reason || <Locale zh="未提供理由" en="No reason provided" />}
                    </p>
                </div>

                <div className="shrink-0 rounded-2xl bg-(--surface-secondary) px-3 py-2 text-left sm:text-right">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-(--text-muted)">
                        <Locale zh="時間" en="Time" />
                    </p>
                    <p className="mt-1 text-sm font-semibold text-(--text-primary)">{formatActionDate(action?.createdAt)}</p>
                    <p className="text-xs text-(--text-muted)">{formatActionClock(action?.createdAt)}</p>
                </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
                <ModerationMetaBlock
                    label={<Locale zh="處理對象" en="Target" />}
                    value={action?.targetId}
                    helper={<Locale zh="受影響的成員或紀錄識別碼" en="The member or record affected by this action" />}
                />
                <ModerationMetaBlock
                    label={<Locale zh="執行管理員" en="Moderator" />}
                    value={action?.moderatorId}
                    helper={<Locale zh="這次動作的執行者" en="The moderator who carried out the action" />}
                />
            </div>
        </div>
    );
}

function ModerationMetaBlock({ label, value, helper }) {
    return (
        <div className="rounded-2xl bg-(--surface-secondary)/60 px-3.5 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-(--text-muted)">{label}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                    className="inline-flex items-center rounded-full bg-(--surface-primary) px-2.5 py-1 text-sm font-semibold text-(--text-primary)"
                    style={{ fontFamily: "var(--font-mono)" }}
                    title={value || "—"}
                >
                    {shortenDiscordId(value)}
                </span>
            </div>
            <p className="mt-2 text-sm leading-6 text-(--text-secondary)">{helper}</p>
        </div>
    );
}
