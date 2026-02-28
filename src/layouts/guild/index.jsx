import { Box } from "@mantine/core";
import AdminFooter from "components/footer/FooterAdmin";
import Navbar from "components/navbar/NavbarAdmin";
import Sidebar from "components/sidebar/Sidebar";
import { PageInfoProvider } from "contexts/PageInfoContext";
import React, { useContext } from "react";
import { Navigate, Outlet, Route, useParams } from "react-router-dom";
import { UserDataProvider } from "contexts/UserDataContext";
import { SettingsContext } from "contexts/SettingsContext";
import routes from "../../routes";
import { GuildContext } from "contexts/guild/GuildContext";
import { SIDEBAR_FULL, SIDEBAR_COLLAPSED } from "../../utils/layout-tokens";

function getRoutes(routes) {
    return routes.map((route, key) => {
        return <Route path={route.path} element={route.component} key={key}>
            {route.children && getRoutes(route.children)}
        </Route>
    });
}

function RouteWrapper({ children }) {
    const { sidebarCollapsed } = useContext(SettingsContext);
    const sidebarW = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_FULL;

    return (
        <Box>
            <PageInfoProvider>
                <Sidebar routes={routes} />
                <Box
                    style={{
                        float: 'right',
                        minHeight: '100vh',
                        position: 'relative',
                        transition: 'all 0.25s cubic-bezier(.4,0,.2,1)',
                        overflow: 'visible',
                    }}
                    w={{ base: '100%', xl: `calc(100% - ${sidebarW}px)` }}
                    maw={{ base: '100%', xl: `calc(100% - ${sidebarW}px)` }}
                >
                    <Box pos="fixed" style={{ zIndex: 100 }} w={{ base: '100%', xl: `calc(100% - ${sidebarW}px)` }}>
                        <Navbar />
                    </Box>

                    <Box
                        mx="auto"
                        p={{ base: 20, md: 30 }}
                        pe={20}
                        mih="100vh"
                        pt={50}
                        id="main-content"
                        component="main"
                        style={{
                            animation: "fadeSlideUp 0.3s ease both",
                        }}
                    >
                        {children}
                    </Box>
                    <Box>
                        <AdminFooter />
                    </Box>
                </Box>
            </PageInfoProvider>
        </Box>
    );
}

export default function GuildBoard() {
    const { id } = useParams();
    document.documentElement.dir = "ltr";

    return (
        <GuildContext.Provider value={{ id }}>
            <UserDataProvider>
                <RouteWrapper>
                    <Outlet />
                </RouteWrapper>
            </UserDataProvider>
        </GuildContext.Provider>
    );
}

export function GuildRoutes() {
    return <>
        {getRoutes(routes)}
        <Route path="*" element={<Navigate replace to="dashboard" />} />
    </>
}