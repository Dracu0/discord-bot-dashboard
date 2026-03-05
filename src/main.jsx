import React, { Suspense, useContext, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { MantineProvider, Center, Loader, Stack, Text } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import 'assets/css/App.css';

import { hasLoggedIn } from './api/internal';
import { QueryHolder } from './contexts/components/AsyncContext';
import { SettingsContext, SettingsProvider } from './contexts/SettingsContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { config } from './config/config';
import { theme } from './theme/theme';
import GuildBoard, { GuildRoutes } from 'layouts/guild';

const AuthLayout = React.lazy(() => import('layouts/auth'));
const AdminLayout = React.lazy(() => import('layouts/admin'));

function LazyFallback() {
  return (
    <Center h="100vh">
      <Stack align="center" gap="sm">
        <Loader size="lg" />
        <Text>Loading...</Text>
      </Stack>
    </Center>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});

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
  return null;
}

function AppRouter() {
  const loginQuery = useQuery({
    queryKey: ['logged_in'],
    queryFn: () => hasLoggedIn(),
    refetchOnWindowFocus: false,
  });
  const { fixedWidth } = useContext(SettingsContext);
  const loggedIn = loginQuery.data;

  // Show a loading spinner while the auth check (HEAD /auth) is pending
  if (loginQuery.isLoading) {
    return (
      <Center h="100vh">
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <QueryHolder query={loginQuery}>
      <meta
        name="viewport"
        content={`width=${fixedWidth ? '340' : 'device-width'}, initial-scale=1`}
      />
      <BrowserRouter>
        <Suspense fallback={<LazyFallback />}>
          <Routes>
            {loggedIn && (
              <>
                <Route path="/admin" element={<AdminLayout />} />
                <Route path="/guild/:id" element={<GuildBoard />}>
                  {GuildRoutes()}
                </Route>
                <Route path="/invite" element={<Redirect url={config.inviteUrl} />} />
                <Route path="*" element={<Navigate replace to="/admin" />} />
              </>
            )}
            {!loggedIn && (
              <>
                <Route path="/auth" element={<AuthLayout isCallback />} />
                <Route path="/signin" element={<AuthLayout />} />
                <Route path="*" element={<Navigate replace to="/signin" />} />
              </>
            )}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </QueryHolder>
  );
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <ErrorBoundary>
        <Notifications position="top-right" />
        <QueryClientProvider client={queryClient}>
          <SettingsProvider>
            <AppRouter />
          </SettingsProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </MantineProvider>
  </React.StrictMode>
);
