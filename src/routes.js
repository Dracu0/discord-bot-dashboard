import React from "react";

import {Icon} from "@chakra-ui/react";
import {RiFunctionFill} from "react-icons/ri";
import {BiServer} from "react-icons/bi";
import {MdFrontHand} from "react-icons/md";
import {IoIosSettings} from "react-icons/io";
// Lazy-load view components for code splitting
const Dashboard = React.lazy(() => import("views/guild/dashboard"));
const Features = React.lazy(() => import("views/guild/features"));
const SettingsPanel = React.lazy(() => import("./views/guild/settings"));
const ActionsBoard = React.lazy(() => import("./views/guild/action"));
const Feature = React.lazy(() => import("./views/guild/feature"));
const ActionTasks = React.lazy(() => import("./views/guild/action/action"));
const TaskConfigBoard = React.lazy(() => import("./views/guild/action/task"));
const SubmitTaskBoard = React.lazy(() => import("./views/guild/action/add"));
import {FeaturesLayout} from "./layouts/guild/features";
import {ActionsLayout} from "./layouts/guild/actions";
import {config} from "./config/config";

/**
 * Public Routes that can access on sidebar
 * Path variables are not allowed (ex: feature/:id)
 */
const routes = [
    {
        category: {zh: "概覽", en: "Overview"},
        name: {zh: "儀表板", en: "Dashboard"},
        icon: <Icon as={BiServer} width="20px" height="20px" color="inherit"/>,
        path: "dashboard",
        component: <Dashboard/>,
    },
    {
        category: {zh: "配置", en: "Configuration"},
        name: {zh: "功能面板", en: "Bot Features"},
        icon: (
            <Icon as={RiFunctionFill} width="20px" height="20px" color="inherit"/>
        ),
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
        icon: (
            <Icon as={IoIosSettings} width="20px" height="20px" color="inherit"/>
        ),
        path: "settings",
        component: <SettingsPanel/>
    },
    {
        category: {zh: "管理", en: "Management"},
        name: {zh: "動作面板", en: "Actions"},
        icon: (
            <Icon as={MdFrontHand} width="20px" height="20px" color="inherit"/>
        ),
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
];

export default routes;
