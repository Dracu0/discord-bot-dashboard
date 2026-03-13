import AdminFooter from "components/footer/FooterAdmin";
import Navbar from "components/navbar/NavbarAdmin";
import Sidebar from "components/sidebar/Sidebar";
import { PageInfoProvider } from "contexts/PageInfoContext";
import React, { useContext, useEffect } from "react";
import { Navigate, Outlet, Route, useParams } from "react-router-dom";
import { ErrorBoundary } from "../../components/ErrorBoundary";
import { UserDataProvider } from "contexts/UserDataContext";
import { FeaturesProvider } from "contexts/FeaturesContext";
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
        <div className="min-h-screen bg-(--surface-secondary) text-(--text-primary)">
            <PageInfoProvider>
                <a href="#main-content" className="skip-to-content">Skip to content</a>
                <Sidebar routes={routes} />
                <div
                    className="relative min-h-screen overflow-x-clip transition-[margin-left] duration-250 ml-0 xl:ml-(--sidebar-w)"
                    data-guild-shell
                    style={{ "--sidebar-w": `${sidebarW}px` }}
                >
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-64"
                        style={{
                            background:
                                "linear-gradient(180deg, color-mix(in srgb, var(--accent-primary) 10%, transparent) 0%, transparent 72%)",
                        }}
                    />


                    <Navbar />

                    <main
                        id="main-content"
                        className="relative z-1 mx-auto min-h-screen w-full max-w-420 px-4 pb-8 sm:px-5 md:px-6 md:pb-10 xl:px-8"
                        data-guild-content
                        style={{
                            animation: "fadeSlideUp 0.3s ease both",
                        }}
                    >
                        <ErrorBoundary>
                            {children}
                        </ErrorBoundary>
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
    useEffect(() => { document.documentElement.dir = "ltr"; }, []);

    return (
        <GuildContext.Provider value={{ id }}>
            <FeaturesProvider>
                <UserDataProvider>
                    <RouteWrapper>
                        <Outlet />
                    </RouteWrapper>
                </UserDataProvider>
            </FeaturesProvider>
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
