import React from "react";

import {IconServer, IconPuzzle, IconSettings, IconHandStop, IconHistory, IconChartBar, IconTrophy} from "@tabler/icons-react";
import {FeaturesLayout} from "./layouts/guild/features";
import {ActionsLayout} from "./layouts/guild/actions";
import {config} from "./config/config";
// Lazy-load view components for code splitting
const Dashboard = React.lazy(() => import("views/guild/dashboard"));
const Features = React.lazy(() => import("views/guild/features"));
const SettingsPanel = React.lazy(() => import("./views/guild/settings"));
const ActionsBoard = React.lazy(() => import("./views/guild/action"));
const Feature = React.lazy(() => import("./views/guild/feature"));
const ActionTasks = React.lazy(() => import("./views/guild/action/action"));
const TaskConfigBoard = React.lazy(() => import("./views/guild/action/task"));
const SubmitTaskBoard = React.lazy(() => import("./views/guild/action/add"));
const AuditLog = React.lazy(() => import("./views/guild/audit-log"));
const Analytics = React.lazy(() => import("./views/guild/analytics"));
const Leaderboard = React.lazy(() => import("./views/guild/leaderboard"));

/**
 * Public Routes that can access on sidebar
 * Path variables are not allowed (ex: feature/:id)
 */
const routes = [
    {
        category: {zh: "概覽", en: "Overview"},
        name: {zh: "儀表板", en: "Dashboard"},
        icon: <IconServer size={20} />,
        path: "dashboard",
        component: <Dashboard/>,
    },
    {
        category: {zh: "配置", en: "Configuration"},
        name: {zh: "功能面板", en: "Bot Features"},
        icon: <IconPuzzle size={20} />,
        path: "features",
        component: <FeaturesLayout />,
        items: Object.entries(config.features).map(([id, feature]) => ({
            name: feature.name,
            path: id
        })),
        children: [
            {
                path: ":feature",
                component: <Feature />,
                hide: true
            },
            {
                path: "*",
                component: <Features/>,
                hide: true
            }
        ]
    },
    {
        category: {zh: "配置", en: "Configuration"},
        name: {zh: "設置", en: "Server Settings"},
        icon: <IconSettings size={20} />,
        path: "settings",
        component: <SettingsPanel/>
    },
    {
        category: {zh: "管理", en: "Management"},
        name: {zh: "動作面板", en: "Actions"},
        icon: <IconHandStop size={20} />,
        path: "actions",
        component: <ActionsLayout />,
        items: Object.entries(config.actions).map(([id, action]) => ({
            name: action.name,
            path: id
        })),
        children: [
            {
                path: ":action",
                hide: true,
                children: [
                    {
                        path: "task/:task",
                        component: <TaskConfigBoard/>,
                    },
                    {
                        path: "add",
                        component: <SubmitTaskBoard/>,
                    },
                    {
                        path: "*",
                        component: <ActionTasks />,
                    }
                ]
            },
            {
                path: "*",
                component: <ActionsBoard/>,
            },
        ]
    },
    {
        category: {zh: "管理", en: "Management"},
        name: {zh: "審計日誌", en: "Audit Log"},
        icon: <IconHistory size={20} />,
        path: "audit-log",
        component: <AuditLog />,
    },
    {
        category: {zh: "管理", en: "Management"},
        name: {zh: "數據分析", en: "Analytics"},
        icon: <IconChartBar size={20} />,
        path: "analytics",
        component: <Analytics />,
    },
    {
        category: {zh: "管理", en: "Management"},
        name: {zh: "排行榜", en: "Leaderboard"},
        icon: <IconTrophy size={20} />,
        path: "leaderboard",
        component: <Leaderboard />,
    },
];

export default routes;
