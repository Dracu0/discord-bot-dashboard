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
        <div>
            <PageInfoProvider>
                <Sidebar routes={routes} />
                <div
                    className="min-h-screen relative overflow-visible"
                    style={{
                        float: "right",
                        transition: "all 0.25s cubic-bezier(.4,0,.2,1)",
                        width: `calc(100% - ${sidebarW}px)`,
                        maxWidth: `calc(100% - ${sidebarW}px)`,
                    }}
                >
                    {/* On screens below xl, take full width */}
                    <style>{`
                        @media (max-width: 1279px) {
                            [data-guild-content] {
                                width: 100% !important;
                                max-width: 100% !important;
                            }
                            [data-guild-navbar] {
                                width: 100% !important;
                            }
                        }
                    `}</style>

                    <div
                        className="fixed z-[100]"
                        data-guild-navbar
                        style={{ width: `calc(100% - ${sidebarW}px)` }}
                    >
                        <Navbar />
                    </div>

                    <main
                        id="main-content"
                        className="mx-auto min-h-screen p-5 md:p-[30px] pe-5"
                        data-guild-content
                        style={{
                            paddingTop: 50,
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
        {getRoutes(routes)}
        <Route path="*" element={<Navigate replace to="dashboard" />} />
    </>
}
