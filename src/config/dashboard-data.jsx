import { DataTypes } from "../variables/type";
import React from "react";
import { Locale } from "../utils/Language";

/**
 * Dashboard data rows for the bot - uses real data from the backend
 *
 * Layout:
 *   Row 1 – Member stats (2 individual cards)
 *   Row 2 – Server overview info map (full width)
 *   Row 3 – Activity counters (4 stat cards across)
 *   Row 4 – Data tables (XP Leaderboard + Recent Mod Actions side-by-side)
 *
 * @type Array<DashboardDataRow>
 */
export const dashboardData = [
    // ── Row 1: Member Stats ───────────────────────────────────
    {
        label: "Members",
        advanced: false,
        count: 2,
        items: (detail) => [
            {
                name: <Locale en="Total Members" />,
                value: detail.members || 0,
                type: DataTypes.Statistics,
            },
            {
                name: <Locale en="Online Members" />,
                value: detail.online || 0,
                type: DataTypes.Statistics,
            },
        ],
    },
    // ── Row 2: Server Overview (full width) ───────────────────
    {
        label: null,
        advanced: false,
        count: 1,
        items: (detail) => [
            {
                name: <Locale en="Server Overview" />,
                description: <Locale en="Current server configuration status" />,
                type: DataTypes.InfoMap,
                value: [
                    {
                        name: "Welcome System",
                        value: detail.welcomeEnabled ? "✅ Enabled" : "❌ Disabled",
                    },
                    {
                        name: "XP System",
                        value: detail.xpEnabled ? "✅ Enabled" : "❌ Disabled",
                    },
                    {
                        name: "Suggestions",
                        value: detail.suggestionsEnabled ? "✅ Enabled" : "❌ Disabled",
                    },
                    {
                        name: "Minecraft Servers",
                        value: `${detail.mcServers || 0} configured`,
                    },
                    {
                        name: "Mod Log",
                        value: detail.modLogEnabled ? "✅ Enabled" : "❌ Disabled",
                    },
                ],
            },
        ],
    },
    // ── Row 3: Activity Counters ──────────────────────────────
    {
        label: "Activity",
        advanced: true,
        count: 4,
        items: (detail) => {
            const xp = detail?.xp || {};
            const suggestions = detail?.suggestions || {};
            const moderation = detail?.moderation || {};

            return [
                {
                    name: <Locale en="XP Tracked Users" />,
                    value: xp.totalTrackedUsers || 0,
                    type: DataTypes.Statistics,
                },
                {
                    name: <Locale en="Total Suggestions" />,
                    value: suggestions.total || 0,
                    type: DataTypes.Statistics,
                },
                {
                    name: <Locale en="Pending Suggestions" />,
                    value: suggestions.pending || 0,
                    type: DataTypes.Statistics,
                },
                {
                    name: <Locale en="Total Mod Actions" />,
                    value: moderation.totalActions || 0,
                    type: DataTypes.Statistics,
                },
            ];
        },
    },
    // ── Row 4: Data Tables (side-by-side) ─────────────────────
    {
        label: "Detailed Reports",
        advanced: true,
        count: 2,
        items: (detail) => {
            const xp = detail?.xp || {};
            const moderation = detail?.moderation || {};

            return [
                {
                    name: <Locale en="XP Leaderboard" />,
                    type: DataTypes.Table,
                    variant: "leaderboard",
                    description: <Locale en="See who is leading the server and how close the chase is getting." />,
                    columns: [
                        { header: "Rank", accessor: "rank" },
                        { header: "User", accessor: "userName" },
                        { header: "Level", accessor: "level" },
                        { header: "XP", accessor: "xp" },
                    ],
                    value: xp.leaderboard || [],
                },
                {
                    name: <Locale en="Recent Mod Actions" />,
                    type: DataTypes.Table,
                    description: <Locale en="A quick snapshot of the latest moderation events across your server." />,
                    columns: [
                        {
                            header: "Action",
                            accessor: "action",
                            wrapper: (value) => (
                                <span
                                    className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                                    style={{
                                        background: "var(--sidebar-active)",
                                        color: "var(--accent-primary)",
                                    }}
                                >
                                    {value || "—"}
                                </span>
                            ),
                        },
                        {
                            header: "Target",
                            accessor: "targetId",
                            wrapper: (value) => (
                                <div className="min-w-0">
                                    <span className="block text-sm font-semibold text-(--text-primary) truncate">{value || "—"}</span>
                                </div>
                            ),
                        },
                        {
                            header: "Moderator",
                            accessor: "moderatorId",
                            wrapper: (value) => (
                                <span className="text-sm font-medium text-(--text-secondary)">{value || "—"}</span>
                            ),
                        },
                        {
                            header: "Reason",
                            accessor: "reason",
                            wrapper: (value) => (
                                <div className="max-w-56">
                                    <span className="block text-sm text-(--text-secondary) line-clamp-2">{value || "No reason provided"}</span>
                                </div>
                            ),
                        },
                        {
                            header: "Date",
                            accessor: "createdAt",
                            wrapper: (v) => (
                                <div className="min-w-28">
                                    <span className="block text-sm font-medium text-(--text-primary)">
                                        {v ? new Date(v).toLocaleDateString() : "—"}
                                    </span>
                                    <span className="block text-xs text-(--text-muted)">
                                        {v ? new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                                    </span>
                                </div>
                            ),
                        },
                    ],
                    value: moderation.recentActions || [],
                },
            ];
        },
    },
]