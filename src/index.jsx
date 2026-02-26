import React, { Suspense, useContext, useEffect } from "react";
import ReactDOM from 'react-dom';
import "assets/css/App.css";
import { BrowserRouter, Navigate, Route, Routes, } from "react-router-dom";
import { Center, ChakraProvider, Spinner, Stack, Text } from "@chakra-ui/react";
import theme from "theme/theme";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

import { hasLoggedIn } from "./api/internal";
import { QueryHolder } from "./contexts/components/AsyncContext";
import { SettingsContext, SettingsProvider } from "./contexts/SettingsContext";
import { config } from "./config/config";
import GuildBoard, { GuildRoutes } from "layouts/guild";

// Lazy-load auth and admin layouts for code splitting
const AuthLayout = React.lazy(() => import("layouts/auth"));
const AdminLayout = React.lazy(() => import("layouts/admin"));

function LazyFallback() {
    return <Center height="100vh">
        <Stack direction="column" align="center">
            <Spinner size="lg" />
            <Text>Loading...</Text>
        </Stack>
    </Center>;
}

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
        },
    },
})

ReactDOM.render(
    <React.StrictMode>
        <title itemProp="name">{config.name} Dashboard</title>

        <ChakraProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <SettingsProvider>
                    <AppRouter />
                </SettingsProvider>
            </QueryClientProvider>
        </ChakraProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

function AppRouter() {
    const loginQuery = useQuery(
        "logged_in",
        () => hasLoggedIn(),
        {
            refetchOnWindowFocus: false
        }
    )
    const { fixedWidth } = useContext(SettingsContext)

    const loggedIn = loginQuery.data

    return (
        <QueryHolder query={loginQuery}>
            <meta name="viewport" content={`width=${fixedWidth ? "340" : "device-width"}, initial-scale=1`} />

            <BrowserRouter>
                <Suspense fallback={<LazyFallback />}>
                <Routes>
                    {loggedIn && (
                        <>
                            <Route path={`/admin`} element={<AdminLayout />} />
                            <Route path="/guild/:id" element={<GuildBoard />}>
                                {GuildRoutes()}
                            </Route>

                            <Route path="/invite" element={
                                <Redirect url={config.inviteUrl} />
                            } />

                            <Route path="*" element={
                                <Navigate replace to="/admin" />
                            } />
                        </>
                    )}

                    {!loggedIn && (
                        <>
                            <Route path={`/auth`} element={<AuthLayout isCallback />} />
                            <Route path={`/signin`} element={<AuthLayout />} exact />
                            <Route path="*" element={
                                <Navigate replace to="/signin" />
                            } />
                        </>
                    )}
                </Routes>
                </Suspense>
            </BrowserRouter>
        </QueryHolder>
    );
}

const TRUSTED_REDIRECT_DOMAINS = ['discord.com', 'discordapp.com'];

function Redirect({ url }) {
    useEffect(() => {
        try {
            const parsed = new URL(url);
            if (TRUSTED_REDIRECT_DOMAINS.some(d => parsed.hostname === d || parsed.hostname.endsWith('.' + d))) {
                window.location.href = url;
            } else {
                console.error('Redirect blocked: untrusted domain', parsed.hostname);
                window.location.href = '/admin';
            }
        } catch {
            console.error('Redirect blocked: invalid URL', url);
            window.location.href = '/admin';
        }
    }, [url]);

    return <Center height="100vh">
        <Stack direction="column" align="center">
            <Spinner size="lg" />
            <Text>Loading...</Text>
        </Stack>
    </Center>;
}