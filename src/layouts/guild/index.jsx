import { Box } from "@mantine/core";
import AdminFooter from "components/footer/FooterAdmin";
import Navbar from "components/navbar/NavbarAdmin";
import Sidebar from "components/sidebar/Sidebar";
import { PageInfoProvider } from "contexts/PageInfoContext";
import React from "react";
import { Navigate, Outlet, Route, useParams } from "react-router-dom";
import { UserDataProvider } from "contexts/UserDataContext";
import routes from "../../routes";
import { GuildContext } from "contexts/guild/GuildContext";

function getRoutes(routes) {
    return routes.map((route, key) => {
        return <Route path={route.path} element={route.component} key={key}>
            {route.children && getRoutes(route.children)}
        </Route>
    });
}

function RouteWrapper({ children }) {
    return (
        <Box>
            <PageInfoProvider>
                <Sidebar routes={routes} />
                <Box
                    style={{
                        float: 'right',
                        minHeight: '100vh',
                        position: 'relative',
                        transition: 'all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)',
                        overflow: 'visible',
                    }}
                    w={{ base: '100%', xl: 'calc(100% - 290px)' }}
                    maw={{ base: '100%', xl: 'calc(100% - 290px)' }}
                >
                    <Box pos="fixed" style={{ zIndex: 100 }} w={{ base: '100%', xl: 'calc(100% - 290px)' }}>
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