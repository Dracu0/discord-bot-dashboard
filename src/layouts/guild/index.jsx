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
        if (route.index) {
            return <Route index element={route.component} key={key} />
        }

        return <Route path={route.path} element={route.component} key={key}>
            {route.children && getRoutes(route.children)}
        </Route>
    });
}

function RouteWrapper({ children }) {
    const { sidebarCollapsed } = useContext(SettingsContext);
    const sidebarW = sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_FULL;

    return (
        <div className="min-h-screen bg-(--surface-secondary)">
            <PageInfoProvider>
                <a href="#main-content" className="skip-to-content">Skip to content</a>
                <Sidebar routes={routes} />
                <div
                    className="min-h-screen relative transition-[margin-left] duration-250"
                    data-guild-shell
                    style={{
                        marginLeft: sidebarW,
                    }}
                >
                    <style>{`
                        @media (max-width: 1279px) {
                            [data-guild-shell] {
                                margin-left: 0 !important;
                            }
                        }
                    `}</style>

                    <Navbar />

                    <main
                        id="main-content"
                        className="mx-auto min-h-screen px-4 pb-6 sm:px-5 md:px-6 md:pb-7 xl:px-7.5"
                        data-guild-content
                        style={{
                            animation: "fadeSlideUp 0.3s ease both",
                        }}
                    >
                        {children}
                    </main>
                    <div>
                        <AdminFooter />
                    </div>
                </div>
            </PageInfoProvider>
        </div>
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
        <Route index element={<Navigate replace to="dashboard" />} />
        {getRoutes(routes)}
        <Route path="*" element={<Navigate replace to="dashboard" />} />
    </>
}
